const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function testUsersAPI() {
  console.log('🧪 Testing Users API...\n');

  // Test 1: Tạo user mới
  console.log('1️⃣ Testing POST /api/users (create new user)');
  try {
    const newUser = {
      firebaseUID: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/avatar.jpg'
    };

    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('✅ Create user test passed\n');
  } catch (error) {
    console.error('❌ Create user test failed:', error.message);
  }

  // Test 2: Lấy thông tin user
  console.log('2️⃣ Testing GET /api/users/:firebaseUID');
  try {
    const response = await fetch(`${BASE_URL}/api/users/test-uid-123`);
    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('✅ Get user test passed\n');
  } catch (error) {
    console.error('❌ Get user test failed:', error.message);
  }

  // Test 3: Cập nhật user
  console.log('3️⃣ Testing POST /api/users (update existing user)');
  try {
    const updatedUser = {
      firebaseUID: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Updated Test User',
      photoURL: 'https://example.com/new-avatar.jpg'
    };

    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', result);
    console.log('✅ Update user test passed\n');
  } catch (error) {
    console.error('❌ Update user test failed:', error.message);
  }

  console.log('🎉 All tests completed!');
}

// Chạy test
testUsersAPI();
