// src/pages/CustomerProfilePage.jsx
import React from 'react';

function CustomerProfilePage() {
  // Hardcoded customer data
  const customerData = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe123',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    // Add more fields as needed
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">First Name</label>
            <p className="text-gray-900">{customerData.firstName}</p>
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
            <p className="text-gray-900">{customerData.lastName}</p>
          </div>
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <p className="text-gray-900">{customerData.username}</p>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email</label>
            <p className="text-gray-900">{customerData.email}</p>
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <p className="text-gray-900">{customerData.phoneNumber}</p>
          </div>
          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <p className="text-gray-900">{customerData.address}</p>
          </div>
        </div>
        {/* Edit Profile Button */}
        <div className="mt-6">
          <button
            onClick={() => alert('Edit profile functionality not implemented yet.')}
            className="bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfilePage;
