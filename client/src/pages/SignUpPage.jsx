import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signUpSchema } from '../validation/schemas';
import { registerClient, checkFieldAvailability } from '../services/authService';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [availability, setAvailability] = useState({});

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Clear specific field errors
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    // Validate email format
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Invalid email format.',
        }));
        return;
      }
    }

    // Update formData
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check availability for unique fields (username, email)
    if (['username', 'email'].includes(name)) {
      try {
        const response = await checkFieldAvailability(name, value, 'client');
        setAvailability((prev) => ({ ...prev, [name]: response.available }));
        if (!response.available) {
          setErrors((prev) => ({
            ...prev,
            [name]: `${name.charAt(0).toUpperCase() + name.slice(1)} "${value}" is already in use.`,
          }));
        }
      } catch (error) {
        console.error(`Error checking availability for ${name}:`, error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    try {
      await signUpSchema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (validationError) {
      validationError.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
    }

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await registerClient({ ...formData, role: 'client' });
      alert(response.message);
      setIsAuthenticated(true);
      navigate('/home');
    } catch (err) {
      if (err.response && err.response.data) {
        const { field, message } = err.response.data;
        if (field) {
          setErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setErrors((prev) => ({ ...prev, general: message || 'An unknown error occurred.' }));
        }
      } else {
        setErrors((prev) => ({ ...prev, general: 'An unknown error occurred.' }));
      }
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://source.unsplash.com/1600x900/?baking")' }}
      >
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an Account</h1>
          {errors.general && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                <p>{errors.general}</p>
              </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {[
              { id: 'firstName', label: 'First Name', type: 'text', tooltip: 'Enter your first name.' },
              { id: 'lastName', label: 'Last Name', type: 'text', tooltip: 'Enter your last name.' },
              { id: 'username', label: 'Username', type: 'text', tooltip: 'Choose a unique username.' },
              { id: 'email', label: 'Email', type: 'email', tooltip: 'Provide a valid email address. Must be unique.' },
              { id: 'phone', label: 'Phone Number', type: 'text', tooltip: 'Enter your phone number.' },
              { id: 'address', label: 'Address', type: 'text', tooltip: 'Provide your address.' },
              { id: 'password', label: 'Password', type: 'password', tooltip: 'Must be at least 8 characters long with a special character.' },
              { id: 'confirmPassword', label: 'Confirm Password', type: 'password', tooltip: 'Re-enter your password to confirm.' },
            ].map(({ id, label, type, tooltip }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                      id={id}
                      name={id}
                      type={type}
                      value={formData[id]}
                      onChange={handleChange}
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
            <button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-black hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
  );
}
