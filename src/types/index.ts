// Core data types for the admin dashboard

export interface Role {
  id: string;
  roleName: string;
  description: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  grade: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive';
}

export interface Teacher {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export interface Parent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  associatedStudents: string[];
  registrationDate: string;
  status: 'Active' | 'Inactive';
}

export interface Clinistinction {
  id: string;
  name: string;
  description: string;
  category: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

export interface CountryCode {
  id: string;
  countryName: string;
  dialCode: string;
  status: 'Active' | 'Inactive';
}

export interface School {
  id: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  establishedDate: string;
  status: 'Active' | 'Inactive';
}

export interface AppSettings {
  appImage: string;
  appName: string;
  lastUpdated: string;
}
