import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            const response = await axios.post('http://localhost:3000/api/v1/user/register', {
                username,
                name,
                email,
                password,
            });
            console.log(response)

            // Navigate to login page
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error.response ? error.response.data : error.message);
            setErrorMessage('Registration failed. Please try again.'); 
        }
    };

    return (
        <div className=" min-h-screen flex items-center justify-center p-4 lg:p-12">
            <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
                <div className="flex justify-center items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Create an account</h2>
                </div>

                {errorMessage && <p className="text-red-600">{errorMessage}</p>} {/* Show error message */}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="terms"
                            className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                            required
                        />
                        <label htmlFor="terms" className="text-sm text-gray-300">
                            I agree to the{" "}
                            <a href="#" className="text-purple-400 hover:text-purple-300">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
                    >
                        Create account
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg hover:bg-purple-500 text-black transition-colors bg-white">
                            Google
                        </button>
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-700 rounded-lg hover:bg-purple-500 text-black transition-colors bg-white">
                            Apple
                        </button>
                    </div>

                    <p className="text-center text-gray-400">
                        Already have an account?{" "}
                        <Link to={`/login`} className="text-purple-400 hover:text-purple-300">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

/*
URL: localhost:3000/api/v1/user/register
BODY
{
    "email":"abdullah2@thehackingschool.com",
    "username":"ghi",
    "password":"ghi",
    "name":"ghi"
}

as soon some register is success navigate to login page
*/