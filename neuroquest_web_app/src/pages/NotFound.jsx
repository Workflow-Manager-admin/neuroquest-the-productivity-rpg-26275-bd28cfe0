import React from 'react';
// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 Not Found page placeholder */
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <h1 className="text-5xl font-bold neon-accent mb-6">404</h1>
      <div className="text-xl text-textFaded">The page you are looking for does not exist.</div>
    </div>
  );
}
