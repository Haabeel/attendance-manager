import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateDates = (): string[] => {
  const dates: string[] = [];
  const startDate = new Date(2023, 9, 1); // October 1, 2023
  const endDate = new Date(2024, 0, 31); // January 31, 2024

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    dates.push(dateString);
  }

  return dates;
};

export const initializeAttendanceRecord = (
  dates: string[]
): AttendanceRecord => {
  const record: AttendanceRecord = {};
  dates.forEach((date) => {
    record[date] = {
      class1: null,
      class2: null,
      class3: null,
    };
  });
  return record;
};

export const addStudentRecordsToLocal = (students: Student[]) => {
  localStorage.setItem("studentRecords", JSON.stringify(students));
};

export const getStudentRecordsFromLocal = (): Student[] => {
  const storedData = localStorage.getItem("studentRecords");
  return storedData ? JSON.parse(storedData) : [];
};

export const addStudent = (newStudent: Student) => {
  const students = getStudentRecordsFromLocal();
  students.push(newStudent);
  addStudentRecordsToLocal(students);
};

export const updateStudent = (updatedStudent: Student) => {
  const students = getStudentRecordsFromLocal();
  const index = students.findIndex(
    (student) => student.studentID === updatedStudent.studentID
  );
  if (index !== -1) {
    students[index] = updatedStudent;
    addStudentRecordsToLocal(students);
  }
};

export const deleteStudent = (studentID: number) => {
  const students = getStudentRecordsFromLocal();
  const updatedStudents = students.filter(
    (student) => student.studentID !== studentID
  );
  addStudentRecordsToLocal(updatedStudents);
};

export const getAllStudents = (): Student[] => {
  return getStudentRecordsFromLocal();
};

export const findStudentById = (studentId: string): Student | null => {
  const students = getStudentRecordsFromLocal();
  const parsedId = parseInt(studentId, 10); // Parse the input ID as integer
  if (isNaN(parsedId)) return null; // If parsing fails, return null

  const student = students.find((student) => student.studentID === parsedId);
  return student || null; // Return the student if found, otherwise return null
};

export const chooseRandomClass = (): string => {
  const classes = ["class1", "class2", "class3"];
  const randomIndex = Math.floor(Math.random() * classes.length);
  return classes[randomIndex];
};

export const chooseRandomDate = (student: Student): string => {
  const dates = Object.keys(student.attendanceRecord);
  const randomIndex = Math.floor(Math.random() * dates.length);
  return dates[randomIndex];
};

export const sendMail = () => {
  // Show loading toast
  toast.loading("Sending Email", {
    id: "loader",
  });

  // Dismiss loading toast after 3 seconds
  setTimeout(() => {
    toast.dismiss("loader");
    toast.success("Email sent successfully.");
  }, 1500);
};
