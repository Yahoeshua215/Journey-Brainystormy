'use client';

import { useState, useRef, useEffect } from 'react';

interface MenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  onClick: () => void;
}

interface MenuSection {
  title: string;
  options: MenuOption[];
}

interface ContextualMenuProps {
  sections: MenuSection[];
  position?: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
}

export default function ContextualMenu({ 
  sections, 
  position = { x: 0, y: 0 }, 
  isOpen, 
  onClose 
}: ContextualMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Calculate position to ensure menu stays on screen
  useEffect(() => {
    if (menuRef.current && isOpen) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust position if menu would go off screen
      const adjustedLeft = Math.min(
        position.x, 
        viewportWidth - menuRect.width / 2 - 10
      );
      const adjustedTop = Math.min(
        position.y, 
        viewportHeight - menuRect.height / 2 - 10
      );
      
      menuRef.current.style.left = `${Math.max(menuRect.width / 2 + 10, adjustedLeft)}px`;
      menuRef.current.style.top = `${Math.max(menuRect.height / 2 + 10, adjustedTop)}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg w-60 z-50 overflow-hidden"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className={sectionIndex > 0 ? 'mt-2' : ''}>
          <h3 className="text-gray-900 font-medium px-3 py-1 text-sm">{section.title}</h3>
          <div className="space-y-1 px-2 pb-2">
            {section.options.map((option) => (
              <button
                key={option.id}
                className="flex items-center w-full px-2 py-1 rounded-md hover:bg-gray-100 text-left"
                onClick={() => {
                  option.onClick();
                  onClose();
                }}
              >
                <div 
                  className={`w-8 h-8 flex items-center justify-center text-white rounded-md mr-2`}
                  style={{ backgroundColor: option.iconBgColor || '#4338ca' }}
                >
                  {option.icon}
                </div>
                <span className="text-gray-900 font-medium text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 