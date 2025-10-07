const crypto = require('crypto');

// Encryption algorithm
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

// Get encryption key from environment
const getEncryptionKey = () => {
  const secret = process.env.ENCRYPTION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('ENCRYPTION_SECRET or JWT_SECRET must be set');
  }
  // Derive a key from the secret
  return crypto.pbkdf2Sync(secret, 'salt', ITERATIONS, KEY_LENGTH, 'sha512');
};

/**
 * Encrypt sensitive data
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Encrypted data in format: iv:encryptedData:authTag
 */
const encrypt = (text) => {
  if (!text) return text;

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Return format: iv:encryptedData:authTag
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt encrypted data
 * @param {string} encryptedText - Encrypted text in format: iv:encryptedData:authTag
 * @returns {string} - Decrypted plain text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;

  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const authTag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data (one-way, for searching)
 * @param {string} text - Plain text to hash
 * @returns {string} - Hashed text
 */
const hash = (text) => {
  if (!text) return text;
  return crypto.createHash('sha256').update(text).digest('hex');
};

/**
 * Encrypt object fields
 * @param {object} obj - Object with fields to encrypt
 * @param {array} fields - Array of field names to encrypt
 * @returns {object} - Object with encrypted fields
 */
const encryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach(field => {
    if (result[field]) {
      result[field] = encrypt(result[field]);
    }
  });
  return result;
};

/**
 * Decrypt object fields
 * @param {object} obj - Object with encrypted fields
 * @param {array} fields - Array of field names to decrypt
 * @returns {object} - Object with decrypted fields
 */
const decryptFields = (obj, fields) => {
  const result = { ...obj };
  fields.forEach(field => {
    if (result[field]) {
      try {
        result[field] = decrypt(result[field]);
      } catch (error) {
        console.warn(`Failed to decrypt field ${field}:`, error.message);
        result[field] = null;
      }
    }
  });
  return result;
};

/**
 * Encrypt personal data in resume content
 * @param {object} content - Resume content object
 * @returns {object} - Content with encrypted personal data
 */
const encryptResumePersonalData = (content) => {
  if (!content || !content.personal) return content;

  const result = { ...content };
  result.personal = { ...content.personal };

  // Encrypt sensitive personal information
  if (result.personal.email) {
    result.personal.email = encrypt(result.personal.email);
  }
  if (result.personal.phone) {
    result.personal.phone = encrypt(result.personal.phone);
  }
  if (result.personal.address) {
    result.personal.address = encrypt(result.personal.address);
  }

  return result;
};

/**
 * Decrypt personal data in resume content
 * @param {object} content - Resume content with encrypted data
 * @returns {object} - Content with decrypted personal data
 */
const decryptResumePersonalData = (content) => {
  if (!content || !content.personal) return content;

  const result = { ...content };
  result.personal = { ...content.personal };

  // Decrypt sensitive personal information
  try {
    if (result.personal.email && result.personal.email.includes(':')) {
      result.personal.email = decrypt(result.personal.email);
    }
    if (result.personal.phone && result.personal.phone.includes(':')) {
      result.personal.phone = decrypt(result.personal.phone);
    }
    if (result.personal.address && result.personal.address.includes(':')) {
      result.personal.address = decrypt(result.personal.address);
    }
  } catch (error) {
    console.warn('Failed to decrypt resume personal data:', error.message);
  }

  return result;
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  encryptFields,
  decryptFields,
  encryptResumePersonalData,
  decryptResumePersonalData
};
