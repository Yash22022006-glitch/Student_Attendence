
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { api } from '../services/attendanceService';
import { Student, AttendanceStatus, User } from '../types';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface AttendanceTakerProps {
  user: User;
}

export const AttendanceTaker: React.FC<AttendanceTakerProps> = ({ user }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
        const studentData = await api.getStudentsByClass(user.associatedId);
        setStudents(studentData);
    };
    fetchStudents();
  }, [user.associatedId]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions and try again.");
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  }, []);

  useEffect(() => {
    // Cleanup function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleScan = async () => {
    setIsScanning(true);
    setScannedStudent(null);
    
    // --- SIMULATION LOGIC ---
    // In a real app, you would capture a frame, send it to a facial recognition API.
    // Here, we'll just pick a random student from the list to simulate a successful scan.
    setTimeout(async () => {
      try {
        if (students.length === 0) {
            throw new Error("No students loaded for this class.");
        }
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const updatedStudent = await api.markAttendance(randomStudent.id, AttendanceStatus.Present);
        setScannedStudent(updatedStudent);
      } catch (e) {
        setError("Failed to mark attendance. Please try again.");
      } finally {
        setIsScanning(false);
      }
    }, 2000); // Simulate network and processing time
  };

  return (
    <div className="p-6 md:p-10">
      <Card title="Real-Time Attendance" className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4">{error}</p>}
          <div className="w-full max-w-lg bg-gray-900 rounded-lg overflow-hidden relative border-4 border-gray-300">
            <video ref={videoRef} autoPlay playsInline muted className={`w-full transition-opacity duration-300 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}/>
            {!isCameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" /></svg>
                    <p className="text-lg font-semibold">Camera is off</p>
                </div>
            )}
             {isScanning && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-10">
                    <Spinner />
                    <p className="mt-4 text-lg font-semibold">Scanning...</p>
                </div>
            )}
          </div>
          <div className="mt-6 flex space-x-4">
            {!isCameraOn ? (
              <button onClick={startCamera} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 flex items-center space-x-2">
                 <span>Start Camera</span>
              </button>
            ) : (
                <>
                <button onClick={handleScan} disabled={isScanning} className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 flex items-center space-x-2">
                    <span>Scan Student</span>
                </button>
                <button onClick={stopCamera} className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center space-x-2">
                    <span>Stop Camera</span>
                </button>
              </>
            )}
          </div>
        </div>
        
        {scannedStudent && (
            <div className="mt-8 p-4 bg-green-100 border-l-4 border-green-500 rounded-lg flex items-center space-x-4 animate-fade-in">
                <img src={scannedStudent.profileImg} alt={scannedStudent.name} className="w-16 h-16 rounded-full"/>
                <div>
                    <p className="text-lg font-bold text-green-800">Attendance Marked!</p>
                    <p className="text-gray-700"><strong>{scannedStudent.name}</strong> marked as <strong>Present</strong> for today.</p>
                </div>
            </div>
        )}
      </Card>
    </div>
  );
};
