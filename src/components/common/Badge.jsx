import React from 'react';
import PropTypes from 'prop-types';

export const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-semibold rounded-full';

    const variants = {
        default: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
        primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
        success: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400',
        warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400',
        danger: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
        info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-base',
    };

    return (
        <span
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'danger', 'info']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    className: PropTypes.string,
};

export default Badge;
