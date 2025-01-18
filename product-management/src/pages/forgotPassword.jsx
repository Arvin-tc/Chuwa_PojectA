import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const PORT = 3000;

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            alert('Email is required');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            alert('Invalid email format');
            return;
        }
        try {
          const response = await fetch(`http://localhost:${PORT}/api/auth/forgot-password`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
          });

          if (!response.ok) {
              const data = await response.json();
              if (response.status === 404) {
                  setErrorMessage("No account found with this email.");
              } else {
                  setErrorMessage(data.error || "Something went wrong.");
              }
              return;
          }

          alert("Password reset link sent to your email");
          setIsEmailSent(true);
      } catch (error) {
          setErrorMessage("Failed to send password reset link. Please try again.");
      }
    };

    const handleBackToSignin = () => {
        navigate('/signin');
    };

    return (
      <div className="flex items-center justify-center min-h-full w-full bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          {isEmailSent ? (
              <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset Password</h2>
                  <p className="text-gray-600 mb-6">
                      We have sent a password reset link to your email. Please check it!
                  </p>
                  <button
                      onClick={handleBackToSignin}
                      className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
                  >
                      Back to Sign In
                  </button>
              </div>
          ) : (
              <div>
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="form-group">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                              Email
                          </label>
                          <input
                              type="email"
                              id="email"
                              name="email"
                              placeholder="  Please enter your email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 text-base focus:ring-indigo-500 focus:border-indigo-500"
                              required
                          />
                      </div>
                      {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
                      <button
                          type="submit"
                          className="w-full py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none"
                      >
                          Submit
                      </button>
                  </form>
              </div>
          )}
      </div>
  </div>
  );
}
