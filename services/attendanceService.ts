
import { MOCK_STUDENTS, MOCK_USERS } from '../constants';
import { Student, User, AttendanceStatus } from '../types';

// This file simulates a backend API. In a real application, these functions
// would make HTTP requests to a server (e.g., using fetch or axios).
// The `setTimeout` calls simulate network latency.

const studentsDB: Student[] = JSON.parse(JSON.stringify(MOCK_STUDENTS));
const usersDB: User[] = JSON.parse(JSON.stringify(MOCK_USERS));

export const api = {
  getUsers: (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(usersDB);
      }, 500);
    });
  },

  getStudentsByClass: (className: string): Promise<Student[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (className === 'all') {
          resolve(studentsDB);
        } else {
          resolve(studentsDB.filter(s => s.class === className));
        }
      }, 800);
    });
  },
  
  getStudentById: (studentId: string): Promise<Student | undefined> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        resolve(studentsDB.find(s => s.id === studentId));
      }, 300);
    });
  },

  markAttendance: (studentId: string, status: AttendanceStatus): Promise<Student> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const studentIndex = studentsDB.findIndex(s => s.id === studentId);
        if (studentIndex === -1) {
          return reject(new Error('Student not found'));
        }

        const today = new Date().toISOString().split('T')[0];
        const student = studentsDB[studentIndex];
        const todayRecordIndex = student.attendance.findIndex(a => a.date === today);

        if (todayRecordIndex > -1) {
          student.attendance[todayRecordIndex].status = status;
        } else {
          student.attendance.push({ date: today, status });
        }
        
        studentsDB[studentIndex] = student;
        resolve(student);
      }, 1000);
    });
  },
};
