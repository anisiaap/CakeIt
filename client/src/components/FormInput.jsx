// import React from 'react';
//
// export default function FormInput({ label, type = 'text', id, name, value, onChange, placeholder, error, required }) {
//     return (
//         <div>
//             <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//                 {label}
//             </label>
//             <input
//                 type={type}
//                 id={id}
//                 name={name}
//                 value={value}
//                 onChange={onChange}
//                 placeholder={placeholder}
//                 required={required}
//                 className={`mt-1 block w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-black focus:border-black`}
//             />
//             {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
//         </div>
//     );
// }
