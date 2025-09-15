
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { User, Student, View, AttendanceStatus } from '../types';
import { api } from '../services/attendanceService';
import { getAttendanceAnalysis } from '../services/geminiService';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface DashboardProps {
  user: User;
  setView: (view: View) => void;
  setSelectedStudentId: (id: string) => void;
}

const statusColors: { [key in AttendanceStatus]: string } = {
  [AttendanceStatus.Present]: '#22c55e', // green-500
  [AttendanceStatus.Absent]: '#ef4444', // red-500
  [AttendanceStatus.Late]: '#f97316', // orange-500
  [AttendanceStatus.Excused]: '#60a5fa', // blue-400
};

const PIE_COLORS = [statusColors.Present, statusColors.Absent, statusColors.Late, statusColors.Excused];

export const Dashboard: React.FC<DashboardProps> = ({ user, setView, setSelectedStudentId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    let studentData: Student[] = [];
    if (user.role === 'Parent') {
      const student = await api.getStudentById(user.associatedId);
      if (student) studentData = [student];
    } else {
      studentData = await api.getStudentsByClass(user.associatedId);
    }
    setStudents(studentData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleGenerateAnalysis = async () => {
    setLoadingAnalysis(true);
    const result = await getAttendanceAnalysis(students);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const dashboardData = useMemo(() => {
    if (!students.length) return null;
    const totalRecords = students.reduce((acc, s) => acc + s.attendance.length, 0);
    const present = students.reduce((acc, s) => acc + s.attendance.filter(a => a.status === 'Present').length, 0);
    const absent = students.reduce((acc, s) => acc + s.attendance.filter(a => a.status === 'Absent').length, 0);
    const late = students.reduce((acc, s) => acc + s.attendance.filter(a => a.status === 'Late').length, 0);
    const excused = students.reduce((acc, s) => acc + s.attendance.filter(a => a.status === 'Excused').length, 0);
    
    const attendanceRate = totalRecords > 0 ? ((present / totalRecords) * 100).toFixed(1) : 'N/A';
    
    const pieData = [
        { name: 'Present', value: present },
        { name: 'Absent', value: absent },
        { name: 'Late', value: late },
        { name: 'Excused', value: excused },
    ];
    
    const weeklyData: {[key: string]: number} = {};
    students.forEach(s => {
        s.attendance.forEach(a => {
            if (a.status === 'Absent') {
                const day = new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' });
                weeklyData[day] = (weeklyData[day] || 0) + 1;
            }
        });
    });
    const barData = Object.entries(weeklyData).map(([name, absences]) => ({ name, absences }));

    return { totalStudents: students.length, attendanceRate, totalAbsences: absent, pieData, barData };
  }, [students]);

  const viewStudentDetails = (studentId: string) => {
    setSelectedStudentId(studentId);
    setView(View.StudentDetails);
  };
  
  if (loading) return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><Spinner /></div>;
  if (!dashboardData) return <div className="text-center p-8 text-gray-500">No student data available.</div>;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Students" className="bg-primary-500 text-white">
          <p className="text-5xl font-bold">{dashboardData.totalStudents}</p>
        </Card>
        <Card title="Overall Attendance Rate" className="bg-green-500 text-white">
          <p className="text-5xl font-bold">{dashboardData.attendanceRate}%</p>
        </Card>
        <Card title="Total Absences (30d)" className="bg-red-500 text-white">
          <p className="text-5xl font-bold">{dashboardData.totalAbsences}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card title="Weekly Absence Trends">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.barData}>
                <XAxis dataKey="name" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip wrapperClassName="!bg-white !border-gray-300 !rounded-lg" />
                <Legend />
                <Bar dataKey="absences" fill={statusColors.Absent} name="Absences"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <Card title="Attendance Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dashboardData.pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                  {dashboardData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      
      {user.role !== 'Parent' && (
        <Card title="Student Overview">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 font-semibold text-gray-600">Name</th>
                  <th className="p-3 font-semibold text-gray-600">Class</th>
                  <th className="p-3 font-semibold text-gray-600">Attendance (30d)</th>
                  <th className="p-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const presentCount = student.attendance.filter(a => a.status === 'Present').length;
                  const rate = student.attendance.length > 0 ? (presentCount / student.attendance.length * 100).toFixed(0) : 'N/A';
                  return (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 flex items-center space-x-3">
                        <img src={student.profileImg} alt={student.name} className="w-10 h-10 rounded-full" />
                        <span className="font-medium">{student.name}</span>
                      </td>
                      <td className="p-3">{student.class}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                           <span className={`font-bold ${rate !== 'N/A' && parseInt(rate) < 80 ? 'text-red-500' : 'text-green-500'}`}>{rate}%</span>
                           <div className="w-full bg-gray-200 rounded-full h-2.5">
                             <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${rate}%` }}></div>
                           </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <button onClick={() => viewStudentDetails(student.id)} className="text-primary-600 hover:underline">View Details</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {user.role !== 'Parent' && (
        <Card title="AI-Powered Insights" titleIcon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>}>
          <button onClick={handleGenerateAnalysis} disabled={loadingAnalysis} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400">
            {loadingAnalysis ? 'Analyzing...' : 'Generate Attendance Analysis'}
          </button>
          {loadingAnalysis && <div className="mt-4"><Spinner /></div>}
          {analysis && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap font-mono text-sm">
              {analysis}
            </div>
          )}
        </Card>
      )}

    </div>
  );
};
