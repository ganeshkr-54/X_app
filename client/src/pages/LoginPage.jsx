import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SET_AUTH } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';

import API_INSTANCE from '../services/api'

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await API_INSTANCE.post('/user/login', {
        username,
        password
      });

      console.log(response.data)
      const token = response.data.data.token;
      localStorage.setItem('token', token);
      const userData = response.data.data;

      // set the data in redux
      dispatch(SET_AUTH(userData))

      console.log('Login successful! Token:', token);
      navigate('/home');

    } catch (err) {
      console.error(err);

      let errorString = '';

      // express validator errors
      if (err.response.data.statusCode == 400) {
        console.log(err.response.data.errors)
        err.response.data.errors.forEach(e => {
          errorString += `${e.msg} `
        })

        setError(errorString)
      }
      // handling error middleware errors
      else {
        if (err.response.data) {
          setError(err.response.data.msg)
        }
      }

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center mb-8">
          <div className="text-2xl font-bold text-white">Login to your account</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>} {/* Display error if login fails */}

            <button type="submit" className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
              Sign in
            </button>
          </div>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
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


        <p className="text-center text-gray-400 mt-5">
          Don't have an account?{' '}
          <Link to={`/register`} className="text-purple-400 hover:text-purple-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

/*
URL: localhost:3000/api/v1/user/login
BODY
{
    "username": "def",
    "password": "def"
}

response:
token: localStorage.setItem
cookies

login is success, navigate to /home page

*/