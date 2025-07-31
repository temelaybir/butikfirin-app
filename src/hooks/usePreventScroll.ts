import { useEffect, useRef, useCallback } from 'react';

// iOS Safari titreme önleyici - Ultra agresif yaklaşım
const usePreventScroll = (isOpen: boolean) => {
  const scrollPosition = useRef(0);
  const isIOS = useRef(false);
  const preventingScroll = useRef(false);
  const originalStyles = useRef<{
    position: string;
    top: string;
    left: string;
    width: string;
    height: string;
    overflow: string;
    paddingRight: string;
  }>({ position: '', top: '', left: '', width: '', height: '', overflow: '', paddingRight: '' });

  // Touch event handler to prevent scroll
  const preventTouchMove = useCallback((e: TouchEvent) => {
    if (preventingScroll.current) {
      e.preventDefault();
    }
  }, []);

  // Wheel event handler to prevent scroll
  const preventWheel = useCallback((e: WheelEvent) => {
    if (preventingScroll.current) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    // Enhanced iOS detection
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    isIOS.current = /iPad|iPhone|iPod/.test(userAgent) || 
                   (platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                   /Safari/.test(userAgent) && /Mobile/.test(userAgent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Store current scroll position BEFORE any DOM changes
      scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
      
      // Store original styles
      originalStyles.current = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
        width: document.body.style.width,
        height: document.body.style.height,
        overflow: document.body.style.overflow,
        paddingRight: document.body.style.paddingRight
      };

      // Calculate scrollbar width to avoid layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      if (isIOS.current) {
        // NUCLEAR OPTION for iOS - Complete layout lock
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition.current}px`;
        document.body.style.left = '0';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // Lock the html element too
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.top = `-${scrollPosition.current}px`;
        document.documentElement.style.left = '0';
        document.documentElement.style.width = '100%';
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        
        // Add CSS class for additional control
        document.body.classList.add('modal-open-ios');
        
        // Enable aggressive touch prevention
        preventingScroll.current = true;
        
        // Add event listeners with { passive: false } to force preventDefault
        document.addEventListener('touchmove', preventTouchMove, { passive: false });
        document.addEventListener('wheel', preventWheel, { passive: false });
        document.addEventListener('scroll', preventTouchMove, { passive: false });
        
        // Additional iOS specific hacks
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }

        // Nuclear option: Disable all scroll-related CSS behaviors
        const style = document.createElement('style');
        style.id = 'ios-modal-scroll-lock';
        style.textContent = `
          * {
            -webkit-overflow-scrolling: auto !important;
            overscroll-behavior: none !important;
            scroll-behavior: auto !important;
          }
          html, body {
            touch-action: none !important;
            overflow: hidden !important;
            position: fixed !important;
            height: 100% !important;
            width: 100% !important;
          }
          #__next {
            touch-action: none !important;
            overflow: hidden !important;
          }
        `;
        document.head.appendChild(style);
      } else {
        // Desktop/Android - simpler approach
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add('modal-open');
      }
    } else {
      // Modal kapandığında - restore everything
      preventingScroll.current = false;
      
      if (isIOS.current) {
        // Remove event listeners
        document.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('wheel', preventWheel);
        document.removeEventListener('scroll', preventTouchMove);
        
        // Restore body styles
        document.body.style.position = originalStyles.current.position;
        document.body.style.top = originalStyles.current.top;
        document.body.style.left = originalStyles.current.left;
        document.body.style.width = originalStyles.current.width;
        document.body.style.height = originalStyles.current.height;
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.paddingRight = originalStyles.current.paddingRight;
        
        // Restore html styles
        document.documentElement.style.position = '';
        document.documentElement.style.top = '';
        document.documentElement.style.left = '';
        document.documentElement.style.width = '';
        document.documentElement.style.height = '';
        document.documentElement.style.overflow = '';
        
        // Remove classes
        document.body.classList.remove('modal-open-ios');
        
        // Restore viewport
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        }

        // Remove the nuclear CSS
        const injectedStyle = document.getElementById('ios-modal-scroll-lock');
        if (injectedStyle) {
          document.head.removeChild(injectedStyle);
        }
        
        // TRIPLE RAF for iOS - maximum safety
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo(0, scrollPosition.current);
              // Force reflow
              document.body.offsetHeight;
            });
          });
        });
      } else {
        // Restore desktop styles
        document.body.style.overflow = originalStyles.current.overflow;
        document.body.style.paddingRight = originalStyles.current.paddingRight;
        document.body.classList.remove('modal-open');
      }
    }

    // Cleanup - absolute safety net
    return () => {
      preventingScroll.current = false;
      
      // Remove all event listeners
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('wheel', preventWheel);
      document.removeEventListener('scroll', preventTouchMove);
      
      // Restore all styles
      document.body.style.position = originalStyles.current.position;
      document.body.style.top = originalStyles.current.top;
      document.body.style.left = originalStyles.current.left;
      document.body.style.width = originalStyles.current.width;
      document.body.style.height = originalStyles.current.height;
      document.body.style.overflow = originalStyles.current.overflow;
      document.body.style.paddingRight = originalStyles.current.paddingRight;
      
      document.documentElement.style.position = '';
      document.documentElement.style.top = '';
      document.documentElement.style.left = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.documentElement.style.overflow = '';
      
      // Remove classes
      document.body.classList.remove('modal-open-ios', 'modal-open');
      
      // Restore viewport if needed
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
      }

      // Remove the nuclear CSS if exists
      const injectedStyle = document.getElementById('ios-modal-scroll-lock');
      if (injectedStyle) {
        document.head.removeChild(injectedStyle);
      }
    };
  }, [isOpen, preventTouchMove, preventWheel]);
};

export default usePreventScroll;