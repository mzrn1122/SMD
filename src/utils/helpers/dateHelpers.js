/**
 * Date and time helper functions
 */

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - Format type: 'short', 'long', 'time', 'datetime'
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return '';

    const d = new Date(date);

    if (isNaN(d.getTime())) return '';

    const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        },
    };

    return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - The date to compare
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatDate(date, 'short');
};

/**
 * Check if a date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
    if (!date) return false;

    const d = new Date(date);
    const today = new Date();

    return d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
};

/**
 * Get time from now in a human-readable format
 * @param {Date|string} date - The target date
 * @returns {string}
 */
export const timeFromNow = (date) => {
    if (!date) return '';

    const d = new Date(date);
    const now = new Date();
    const diffMs = d - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 0) return 'overdue';
    if (diffMins < 60) return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
};

/**
 * Format time in 12-hour format
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} - Time in 12-hour format
 */
export const format12Hour = (time24) => {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;

    return `${h12}:${minutes} ${ampm}`;
};
