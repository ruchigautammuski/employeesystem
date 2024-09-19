
import React, { useState } from 'react';
import axios from 'axios';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
        const response = await axios('http://localhost:8000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: { name, email, password }, 
        });
      
        const data = await response.data; 
      
        if (data.message === 'User created successfully') {
          window.location.href = '/login';
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error(error);
        setError('Error creating user');
      }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <br />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Signup</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default Signup;