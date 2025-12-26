import type { Role, Student, Teacher, Parent, Clinistinction, CountryCode, School, AppSettings } from '../types';

// Mock Roles Data
export const mockRoles: Role[] = [
    { id: '1', roleName: 'Administrator', description: 'Full system access', createdDate: '2024-01-15', status: 'Active' },
    { id: '2', roleName: 'Teacher', description: 'Teaching staff access', createdDate: '2024-01-15', status: 'Active' },
    { id: '3', roleName: 'Student', description: 'Student portal access', createdDate: '2024-01-15', status: 'Active' },
    { id: '4', roleName: 'Parent', description: 'Parent portal access', createdDate: '2024-01-15', status: 'Active' },
    { id: '5', roleName: 'Guest', description: 'Limited read-only access', createdDate: '2024-02-01', status: 'Inactive' },
];

// Mock Students Data
export const mockStudents: Student[] = [
    { id: 'S001', fullName: 'Emma Johnson', email: 'emma.j@school.edu', phone: '+1-555-0101', grade: '10th Grade', enrollmentDate: '2023-09-01', status: 'Active' },
    { id: 'S002', fullName: 'Liam Smith', email: 'liam.s@school.edu', phone: '+1-555-0102', grade: '9th Grade', enrollmentDate: '2023-09-01', status: 'Active' },
    { id: 'S003', fullName: 'Olivia Brown', email: 'olivia.b@school.edu', phone: '+1-555-0103', grade: '11th Grade', enrollmentDate: '2022-09-01', status: 'Active' },
    { id: 'S004', fullName: 'Noah Davis', email: 'noah.d@school.edu', phone: '+1-555-0104', grade: '10th Grade', enrollmentDate: '2023-09-01', status: 'Active' },
    { id: 'S005', fullName: 'Ava Wilson', email: 'ava.w@school.edu', phone: '+1-555-0105', grade: '12th Grade', enrollmentDate: '2021-09-01', status: 'Active' },
    { id: 'S006', fullName: 'Ethan Martinez', email: 'ethan.m@school.edu', phone: '+1-555-0106', grade: '9th Grade', enrollmentDate: '2023-09-01', status: 'Active' },
    { id: 'S007', fullName: 'Sophia Garcia', email: 'sophia.g@school.edu', phone: '+1-555-0107', grade: '11th Grade', enrollmentDate: '2022-09-01', status: 'Active' },
    { id: 'S008', fullName: 'Mason Rodriguez', email: 'mason.r@school.edu', phone: '+1-555-0108', grade: '10th Grade', enrollmentDate: '2023-09-01', status: 'Inactive' },
    { id: 'S009', fullName: 'Isabella Lee', email: 'isabella.l@school.edu', phone: '+1-555-0109', grade: '12th Grade', enrollmentDate: '2021-09-01', status: 'Active' },
    { id: 'S010', fullName: 'James Anderson', email: 'james.a@school.edu', phone: '+1-555-0110', grade: '9th Grade', enrollmentDate: '2023-09-01', status: 'Active' },
];

// Mock Teachers Data
export const mockTeachers: Teacher[] = [
    { id: 'T001', fullName: 'Dr. Sarah Williams', email: 'sarah.w@school.edu', phone: '+1-555-0201', subject: 'Mathematics', department: 'Science & Math', joinDate: '2020-08-15', status: 'Active' },
    { id: 'T002', fullName: 'Prof. Michael Chen', email: 'michael.c@school.edu', phone: '+1-555-0202', subject: 'Physics', department: 'Science & Math', joinDate: '2019-08-15', status: 'Active' },
    { id: 'T003', fullName: 'Ms. Emily Taylor', email: 'emily.t@school.edu', phone: '+1-555-0203', subject: 'English Literature', department: 'Humanities', joinDate: '2021-08-15', status: 'Active' },
    { id: 'T004', fullName: 'Mr. David Kumar', email: 'david.k@school.edu', phone: '+1-555-0204', subject: 'Computer Science', department: 'Technology', joinDate: '2020-08-15', status: 'Active' },
    { id: 'T005', fullName: 'Dr. Lisa Thompson', email: 'lisa.t@school.edu', phone: '+1-555-0205', subject: 'Chemistry', department: 'Science & Math', joinDate: '2018-08-15', status: 'Active' },
    { id: 'T006', fullName: 'Mr. Robert Jackson', email: 'robert.j@school.edu', phone: '+1-555-0206', subject: 'History', department: 'Humanities', joinDate: '2022-08-15', status: 'Active' },
    { id: 'T007', fullName: 'Ms. Jennifer White', email: 'jennifer.w@school.edu', phone: '+1-555-0207', subject: 'Biology', department: 'Science & Math', joinDate: '2021-08-15', status: 'Active' },
    { id: 'T008', fullName: 'Prof. Ahmed Hassan', email: 'ahmed.h@school.edu', phone: '+1-555-0208', subject: 'Art & Design', department: 'Arts', joinDate: '2020-08-15', status: 'Inactive' },
];

