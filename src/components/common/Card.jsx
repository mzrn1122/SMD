import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({
    children,
    className = '',
    hover = false,
    padding = 'md',
    ...props
}) => {
    const baseStyles = 'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm';
    const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : '';

    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hover: PropTypes.bool,
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
};

export default Card;
