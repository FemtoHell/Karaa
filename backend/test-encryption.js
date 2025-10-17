// Test encryption functionality
require('dotenv').config();
const { encrypt, decrypt, encryptFields, decryptFields } = require('./src/utils/encryption');

console.log('Testing Encryption Utilities...\n');

// Test basic encryption/decryption
console.log('1. Basic Encryption/Decryption Test:');
const testPhone = '+84 123 456 789';
const encryptedPhone = encrypt(testPhone);
console.log('   Original:', testPhone);
console.log('   Encrypted:', encryptedPhone);
const decryptedPhone = decrypt(encryptedPhone);
console.log('   Decrypted:', decryptedPhone);
console.log('   Match:', testPhone === decryptedPhone ? '✓' : '✗');
console.log();

// Test with location
console.log('2. Location Encryption Test:');
const testLocation = 'Ho Chi Minh City, Vietnam';
const encryptedLocation = encrypt(testLocation);
console.log('   Original:', testLocation);
console.log('   Encrypted:', encryptedLocation);
const decryptedLocation = decrypt(encryptedLocation);
console.log('   Decrypted:', decryptedLocation);
console.log('   Match:', testLocation === decryptedLocation ? '✓' : '✗');
console.log();

// Test encryptFields
console.log('3. encryptFields Test:');
const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+84 123 456 789',
  location: 'Hanoi, Vietnam',
  bio: 'Software developer with 5 years of experience'
};
console.log('   Original data:', userData);
const encryptedData = encryptFields(userData, ['phone', 'location', 'bio']);
console.log('   Encrypted data:', encryptedData);
const decryptedData = decryptFields(encryptedData, ['phone', 'location', 'bio']);
console.log('   Decrypted data:', decryptedData);
console.log('   Match:', JSON.stringify(userData) === JSON.stringify(decryptedData) ? '✓' : '✗');
console.log();

// Test null/undefined values
console.log('4. Null/Undefined Values Test:');
const nullData = {
  phone: null,
  location: undefined,
  bio: ''
};
console.log('   Original:', nullData);
const encryptedNull = encryptFields(nullData, ['phone', 'location', 'bio']);
console.log('   Encrypted:', encryptedNull);
const decryptedNull = decryptFields(encryptedNull, ['phone', 'location', 'bio']);
console.log('   Decrypted:', decryptedNull);
console.log();

console.log('All tests completed!');
