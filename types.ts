
export enum UserRole {
  Admin = 'Admin',
  Teacher = 'Teacher',
  Parent = 'Parent',
}

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
  Excused = 'Excused',
}

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  profileImg: string;
  parentId: string;
  attendance: AttendanceRecord[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  // For parents, this would be their child's ID. For teachers, their class. For admins, 'all'.
  associatedId: string;
}

export enum View {
  Login,
  Dashboard,
  AttendanceTaker,
  StudentDetails,
}
