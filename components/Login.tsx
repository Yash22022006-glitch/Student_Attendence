
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/attendanceService';
import { Spinner } from './common/Spinner';
import { Card } from './common/Card';

interface LoginProps {
  onLogin: (user: User) => void;
}

const RoleCard: React.FC<{ role: UserRole; selectedRole: UserRole | null; onSelect: (role: UserRole) => void; icon: React.ReactNode }> = ({ role, selectedRole, onSelect, icon }) => (
    <div
        onClick={() => onSelect(role)}
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
            selectedRole === role
                ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                : 'border-gray-300 bg-white hover:border-primary-400 hover:shadow-md'
        }`}
    >
        {icon}
        <h3 className="text-xl font-semibold text-gray-700">{role}</h3>
    </div>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const fetchedUsers = await api.getUsers();
      setUsers(fetchedUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUser);
    if (user) {
      onLogin(user);
    }
  };
  
  const usersForRole = users.filter(u => u.role === selectedRole);

  const AdminIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 12 15v-2.25m-3.75 0a3.75 3.75 0 0 1 7.5 0v2.25m-7.5 0h7.5m-7.5 0H3.375c-1.621 0-2.924.962-3.321 2.311C.013 18.225 0 18.595 0 19.5v.052c0 .653.163 1.298.468 1.888C1.229 22.428 2.593 24 4.125 24h15.75c1.532 0 2.896-1.572 3.657-2.562a4.439 4.439 0 0 0 .468-1.888v-.052c0-.905-.013-1.275-.038-1.572-.397-1.35-1.7-2.311-3.321-2.311h-1.385m-7.5 0h7.5" /></svg>;
  const TeacherIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
  const ParentIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary-500"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 12 15v-2.25m-3.75 0a3.75 3.75 0 0 1 7.5 0v2.25m-7.5 0h7.5m-7.5 0H3.375c-1.621 0-2.924.962-3.321 2.311C.013 18.225 0 18.595 0 19.5v.052c0 .653.163 1.298.468 1.888C1.229 22.428 2.593 24 4.125 24h15.75c1.532 0 2.896-1.572 3.657-2.562a4.439 4.439 0 0 0 .468-1.888v-.052c0-.905-.013-1.275-.038-1.572-.397-1.35-1.7-2.311-3.321-2.311h-1.385m-7.5 0h7.5" /></svg>;
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Smart Attendance</h1>
            <p className="text-lg text-gray-600 mt-2">Please select your role to continue.</p>
        </div>
        <Card className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <RoleCard role={UserRole.Admin} selectedRole={selectedRole} onSelect={setSelectedRole} icon={AdminIcon} />
                <RoleCard role={UserRole.Teacher} selectedRole={selectedRole} onSelect={setSelectedRole} icon={TeacherIcon} />
                <RoleCard role={UserRole.Parent} selectedRole={selectedRole} onSelect={setSelectedRole} icon={ParentIcon} />
            </div>

            {selectedRole && (
                <form onSubmit={handleLogin} className="mt-8 space-y-6 animate-fade-in">
                     <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                    >
                        <option value="" disabled>Select your name</option>
                        {usersForRole.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        disabled={!selectedUser}
                        className="w-full bg-primary-600 text-white p-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
                    >
                        Login as {selectedRole}
                    </button>
                </form>
            )}
        </Card>
      </div>
    </div>
  );
};
