// Test login.js
// Run with: node test-login.js

import { post } from 'axios';

async function testLogin() {
  try {
    console.log('Sending login request...');
    
    const response = await post('http://localhost:8000/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'Password123@'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Request that was sent:', {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data
    });
  }
}

testLogin();
