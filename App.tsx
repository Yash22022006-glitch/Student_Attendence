
import React, { useState, useCallback } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AttendanceTaker } from './components/AttendanceTaker';
import { StudentDetails } from './components/StudentDetails';
import { Header } from './components/common/Header';
import { User, View } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.Login);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    if (user.role === 'Parent' && user.associatedId) {
        setSelectedStudentId(user.associatedId);
        setCurrentView(View.StudentDetails);
    } else {
        setCurrentView(View.Dashboard);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setCurrentView(View.Login);
    setSelectedStudentId(null);
  }, []);

  const setView = (view: View) => {
    if (view === View.StudentDetails && !selectedStudentId) {
      // Prevent navigating to details without a student selected, except for parents
      if (currentUser?.role !== 'Parent') {
        console.error("Cannot view details without selecting a student.");
        return;
      }
    }
    setCurrentView(view);
  };

  const renderContent = () => {
    if (!currentUser) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentView) {
      case View.Dashboard:
        return <Dashboard user={currentUser} setView={setView} setSelectedStudentId={setSelectedStudentId} />;
      case View.AttendanceTaker:
        return <AttendanceTaker user={currentUser} />;
      case View.StudentDetails:
        if (selectedStudentId) {
          return <StudentDetails user={currentUser} studentId={selectedStudentId} setView={setView} />;
        }
        // Fallback for parent role, studentId is pre-set
        if(currentUser.role === 'Parent' && currentUser.associatedId) {
             return <StudentDetails user={currentUser} studentId={currentUser.associatedId} setView={setView} />;
        }
        setCurrentView(View.Dashboard); // Go back if no student is selected
        return null;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {currentUser && <Header user={currentUser} onLogout={handleLogout} setView={setView} />}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
