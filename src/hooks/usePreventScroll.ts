import { useEffect, useRef } from 'react';

// iOS Safari uyumlu scroll lock hook'u
const usePreventScroll = (isOpen: boolean) => {
  const scrollPosition = useRef(0);
  const isIOS = useRef(false);

  useEffect(() => {
    // iOS detection
    isIOS.current = /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Modal açıldığında
      scrollPosition.current = window.pageYOffset;
      
      if (isIOS.current) {
        // iOS için özel çözüm
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      } else {
        // Diğer cihazlar için basit çözüm
        document.body.style.overflow = 'hidden';
      }
    } else {
      // Modal kapandığında
      if (isIOS.current) {
        // iOS için scroll pozisyonunu restore et
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Önemli: RAF içinde scroll restore
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition.current);
        });
      } else {
        document.body.style.overflow = '';
      }
    }

    // Cleanup
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);
};

export default usePreventScroll;