// Mock Parents Data
export const mockParents: Parent[] = [
    { id: 'P001', fullName: 'John Johnson', email: 'john.j@email.com', phone: '+1-555-0301', associatedStudents: ['Emma Johnson'], registrationDate: '2023-08-20', status: 'Active' },
    { id: 'P002', fullName: 'Mary Smith', email: 'mary.s@email.com', phone: '+1-555-0302', associatedStudents: ['Liam Smith'], registrationDate: '2023-08-20', status: 'Active' },
    { id: 'P003', fullName: 'Robert Brown', email: 'robert.b@email.com', phone: '+1-555-0303', associatedStudents: ['Olivia Brown'], registrationDate: '2022-08-20', status: 'Active' },
    { id: 'P004', fullName: 'Patricia Davis', email: 'patricia.d@email.com', phone: '+1-555-0304', associatedStudents: ['Noah Davis'], registrationDate: '2023-08-20', status: 'Active' },
    { id: 'P005', fullName: 'Michael Wilson', email: 'michael.w@email.com', phone: '+1-555-0305', associatedStudents: ['Ava Wilson'], registrationDate: '2021-08-20', status: 'Active' },
];

// Mock Clinistinction Data
export const mockClinistinction: Clinistinction[] = [
    { id: 'C001', name: 'ADHD Support', description: 'Attention Deficit Hyperactivity Disorder support program', category: 'Behavioral', createdDate: '2024-01-10', status: 'Active' },
    { id: 'C002', name: 'Dyslexia Program', description: 'Specialized reading and writing support', category: 'Learning', createdDate: '2024-01-10', status: 'Active' },
    { id: 'C003', name: 'Autism Spectrum', description: 'Autism spectrum disorder support services', category: 'Developmental', createdDate: '2024-01-10', status: 'Active' },
    { id: 'C004', name: 'Speech Therapy', description: 'Speech and language development support', category: 'Communication', createdDate: '2024-01-15', status: 'Active' },
    { id: 'C005', name: 'Gifted Program', description: 'Advanced learning opportunities', category: 'Academic', createdDate: '2024-02-01', status: 'Active' },
];

// Mock Country Codes Data
export const mockCountryCodes: CountryCode[] = [
    { id: 'CC001', countryName: 'United States', dialCode: '+1', status: 'Active' },
    { id: 'CC002', countryName: 'United Kingdom', dialCode: '+44', status: 'Active' },
    { id: 'CC003', countryName: 'India', dialCode: '+91', status: 'Active' },
    { id: 'CC004', countryName: 'Canada', dialCode: '+1', status: 'Active' },
    { id: 'CC005', countryName: 'Australia', dialCode: '+61', status: 'Active' },
    { id: 'CC006', countryName: 'Germany', dialCode: '+49', status: 'Active' },
    { id: 'CC007', countryName: 'France', dialCode: '+33', status: 'Active' },
    { id: 'CC008', countryName: 'Japan', dialCode: '+81', status: 'Active' },
    { id: 'CC009', countryName: 'China', dialCode: '+86', status: 'Active' },
    { id: 'CC010', countryName: 'Brazil', dialCode: '+55', status: 'Active' },
];

// Mock Schools Data
export const mockSchools: School[] = [
    { id: 'SCH001', schoolName: 'Lincoln High School', address: '123 Main St, Springfield', phone: '+1-555-1001', email: 'info@lincoln.edu', principalName: 'Dr. Margaret Foster', establishedDate: '1985-09-01', status: 'Active' },
    { id: 'SCH002', schoolName: 'Washington Elementary', address: '456 Oak Ave, Springfield', phone: '+1-555-1002', email: 'info@washington.edu', principalName: 'Mr. Thomas Greene', establishedDate: '1992-09-01', status: 'Active' },
    { id: 'SCH003', schoolName: 'Roosevelt Middle School', address: '789 Pine Rd, Springfield', phone: '+1-555-1003', email: 'info@roosevelt.edu', principalName: 'Ms. Sandra Mitchell', establishedDate: '1998-09-01', status: 'Active' },
    { id: 'SCH004', schoolName: 'Jefferson Academy', address: '321 Elm St, Springfield', phone: '+1-555-1004', email: 'info@jefferson.edu', principalName: 'Dr. Richard Barnes', establishedDate: '2005-09-01', status: 'Active' },
    { id: 'SCH005', schoolName: 'Madison Prep School', address: '654 Maple Dr, Springfield', phone: '+1-555-1005', email: 'info@madison.edu', principalName: 'Mrs. Helen Carter', establishedDate: '2010-09-01', status: 'Active' },
];

// Mock App Settings
export const mockAppSettings: AppSettings = {
    appImage: '/placeholder-logo.png',
    appName: 'Zabiyo Admin',
    lastUpdated: '2024-12-26',
};
