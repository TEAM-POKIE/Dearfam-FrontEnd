import React, { useEffect } from 'react';
import { BasicToast } from './BasicToast';
import { useToastStore } from '@/context/store/toastStore';

export const GlobalToast: React.FC = () => {
  const { message, type, isVisible, hideToast } = useToastStore();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, type === 'success' ? 2000 : 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, type, hideToast]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
      <BasicToast 
        message={message} 
        type={type}
        duration={type === 'success' ? 2000 : 3000}
      />
    </div>
  );
};

export default GlobalToast; 