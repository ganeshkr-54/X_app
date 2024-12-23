import React, { useState, useEffect } from 'react';
import API_INSTANCE from "../services/api";
import { useParams } from 'react-router-dom';


function EmailVerificationPage() {
    const [message, setMessage] = useState("");
    const { emailToken } = useParams();
    const [isVerifying, setIsVerifying] = useState(false);
    async function VerifyEmail() {
        try {
            // Correctly interpolate the token into the URL
            console.log(emailToken)
            const response = await API_INSTANCE.get(`/user/verify-email/${emailToken}`);
            console.log(response.data.message);
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error verifying email:', error);
            setMessage('An error occurred while verifying your email.');
        }
        finally{
            setIsVerifying(false)
        }
    }

   
    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p> {/* Display the message */}
            <button onClick={VerifyEmail} disabled={isVerifying} className='border b  border-black'>
                {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
        </div>
    );
}

export default EmailVerificationPage;
