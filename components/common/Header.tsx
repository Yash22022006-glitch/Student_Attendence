
import React from 'react';
import { User, View } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, setView }) => {
  if (!user) return null;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Smart Attendance</h1>
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-4">
            <button onClick={() => setView(View.Dashboard)} className="text-gray-600 hover:text-primary-600 font-medium">Dashboard</button>
            {user.role !== 'Parent' && (
              <button onClick={() => setView(View.AttendanceTaker)} className="text-gray-600 hover:text-primary-600 font-medium">Take Attendance</button>
            )}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
            <button onClick={onLogout} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
