const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const { registerSchema, clientRegisterSchema } = require('../utils/validationSchemas');
const Bakery = require('../models/Bakery');
const Client = require('../models/Client');

const registerClient = async (req, res, next) => {
    console.log('Request Body:', req.body);
    try {
        // Exclude role and confirmPassword before validation
        const { role, confirmPassword, ...rest } = req.body;

        // Validate request body using Joi schema
        const { error } = clientRegisterSchema.validate(rest);
        if (error) {
            console.error('Validation error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, username, password } = rest;

        // Check if the email or username already exists
        const existingEmail = await Client.findOne({ email });
        const existingUsername = await Client.findOne({ username });

        if (existingEmail) {
            console.error(`Client already exists with email: ${email}`);
            return res.status(400).json({ message: `Email "${email}" is already in use.`, field: 'email' });
        }

        if (existingUsername) {
            console.error(`Client already exists with username: ${username}`);
            return res.status(400).json({ message: `Username "${username}" is already in use.`, field: 'username' });
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create the new client
        const newClient = new Client({
            ...rest,
            passwordHash,
        });

        await newClient.save();
        console.log('New client registered successfully:', newClient);

        res.status(201).json({ message: 'Client registered successfully!' });
    } catch (err) {
        console.error('Error during client registration:', err.message);

        // Handle MongoDB unique index errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use.`,
                field,
            });
        }

        next(err);
    }
};
const { GridFSBucket } = require('mongodb');
const {Types, connection} = require("mongoose"); // Import GridFSBucket

const register = async (req, res, next) => {
    console.log('Uploaded File IDs:', req.uploadedFileIds); // Store file IDs for cleanup

    try {
        console.log('Original Request Body:', req.body);
        console.log('Original Request Files:', req.files);

        // Transform flat bankDetails fields into a nested object
        if (req.body['bankDetails.iban'] || req.body['bankDetails.bankName'] || req.body['bankDetails.accountOwner']) {
            req.body.bankDetails = {
                iban: req.body['bankDetails.iban'],
                bankName: req.body['bankDetails.bankName'],
                accountOwner: req.body['bankDetails.accountOwner'],
            };

            delete req.body['bankDetails.iban'];
            delete req.body['bankDetails.bankName'];
            delete req.body['bankDetails.accountOwner'];
        }

        console.log('Transformed Request Body:', req.body);

        // Validate request body using Joi schema
        const { error } = registerSchema.validate(req.body);
        if (error) {
            // Trigger cleanup if validation fails
            console.log(`Deleted file with ID: `);
            await cleanupFiles(req.uploadedFileIds);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { email, name, password, role, ...rest } = req.body;

        if (role !== 'bakery') {
            // Trigger cleanup if invalid role
            await cleanupFiles(req.uploadedFileIds);
            return res.status(400).json({ message: 'Invalid role specified for this endpoint.' });
        }

        // Check for duplicate email and name
        const existingEmail = await Bakery.findOne({ email });
        const existingName = await Bakery.findOne({ name });

        if (existingEmail) {
            await cleanupFiles(req.uploadedFileIds);
            return res.status(400).json({ message: `Email "${email}" is already in use.`, field: 'email' });
        }

        if (existingName) {
            await cleanupFiles(req.uploadedFileIds);
            return res.status(400).json({ message: `Bakery name "${name}" is already in use.`, field: 'name' });
        }

        // Hash the password
        const passwordHashed = await bcrypt.hash(password, 10);

        // Prepare user data
        const userData = { email, name, passwordHashed, ...rest, status: 'pending' };

        // Save file references from GridFS
        console.log('Uploaded Files:', req.files);
        if (req.files) {
            console.log('Uploaded Files:', req.files);

            userData.imageUrl = req.files.image?.[0]?.id || req.files.image?.[0]?._id || null;
            userData.fiscalDocuments = req.files.fiscalDocuments?.map((file) => file.id || file._id) || [];
            userData.sanepidApproval = req.files.sanepidApproval?.[0]?.id || req.files.sanepidApproval?.[0]?._id || null;
            userData.locationProof = req.files.locationProof?.[0]?.id || req.files.locationProof?.[0]?._id || null;

            // Track file IDs for cleanup
            req.uploadedFileIds.push(
                userData.imageUrl,
                ...userData.fiscalDocuments,
                userData.sanepidApproval,
                userData.locationProof
            );

            console.log('Resolved File IDs:', {
                image: userData.imageUrl,
                fiscalDocuments: userData.fiscalDocuments,
                sanepidApproval: userData.sanepidApproval,
                locationProof: userData.locationProof,
            });
        }

        console.log('User Data:', userData);

        // Save to database
        const newBakery = new Bakery(userData);
        await newBakery.save();

        res.status(201).json({ message: 'Bakery registration request submitted successfully.' });
    } catch (err) {
        console.error('Error during registration:', err.message);

        // Clean up files on error
        await cleanupFiles(uploadedFileIds);

        if (err.code === 11000) {
            const field = Object.keys(err.keyValue)[0];
            const value = err.keyValue[field];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} "${value}" is already in use.`,
                field,
            });
        }

        next(err);
    }
};

// Function to clean up uploaded files
const cleanupFiles = async (fileIds) => {
    if (!fileIds || fileIds.length === 0) return;
    console.log(`Deleted file with ID: ${fileIds}`);
    try {
        const bucket = new GridFSBucket(connection.db, { bucketName: 'uploads' });

        for (const fileId of fileIds) {
            if (fileId) {
                await bucket.delete(new Types.ObjectId(fileId));
                console.log(`Deleted file with ID: ${fileId}`);
            }
        }
    } catch (err) {
        console.error('Error during file cleanup:', err.message);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const Model = role === 'bakery' ? Bakery : Client;

        // Find user by email
        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if the user is approved
        if (role === 'bakery' && user.status !== 'approved') {
            return res.status(403).json({ message: 'Your account is not approved yet.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken({ id: user._id, role }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
    }
};

const logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully.' });
};

const checkField = async (req, res) => {
    const { field, value, role } = req.query;

    if (!field || !value || !role) {
        return res.status(400).json({ message: 'Field, value, and role are required parameters.' });
    }

    try {
        // Determine the model based on role
        const Model = role === 'bakery' ? Bakery : role === 'client' ? Client : null;

        if (!Model) {
            return res.status(400).json({ message: 'Invalid role specified.' });
        }

        // Check if the field exists in the database
        const exists = await Model.findOne({ [field]: value });

        if (exists) {
            return res.status(200).json({ available: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use.` });
        }

        return res.status(200).json({ available: true });
    } catch (err) {
        console.error('Error checking field availability:', err.message);
        res.status(500).json({ message: 'Error checking field availability.' });
    }
};
const uploads = async (req, res) => {
    try {
        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const readStream = gfs.openDownloadStreamByName(req.params.filename);

        // Set content type
        res.set('Content-Type', file[0].contentType);
        res.set('Content-Disposition', `attachment; filename="${file[0].filename}"`);

        readStream.pipe(res);
    } catch (err) {
        console.error('Error retrieving file:', err.message);
        res.status(500).json({ message: 'Error retrieving file' });
    }
};
module.exports = { register,registerClient, login, logout, checkField, uploads };
