
import { useState, useRef, useCallback, useEffect } from 'react';

const useTimer = (initialTime: number) => {
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = window.setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsRunning(false);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
    }, [isRunning]);

    const stop = useCallback(() => {
        if (isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        stop();
        setTime(initialTime);
    }, [initialTime, stop]);
    
    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return { time, isRunning, start, stop, reset };
};

export default useTimer;
