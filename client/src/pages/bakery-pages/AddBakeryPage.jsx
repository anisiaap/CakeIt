import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBakerySchema } from '../../validation/schemas';
import { registerUser, checkFieldAvailability } from '../../services/authService';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function AddBakeryPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        description: '',
        image: null,
        fiscalDocuments: null,
        sanepidApproval: null,
        locationProof: null,
        bankInfo: {
            iban: '',
            bankName: '',
            accountOwner: '',
        },
    });
    const [errors, setErrors] = useState({});
    const [availability, setAvailability] = useState({});
    const [gdprAccepted, setGdprAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = async (e) => {
        const { name, value } = e.target;

        // Clear specific field errors
        setErrors((prev) => ({ ...prev, [name]: undefined }));

        // Email validation
        if (name === 'email') {
            const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,3}$/; // Enhanced email validation
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    email: 'Invalid email format.',
                }));
            }
        }

        // IBAN validation
        if (name === 'bankInfo.iban') {
            const ibanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{4}\d{16}$/; // IBAN structure
            if (!ibanRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    'bankInfo.iban': 'Invalid IBAN format.',
                }));
            }
        }

        // Update formData for bankInfo fields
        if (name.startsWith('bankInfo.')) {
            const field = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                bankInfo: { ...prev.bankInfo, [field]: value },
            }));
        } else {
            // Update formData for other fields
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Check availability for unique fields (email, name)
        if (['email', 'name'].includes(name)) {
            try {
                const response = await checkFieldAvailability(name, value, 'bakery');
                setAvailability((prev) => ({ ...prev, [name]: response.available }));
                if (!response.available) {
                    setErrors((prev) => ({
                        ...prev,
                        [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} is already in use.`,
                    }));
                }
            } catch (error) {
                console.error(`Error checking availability for ${name}:`, error);
            }
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear specific field errors
        setFormData((prev) => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};

        try {
            await addBakerySchema.validate(formData, { abortEarly: false });
            setErrors({}); // Clear all previous errors
        } catch (validationError) {
            validationError.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
        }

        if (!gdprAccepted) {
            validationErrors.gdpr = 'You must accept the GDPR policy to proceed.';
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'bankInfo') {
                Object.entries(formData.bankInfo).forEach(([subKey, subValue]) => {
                    formDataToSend.append(`bankDetails.${subKey}`, subValue);
                });
            } else if (['fiscalDocuments', 'sanepidApproval', 'locationProof', 'image'].includes(key)) {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        formDataToSend.append('role', 'bakery');

        setIsSubmitting(true);
        try {
            const response = await registerUser(formDataToSend);
            alert(response.message);
            navigate('/login-bakery');
        } catch (err) {
            setIsSubmitting(false);

            if (err.response && err.response.data) {
                const { field, message } = err.response.data;
                if (field) {
                    setErrors((prev) => ({ ...prev, [field]: message }));
                } else {
                    setErrors((prev) => ({ ...prev, general: message || 'An error occurred.' }));
                }
            } else {
                setErrors((prev) => ({ ...prev, general: 'An error occurred.' }));
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: 'url("https://source.unsplash.com/1600x900/?bakery")' }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create a Bakery Account</h1>
                {errors.general && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                        <p>{errors.general}</p>
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
                    {[
                        { id: 'name', label: 'Bakery Name', type: 'text', tooltip: 'Choose a unique name for your bakery.' },
                        { id: 'email', label: 'Email', type: 'email', tooltip: 'Provide a valid email address. Must be unique.' },
                        { id: 'password', label: 'Password', type: 'password', tooltip: 'Must be at least 8 characters long and include a special character.' },
                        { id: 'location', label: 'Location', type: 'text', tooltip: 'Provide the physical address where your bakery operates.' },
                        { id: 'description', label: 'Description', type: 'text', tooltip: 'Describe your bakery and its specialties.' },
                        { id: 'iban', label: 'Bank IBAN', type: 'text', tooltip: 'Provide a valid IBAN for payment transactions.', field: 'bankInfo.iban' },
                        { id: 'bankName', label: 'Bank Name', type: 'text', tooltip: 'Provide the name of your bank for transactions.', field: 'bankInfo.bankName' },
                        { id: 'accountOwner', label: 'Account Owner', type: 'text', tooltip: 'Enter the name of the person or entity that owns the bank account.', field: 'bankInfo.accountOwner' },
                    ].map(({ id, label, type, tooltip, field }) => (
                        <div key={id}>
                            <label htmlFor={id} className="block text-sm font-medium">
                                {label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id={id}
                                name={field || id}
                                type={type}
                                value={field ? formData.bankInfo[field.split('.')[1]] : formData[id]}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-4 py-2 border rounded-md ${
                                    errors[field || id] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                data-tooltip-id={`${id}-tooltip`}
                                data-tooltip-content={tooltip}
                            />
                            <Tooltip id={`${id}-tooltip`} />
                            {errors[field || id] && <p className="text-red-500 text-sm">{errors[field || id]}</p>}
                        </div>
                    ))}

                    {/* File Uploads */}
                    {[
                        { id: 'image', label: 'Upload Bakery Image', tooltip: 'Upload an image that represents your bakery.' },
                        { id: 'fiscalDocuments', label: 'Upload Fiscal Documents', tooltip: 'Upload official fiscal documents for your bakery.' },
                        { id: 'sanepidApproval', label: 'Upload SANEPID Approval', tooltip: 'Upload your SANEPID approval document.' },
                        { id: 'locationProof', label: 'Upload Location Proof', tooltip: 'Upload a document proving your bakery\'s physical location.' },
                    ].map(({ id, label, tooltip }) => (
                        <div key={id}>
                            <label htmlFor={id} className="block text-sm font-medium">
                                {label} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id={id}
                                name={id}
                                accept={id === 'image' ? 'image/*' : '.pdf'}
                                onChange={handleFileChange}
                                className={`mt-1 block w-full px-4 py-2 border rounded-md ${
                                    errors[id] ? 'border-red-500' : 'border-gray-300'
                                }`}
                                data-tooltip-id={`${id}-tooltip`}
                                data-tooltip-content={tooltip}
                            />
                            <Tooltip id={`${id}-tooltip`} />
                            {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
                        </div>
                    ))}

                    {/* GDPR Checkbox */}
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            id="gdpr"
                            className={`h-5 w-5 text-black border rounded ${
                                errors.gdpr ? 'border-red-500' : 'border-gray-300'
                            }`}
                            checked={gdprAccepted}
                            onChange={() => setGdprAccepted(!gdprAccepted)}
                        />
                        <label htmlFor="gdpr" className="ml-3 text-sm text-gray-700">
                            I accept the GDPR policy and agree to provide my data for account creation purposes.
                        </label>
                    </div>
                    {errors.gdpr && <p className="text-sm text-red-500 mt-1">{errors.gdpr}</p>}
                    {/* Information Note */}
                    <div className="bg-gray-100 p-4 rounded-md">
                        <p className="text-sm text-gray-600">
                            Please note: After submitting this form, the provided documents will be analyzed by our team. Your account will only be created after approval. You will receive an email at the provided address with the status of your application.
                        </p>
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded-md text-white ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
