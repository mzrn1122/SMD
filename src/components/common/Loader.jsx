import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export const Loader = ({
    size = 'md',
    text = '',
    fullScreen = false,
    className = '',
}) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className={`${sizes[size]} animate-spin text-primary-500`} />
            {text && <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                {content}
            </div>
        );
    }

    return content;
};

Loader.propTypes = {
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    text: PropTypes.string,
    fullScreen: PropTypes.bool,
    className: PropTypes.string,
};

export default Loader;
