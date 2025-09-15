
import React, { useState, useEffect, useCallback } from 'react';
import { User, Student, View, AttendanceStatus } from '../types';
import { api } from '../services/attendanceService';
import { generateParentSummary } from '../services/geminiService';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface StudentDetailsProps {
  user: User;
  studentId: string;
  setView: (view: View) => void;
}

const statusStyles: { [key in AttendanceStatus]: { bg: string; text: string; icon: React.ReactNode } } = {
  [AttendanceStatus.Present]: { bg: 'bg-green-100', text: 'text-green-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> },
  [AttendanceStatus.Absent]: { bg: 'bg-red-100', text: 'text-red-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> },
  [AttendanceStatus.Late]: { bg: 'bg-orange-100', text: 'text-orange-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg> },
  [AttendanceStatus.Excused]: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 2l7.997 3.884A2 2 0 0119 7.616v5.495a2 2 0 01-1.128 1.815l-6.872 3.328a2 2 0 01-1.812 0l-6.872-3.328A2 2 0 011 13.111V7.616a2 2 0 011.003-1.732zM10 4.236L3.927 7.091l6.073 2.94 6.073-2.94L10 4.236zM12 11.091l-2 1v3.328l2-1v-3.328z" /></svg> },
};

export const StudentDetails: React.FC<StudentDetailsProps> = ({ user, studentId, setView }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      const studentData = await api.getStudentById(studentId);
      setStudent(studentData || null);
      setLoading(false);
    };
    fetchStudent();
  }, [studentId]);

  const handleGenerateSummary = async () => {
    if (!student) return;
    setLoadingSummary(true);
    const result = await generateParentSummary(student);
    setSummary(result);
    setLoadingSummary(false);
  };
  
  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><Spinner /></div>;
  if (!student) return <div className="text-center p-8 text-gray-500">Could not find student data.</div>;
  
  const sortedAttendance = [...student.attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <button onClick={() => setView(View.Dashboard)} className="flex items-center space-x-2 text-primary-600 hover:underline font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="text-center">
            <img src={student.profileImg} alt={student.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary-200" />
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-gray-600">{student.class}</p>
          </Card>
           <Card title="AI-Powered Summary" className="mt-8" titleIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>}>
            <button onClick={handleGenerateSummary} disabled={loadingSummary} className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400">
                {loadingSummary ? 'Generating...' : 'Generate Parent Summary'}
            </button>
            {loadingSummary && <div className="mt-4"><Spinner /></div>}
            {summary && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap font-mono text-sm">
                {summary}
                </div>
            )}
            </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Attendance History (Last 30 Days)">
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {sortedAttendance.map(record => {
                const style = statusStyles[record.status];
                return (
                  <div key={record.date} className={`p-3 rounded-lg flex justify-between items-center ${style.bg} ${style.text}`}>
                    <span className="font-semibold">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                    <div className="flex items-center space-x-2 px-3 py-1 rounded-full font-medium text-sm">
                        {style.icon}
                        <span>{record.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
