import React, {useContext, useEffect, useState} from 'react';
import {Progress} from '@nextui-org/react';
import {LoadStatusContext} from './LoadStatusContext';

const LoadStatus = () => {
    const context = useContext(LoadStatusContext);
    const [showProgress, setShowProgress] = useState(true);
    const [progressValue, setProgressValue] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [color, setColor] = useState('primary' as "default" | "primary" | "success" | "warning" | "secondary" | "danger" | undefined);
    const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (context) {
            const {value} = context;
            console.debug(value);

            if (value === 100) {
                setProgressValue(value);
                setColor('success');
                const id = setTimeout(() => {
                    setOpacity(0);
                    setTimeout(() => {
                        setShowProgress(false);
                    }, 1000);
                }, 3000);
                setTimeoutID(id);
            } else if (value === 500) {
                setProgressValue(100);
                setColor('danger');
                const id = setTimeout(() => {
                    setOpacity(0);
                    setTimeout(() => {
                        setShowProgress(false);
                    }, 1000);
                }, 3000);
                setTimeoutID(id);
            } else {
                setColor('primary');
                setProgressValue(value);
                setShowProgress(true);
                setOpacity(1);
                clearTimeout(timeoutID as NodeJS.Timeout);
            }
        }
    }, [context]);

    if (!showProgress) {
        return null;
    }

    if (progressValue === 0) {
        return (
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w"
                color={color}
            />
        );
    }

    return (
        <Progress
            className={`max-w transition-colors-opacity duration-1000 ease-in-out`}
            isIndeterminate={false}
            size="sm"
            aria-label="Loading..."
            value={progressValue}
            style={{opacity}}
            color={color}
        />
    );
};

const LoadStatusWrapper = () => {
    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1000,
            }}
        >
            <LoadStatus/>
        </div>
    );
};

export default LoadStatusWrapper;