import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    displayName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, authError, clearError } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Validation for sign up
        if (formData?.password !== formData?.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData?.password?.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        if (!formData?.fullName?.trim()) {
          setError('Full name is required');
          return;
        }

        const { error } = await signUp(formData?.email, formData?.password, {
          full_name: formData?.fullName,
          display_name: formData?.displayName || formData?.fullName,
          role: 'family_member'
        });

        if (error) {
          setError(error?.message);
          return;
        }

        // Success
        onSuccess?.();
      } else {
        // Sign in
        const { error } = await signIn(formData?.email, formData?.password);

        if (error) {
          setError(error?.message);
          return;
        }

        // Success
        onSuccess?.();
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      displayName: ''
    });
    setError('');
    clearError();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-3xl p-8 mx-4 w-full max-w-md shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
        >
          <span className="text-gray-600">✕</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl">🦋</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {isSignUp ? 'Join the Family' : 'Welcome Back'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignUp 
              ? 'Create an account to share in the magical moments' :'Sign in to continue your journey'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData?.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData?.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                  placeholder="How others will see you (e.g., Mom, Dad, Aunt Lisa)"
                />
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData?.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
            />
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData?.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {/* Error Message */}
          {(error || authError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{error || authError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </span>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' :'Need an account? Sign up'
              }
            </button>
          </div>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <p className="text-blue-700 text-sm">
            <strong>Demo Credentials:</strong><br />
            Email: admin@butterfly.family<br />
            Password: ButterflyAdmin2024!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;