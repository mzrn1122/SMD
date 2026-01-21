/**
 * Validation helper functions
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (US format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid, strength, message }
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, strength: 'none', message: 'Password is required' };
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return {
            isValid: false,
            strength: 'weak',
            message: `Password must be at least ${minLength} characters`
        };
    }

    let strength = 'weak';
    let strengthCount = 0;

    if (hasUpperCase) strengthCount++;
    if (hasLowerCase) strengthCount++;
    if (hasNumbers) strengthCount++;
    if (hasSpecialChar) strengthCount++;

    if (strengthCount >= 4) strength = 'strong';
    else if (strengthCount >= 3) strength = 'medium';

    return {
        isValid: strengthCount >= 3,
        strength,
        message: strength === 'strong'
            ? 'Strong password'
            : 'Password should include uppercase, lowercase, numbers, and special characters',
    };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean}
 */
export const isRequired = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean}
 */
export const isInRange = (value, min, max) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    return num >= min && num <= max;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
export const isValidURL = (url) => {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @returns {boolean}
 */
export const isValidDate = (date) => {
    if (!date) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};
