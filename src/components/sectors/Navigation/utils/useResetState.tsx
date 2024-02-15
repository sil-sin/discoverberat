import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type ResponsiveStateHook = [boolean, Dispatch<SetStateAction<boolean>>];
const hasWindow = typeof window !== 'undefined';
const useResponsiveState = (): ResponsiveStateHook => {
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(hasWindow && window.innerWidth >= 780);

    const handleResize = () => {
        setIsLargeScreen(hasWindow && window.innerWidth >= 780);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            }
        }
    }, [])

    return [isLargeScreen, setIsLargeScreen];
};

export default useResponsiveState;
