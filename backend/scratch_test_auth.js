const axios = require('axios');

async function test() {
  try {
    console.log('Testing registration...');
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Script User',
      email: 'scriptuser@test.com',
      password: 'password123',
      role: 'member'
    });
    console.log('Registration Response:', regRes.status, regRes.data);

    console.log('Testing login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'scriptuser@test.com',
      password: 'password123'
    });
    console.log('Login Response:', loginRes.status, loginRes.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    if (error.response) console.error('Response Data:', error.response.data);
  }
}

test();
