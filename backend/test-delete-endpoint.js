// Test script to test delete account endpoint
require('dotenv').config();
const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://localhost:5000/api/v1';

async function testDeleteAccount() {
  console.log('🧪 Testing Delete Account Endpoint\n');
  
  // You need to provide a valid token from your local test
  const token = process.argv[2];
  
  if (!token) {
    console.error('❌ Please provide a token as argument:');
    console.error('   node test-delete-endpoint.js YOUR_TOKEN');
    console.error('\nTo get a token:');
    console.error('   1. Login via browser');
    console.error('   2. Open DevTools → Application → LocalStorage');
    console.error('   3. Copy the "token" value');
    process.exit(1);
  }
  
  console.log('Token:', token.substring(0, 20) + '...');
  console.log('API URL:', API_URL);
  console.log('\n');
  
  // Test 1: Check authentication
  console.log('📝 Step 1: Testing authentication...');
  try {
    const authResponse = await fetch(`${API_URL}/users/test-auth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const authData = await authResponse.json();
    
    if (authResponse.ok) {
      console.log('✅ Authentication successful');
      console.log('   User:', authData.user);
      console.log('   Provider:', authData.user.provider);
    } else {
      console.error('❌ Authentication failed:', authData.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing auth:', error.message);
    process.exit(1);
  }
  
  console.log('\n');
  
  // Test 2: Try to delete account
  console.log('📝 Step 2: Testing delete account...');
  console.log('⚠️  WARNING: This will NOT actually delete the account in this test');
  console.log('            (Using wrong confirmation text on purpose)');
  
  try {
    const deleteResponse = await fetch(`${API_URL}/users/account/permanent`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        confirmation: 'WRONG TEXT', // Wrong on purpose to test validation
        password: 'test123'
      })
    });
    
    const deleteData = await deleteResponse.json();
    
    console.log('Response status:', deleteResponse.status);
    console.log('Response data:', JSON.stringify(deleteData, null, 2));
    
    if (deleteResponse.status === 400 && deleteData.message.includes('DELETE MY ACCOUNT')) {
      console.log('✅ Validation is working correctly');
    } else {
      console.log('⚠️  Unexpected response');
    }
  } catch (error) {
    console.error('❌ Error testing delete:', error.message);
  }
  
  console.log('\n');
  console.log('✅ Test completed');
  console.log('\nTo actually delete an account, use the correct confirmation:');
  console.log('   confirmation: "DELETE MY ACCOUNT"');
  console.log('   password: "your_actual_password" (for local users only)');
}

testDeleteAccount();
