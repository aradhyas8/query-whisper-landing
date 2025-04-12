
import React from 'react';

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl font-bold">
        <span className="text-gradient">Query</span>
        <span className="text-white">.io</span>
      </span>
    </div>
  );
};

export default Logo;
