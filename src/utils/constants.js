/**
 * Application Constants
 * Centralized configuration and constant values
 */

// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
};

// MQTT Configuration
export const MQTT_CONFIG = {
    BROKER_URL: import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:8080',
    CLIENT_ID: `smd_web_${Math.random().toString(16).slice(2, 10)}`,
    TOPICS: {
        HEARTBEAT: 'smd/heartbeat',
        LOGS: 'smd/logs',
        ERRORS: 'smd/errors',
        COMMANDS: 'smd/commands',
        DISPENSE: 'smd/dispense',
    },
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    CAREGIVER: 'caregiver',
    PATIENT: 'patient',
};

// Medication Frequencies
export const MEDICATION_FREQUENCIES = [
    { value: 'once_daily', label: 'Once Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'three_times_daily', label: 'Three Times Daily' },
    { value: 'four_times_daily', label: 'Four Times Daily' },
    { value: 'as_needed', label: 'As Needed' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom Schedule' },
];

// Device Status
export const DEVICE_STATUS = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    WARNING: 'warning',
    ERROR: 'error',
    MAINTENANCE: 'maintenance',
};

// Error Severity Levels
export const ERROR_SEVERITY = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical',
};

// Adherence Thresholds
export const ADHERENCE_THRESHOLDS = {
    EXCELLENT: 95,
    GOOD: 85,
    FAIR: 70,
    POOR: 0,
};

// Date Formats
export const DATE_FORMATS = {
    SHORT: 'short',
    LONG: 'long',
    TIME: 'time',
    DATETIME: 'datetime',
};

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
    THEME: 'smd_theme',
    PATIENT_PROFILE: 'smd_patient_profile',
    USER_PREFERENCES: 'smd_user_preferences',
    AUTH_TOKEN: 'smd_auth_token',
};

// Toast Notification Durations (ms)
export const TOAST_DURATION = {
    SHORT: 2000,
    MEDIUM: 4000,
    LONG: 6000,
};

// Medication Types
export const MEDICATION_TYPES = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Topical',
    'Inhaler',
    'Other',
];

// Appointment Types
export const APPOINTMENT_TYPES = [
    'Doctor Visit',
    'Lab Test',
    'Pharmacy Pickup',
    'Therapy Session',
    'Follow-up',
    'Emergency',
    'Other',
];

// Chart Colors
export const CHART_COLORS = {
    PRIMARY: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    DANGER: '#ef4444',
    INFO: '#06b6d4',
    PURPLE: '#8b5cf6',
    PINK: '#ec4899',
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
};

// File Upload Limits
export const FILE_UPLOAD = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};

// Validation Rules
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    PHONE_REGEX: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export default {
    API_CONFIG,
    MQTT_CONFIG,
    USER_ROLES,
    MEDICATION_FREQUENCIES,
    DEVICE_STATUS,
    ERROR_SEVERITY,
    ADHERENCE_THRESHOLDS,
    DATE_FORMATS,
    PAGINATION,
    STORAGE_KEYS,
    TOAST_DURATION,
    MEDICATION_TYPES,
    APPOINTMENT_TYPES,
    CHART_COLORS,
    ANIMATION_DURATION,
    FILE_UPLOAD,
    VALIDATION,
};
