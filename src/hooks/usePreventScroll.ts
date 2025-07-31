import { useEffect, useRef } from 'react';

// iOS Safari uyumlu scroll lock hook'u
const usePreventScroll = (isOpen: boolean) => {
  const scrollPosition = useRef(0);
  const isIOS = useRef(false);
  const originalStyles = useRef<{
    position: string;
    top: string;
    width: string;
    overflow: string;
  }>({ position: '', top: '', width: '', overflow: '' });

  useEffect(() => {
    // Modern iOS detection - includes newer devices
    isIOS.current = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Store original styles
      originalStyles.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        overflow: document.body.style.overflow
      };

      // Modal açıldığında
      scrollPosition.current = window.pageYOffset;
      
      if (isIOS.current) {
        // iOS için özel çözüm - viewport bounce'u önle
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        // iOS Safari address bar için ek fix
        document.body.style.height = '100vh';
        document.documentElement.style.overflow = 'hidden';
      } else {
        // Diğer cihazlar için basit çözüm
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Modal kapandığında
      if (isIOS.current) {
        // iOS için scroll pozisyonunu restore et
        document.body.style.position = originalStyles.current.position;
        document.body.style.top = originalStyles.current.top;
        document.body.style.width = originalStyles.current.width;
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
        
        // Critical: Double RAF for iOS - ensures proper scroll restoration
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, scrollPosition.current);
          });
        });
      } else {
        document.body.style.overflow = originalStyles.current.overflow;
      }
    }

    // Cleanup function - critical for preventing memory leaks
    return () => {
      if (isIOS.current) {
        document.body.style.position = originalStyles.current.position;
        document.body.style.top = originalStyles.current.top;
        document.body.style.width = originalStyles.current.width;
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.height = '';
        document.documentElement.style.overflow = '';
      } else {
        document.body.style.overflow = originalStyles.current.overflow;
      }
    };
  }, [isOpen]);
};

export default usePreventScroll;