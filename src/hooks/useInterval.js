import { useEffect, useRef } from 'react';

/**
 * Custom hook that runs a callback at specified intervals
 * @param {function} callback - The function to call
 * @param {number} delay - Delay in milliseconds (null to pause)
 */
export const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval
    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export default useInterval;
