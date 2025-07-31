'use client'

import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
  isOpen: boolean;
}

export function ModalPortal({ children, isOpen }: ModalPortalProps) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create portal container if it doesn't exist
    let portalContainer = document.getElementById('modal-portal-root');
    
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = 'modal-portal-root';
      portalContainer.style.position = 'fixed';
      portalContainer.style.top = '0';
      portalContainer.style.left = '0';
      portalContainer.style.width = '100%';
      portalContainer.style.height = '100%';
      portalContainer.style.zIndex = '9999';
      portalContainer.style.pointerEvents = 'none';
      
      // iOS Safari specific fixes
      portalContainer.style.WebkitTransform = 'translateZ(0)';
      portalContainer.style.transform = 'translateZ(0)';
      portalContainer.style.WebkitBackfaceVisibility = 'hidden';
      portalContainer.style.backfaceVisibility = 'hidden';
      
      document.body.appendChild(portalContainer);
    }

    setPortalElement(portalContainer);

    return () => {
      // Cleanup when component unmounts
      if (portalContainer && portalContainer.children.length === 0) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);

  useEffect(() => {
    if (portalElement) {
      if (isOpen) {
        portalElement.style.pointerEvents = 'auto';
        // Add iOS-specific class to body
        document.body.classList.add('modal-portal-open');
      } else {
        portalElement.style.pointerEvents = 'none';
        document.body.classList.remove('modal-portal-open');
      }
    }
  }, [isOpen, portalElement]);

  if (!portalElement || !isOpen) {
    return null;
  }

  return createPortal(children, portalElement);
}