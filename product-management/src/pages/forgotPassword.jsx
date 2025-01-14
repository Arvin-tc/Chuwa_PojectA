import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) {
            alert('Email is required');
            return;
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            alert('Invalid email format');
            return;
        }
        console.log("Email for password reset", email);
        alert('Password reset link sent to your email');
        setIsEmailSent(true);
    };

    const handleBackToSignin = () => {
        navigate('/signin');
    };

    return (
        <div className="auth-form">
          {isEmailSent ? (
            <div className="email-sent-message">
              <h2>Reset Password</h2>
              <p>
                We have sent a password reset link to your email, please check it!
              </p>
              <button onClick={handleBackToSignin} className="back-to-login-button">Back to Sign In</button>
            </div>
          ) : (
            <div>
              <h2>Forgot Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Please enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </div>
      );
}