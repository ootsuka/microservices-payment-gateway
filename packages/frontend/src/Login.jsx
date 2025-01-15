import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    // Register function
    const handleRegister = async () => {
        if (!username || !password) {
            alert('Please enter a username and password');
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username,
                password,
            });

            if (response.status === 201) {
                alert('Registration successful! You can now log in.');
                setIsRegistering(false);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    // Login function
    const handleLogin = async () => {
        if (!username || !password) {
            alert('Please enter a username and password');
            return;
        }

        try {
            const response = await axios.post('/api/auth/login', {
                username,
                password,
            });

            if (response.status === 200) {
                // Save auth token (if provided)
                localStorage.setItem('authToken', response.data.token);
                console.log('success')
                navigate('/');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div>
            <h1>{isRegistering ? 'Register' : 'Login'}</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            {isRegistering ? (
                <>
                    <button onClick={handleRegister}>Register</button>
                    <p>
                        Already have an account?{' '}
                        <span onClick={() => setIsRegistering(false)} style={{ color: 'blue', cursor: 'pointer' }}>
                            Login here
                        </span>
                    </p>
                </>
            ) : (
                <>
                    <button onClick={handleLogin}>Login</button>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={() => setIsRegistering(true)} style={{ color: 'blue', cursor: 'pointer' }}>
                            Register here
                        </span>
                    </p>
                </>
            )}
        </div>
    );
};

export default LoginPage;
