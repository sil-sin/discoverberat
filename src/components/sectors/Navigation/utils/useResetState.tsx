import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type ResponsiveStateHook = [boolean, Dispatch<SetStateAction<boolean>>];

const useResponsiveState = (): ResponsiveStateHook => {
  // Initialize with false to match server-side render, update in useEffect
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 780);
    };

    // Set initial value on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [isLargeScreen, setIsLargeScreen];
};

export default useResponsiveState;
