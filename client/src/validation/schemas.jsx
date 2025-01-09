import * as yup from 'yup';

export const signUpSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .required('Password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    phone: yup
        .string()
        .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits')
        .required('Phone number is required'),
    address: yup.string().required('Address is required'),
});

export const addBakerySchema = yup.object().shape({
    name: yup.string().required('Bakery Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[!@#$%^&*])/, 'Password must include a special character (!@#$%^&*)')
        .required('Password is required'),
    location: yup.string().required('Location is required'),
    description: yup.string(),
    fiscalDocuments: yup.mixed().required('Fiscal Documents are required'),
    sanepidApproval: yup.mixed().required('SANEPID Approval is required'),
    locationProof: yup.mixed().required('Location Proof is required'),
    bankInfo: yup.object().shape({
        iban: yup.string().required('Bank IBAN is required'),
        bankName: yup.string().required('Bank Name is required'),
        accountOwner: yup.string().required('Account Owner is required'),
    }),
});

