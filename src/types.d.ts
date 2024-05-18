type AttendanceStatus = "present" | "absent" | null;

interface AttendanceRecord {
  [date: string]: {
    class1: AttendanceStatus;
    class2: AttendanceStatus;
    class3: AttendanceStatus;
  };
}

interface Student {
  studentID: number;
  studentName: string;
  attendanceRecord: AttendanceRecord;
}
