import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { sendApiRequest } from '../services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await sendApiRequest('post', '/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (response.success) {
        localStorage.setItem('token', response.token);
        toast.success('Signup successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e6f0fa' }}>
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md" style={{ backgroundColor: '#ffffff' }}>
        <h2 className="text-2xl font-bold text-center mb-4" style={{ color: '#1e3a8a' }}>Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2" style={{ color: '#1e3a8a' }} htmlFor="name">Name</label>
            <input
              {...register('name', {
                required: 'Name is required',
                maxLength: {
                  value: 15,
                  message: 'Name cannot exceed 15 characters',
                },
              })}
              type="text"
              id="name"
              className="w-full p-2 border rounded"
              style={{ color: '#1e3a8a', backgroundColor: '#ffffff', borderColor: '#d1d5db' }}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2" style={{ color: '#1e3a8a' }} htmlFor="email">Email</label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format',
                },
              })}
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              style={{ color: '#1e3a8a', backgroundColor: '#ffffff', borderColor: '#d1d5db' }}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2" style={{ color: '#1e3a8a' }} htmlFor="password">Password</label>
            <input
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]+$/,
                  message: 'Password must contain 1 uppercase, 1 lowercase, and no special characters',
                },
              })}
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              style={{ color: '#1e3a8a', backgroundColor: '#ffffff', borderColor: '#d1d5db' }}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-2" style={{ color: '#1e3a8a' }} htmlFor="confirmPassword">Confirm Password</label>
            <input
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
              })}
              type="password"
              id="confirmPassword"
              className="w-full p-2 border rounded"
              style={{ color: '#1e3a8a', backgroundColor: '#ffffff', borderColor: '#d1d5db' }}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-2 rounded flex items-center justify-center"
            style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <p className="text-center mt-4" style={{ color: '#1e3a8a' }}>
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;