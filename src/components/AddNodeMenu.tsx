'use client';

import { useState } from 'react';
import ContextualMenu from './ContextualMenu';

interface AddNodeMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: string) => void;
}

export default function AddNodeMenu({ 
  isOpen, 
  position, 
  onClose, 
  onAddNode 
}: AddNodeMenuProps) {
  // Define message options
  const messageOptions = [
    {
      id: 'push',
      label: 'Push Notification',
      iconBgColor: '#3730a3', // indigo-800
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>,
      onClick: () => onAddNode('push')
    },
    {
      id: 'email',
      label: 'Email',
      iconBgColor: '#3730a3', // indigo-800
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
      onClick: () => onAddNode('email')
    },
    {
      id: 'inApp',
      label: 'In-App Message',
      iconBgColor: '#3730a3', // indigo-800
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>,
      onClick: () => onAddNode('inApp')
    },
    {
      id: 'sms',
      label: 'SMS',
      iconBgColor: '#3730a3', // indigo-800
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>,
      onClick: () => onAddNode('sms')
    },
    {
      id: 'webhook',
      label: 'Webhook',
      iconBgColor: '#3730a3', // indigo-800
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      onClick: () => onAddNode('webhook')
    }
  ];

  // Define action options
  const actionOptions = [
    {
      id: 'wait',
      label: 'Wait',
      iconBgColor: '#b45309', // amber-700
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      onClick: () => onAddNode('wait')
    },
    {
      id: 'timeWindow',
      label: 'Time Window',
      iconBgColor: '#b45309', // amber-700
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      onClick: () => onAddNode('timeWindow')
    },
    {
      id: 'branch',
      label: 'Yes/No Branch',
      iconBgColor: '#b45309', // amber-700
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>,
      onClick: () => onAddNode('branch')
    },
    {
      id: 'split',
      label: 'Split Branch',
      iconBgColor: '#b45309', // amber-700
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>,
      onClick: () => onAddNode('split')
    },
    {
      id: 'tag',
      label: 'Tag User',
      iconBgColor: '#b45309', // amber-700
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>,
      onClick: () => onAddNode('tag')
    }
  ];

  // Define menu sections
  const menuSections = [
    {
      title: 'Send a Message',
      options: messageOptions
    },
    {
      title: 'Actions',
      options: actionOptions
    }
  ];

  return (
    <ContextualMenu
      sections={menuSections}
      position={position}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
} 