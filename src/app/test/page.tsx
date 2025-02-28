'use client';

import { useState } from 'react';

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-white">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Test Page</h1>
      <p className="mb-4 text-gray-800">This is a simple test page to check if routing is working correctly.</p>
      <div className="flex items-center gap-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setCount(count + 1)}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
} 