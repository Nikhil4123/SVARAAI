// Simple Node.js script to test project creation
// Run with: node test-project-creation.js

// Use dynamic import for node-fetch
async function testProjectCreation() {
  const fetch = (await import('node-fetch')).default;
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Step 1: Try to register a user (may already exist)
    console.log('Registering user...');
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    if (registerResponse.ok) {
      console.log('User registered successfully');
    } else {
      const error = await registerResponse.json();
      if (error.message === 'User already exists') {
        console.log('User already exists, proceeding with login');
      } else {
        console.error('Registration failed:', error);
        return;
      }
    }
    
    // Step 2: Login to get token
    console.log('Logging in...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });
    
    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('Login failed:', error);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('Login successful, token received');
    
    // Step 3: Create a project
    console.log('Creating project...');
    const projectResponse = await fetch(`${baseUrl}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Test Project from Script',
        description: 'This is a test project created via script',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'active',
      }),
    });
    
    if (!projectResponse.ok) {
      const error = await projectResponse.json();
      console.error('Project creation failed:', error);
      return;
    }
    
    const projectData = await projectResponse.json();
    console.log('Project created successfully:', projectData);
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the test
testProjectCreation();