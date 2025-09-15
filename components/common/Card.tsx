
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleIcon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleIcon }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-2">
           {titleIcon}
           <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
