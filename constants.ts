
import { Student, User, UserRole, AttendanceStatus } from './types';

function generateAttendance(days: number): { date: string; status: AttendanceStatus }[] {
  const attendance: { date: string; status: AttendanceStatus }[] = [];
  const today = new Date();
  const statuses = [AttendanceStatus.Present, AttendanceStatus.Present, AttendanceStatus.Present, AttendanceStatus.Present, AttendanceStatus.Present, AttendanceStatus.Absent, AttendanceStatus.Late, AttendanceStatus.Excused];
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - i));
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    attendance.push({
      date: date.toISOString().split('T')[0],
      status,
    });
  }
  return attendance;
}


export const MOCK_STUDENTS: Student[] = [
  {
    id: 's001',
    name: 'Alice Johnson',
    class: 'Grade 5',
    profileImg: 'https://picsum.photos/seed/alice/200',
    parentId: 'p001',
    attendance: generateAttendance(30),
  },
  {
    id: 's002',
    name: 'Bob Williams',
    class: 'Grade 5',
    profileImg: 'https://picsum.photos/seed/bob/200',
    parentId: 'p002',
    attendance: generateAttendance(30),
  },
  {
    id: 's003',
    name: 'Charlie Brown',
    class: 'Grade 5',
    profileImg: 'https://picsum.photos/seed/charlie/200',
    parentId: 'p003',
    attendance: generateAttendance(30),
  },
  {
    id: 's004',
    name: 'Diana Miller',
    class: 'Grade 4',
    profileImg: 'https://picsum.photos/seed/diana/200',
    parentId: 'p004',
    attendance: generateAttendance(30),
  },
  {
    id: 's005',
    name: 'Ethan Davis',
    class: 'Grade 4',
    profileImg: 'https://picsum.photos/seed/ethan/200',
    parentId: 'p005',
    attendance: generateAttendance(30),
  },
];


export const MOCK_USERS: User[] = [
  {
    id: 'u001',
    name: 'Dr. Evelyn Reed',
    role: UserRole.Admin,
    associatedId: 'all',
  },
  {
    id: 'u002',
    name: 'Mr. David Chen',
    role: UserRole.Teacher,
    associatedId: 'Grade 5',
  },
  {
    id: 'p001',
    name: 'Sarah Johnson (Parent)',
    role: UserRole.Parent,
    associatedId: 's001',
  },
];
