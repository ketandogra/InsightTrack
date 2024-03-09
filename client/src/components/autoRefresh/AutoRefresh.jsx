import React, { useEffect } from 'react';

const AutoRefresh = () => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      window.location.reload(true); // Reloads the entire page
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return null; // This component doesn't render anything
};

export default AutoRefresh;
