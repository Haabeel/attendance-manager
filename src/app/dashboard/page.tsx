"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { stdRecords } from "@/lib/database";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  addStudent,
  addStudentRecordsToLocal,
  chooseRandomClass,
  chooseRandomDate,
  deleteStudent,
  findStudentById,
  generateDates,
  getAllStudents,
  getStudentRecordsFromLocal,
  initializeAttendanceRecord,
  sendMail,
} from "@/lib/utils";
import { CircleIcon, InfoCircledIcon } from "@radix-ui/react-icons";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";

const Dashboard = () => {
  const [tab, setTab] = React.useState<
    "Students Record" | "Settings" | "Notifications"
  >("Students Record");
  const [selectedDate, setSelectedDate] = React.useState<string>("2024-01-02");
  const [value, setValue] = React.useState<string>("");
  const [students, setStudents] = React.useState<typeof stdRecords | null>(
    null
  );
  const [stdID, setStdID] = React.useState<string>("");
  const [stdName, setName] = React.useState<string>("");
  const [delStdID, setDelStdID] = React.useState<string>("");
  const [delStdName, setDelStdName] = React.useState<string | null>(null);
  const [threshold, setThreshold] = React.useState<number>(15);
  const [image, setImage] = React.useState<File | string>();
  const renderNotifications = generateRandomNotifications();
  const handleLogout = () => {
    Cookies.remove("auth");
    window.location.href = "/";
  };

  const changeDate = (newDate: string) => {
    try {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      // Check if the date matches the format YYYY-MM-DD
      if (!dateRegex.test(newDate)) {
        toast.error("Invalid date format. Please use YYYY-MM-DD format.");
        return;
      }

      // Parse the new date
      const parsedDate = new Date(newDate);
      const selectedDate = parsedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      // Check if the date is within the range of October 1st and January 31st
      const startDate = new Date(2023, 9, 1); // October 1, 2023
      const endDate = new Date(2024, 0, 31); // January 31, 2024

      if (parsedDate < startDate || parsedDate > endDate) {
        toast.error(
          "Date must be between October 1st, 2023 and January 31st, 2024."
        );
        return;
      }

      // If the date is valid, update the selectedDate state
      setSelectedDate(selectedDate);
      toast.success(`Date changed to ${selectedDate}`);
    } catch (error) {
      return toast.error("An error occurred. Please try again.");
    }
  };

  const handleAddStudent = () => {
    if (stdID === "") return toast.error("Student ID is required");
    if (stdName === "") return toast.error("Student Name is required");
    if (image === undefined) return toast.error("Image is required");
    const student: Student = {
      studentID: parseInt(stdID, 10),
      studentName: stdName,
      attendanceRecord: initializeAttendanceRecord(generateDates()),
    };
    addStudent(student);
    const stdRecords = getStudentRecordsFromLocal();
    setStudents(stdRecords);
    setStdID("");
    setName("");
    setImage(undefined);
    toast.success("Student added successfully");
  };

  const handleSearchClick = () => {
    if (delStdID === "") return toast.error("Student ID is required");
    const student = findStudentById(delStdID);
    if (student) {
      setDelStdName(student.studentName);
    } else {
      setDelStdName(null);
      toast.error("Student not found");
    }
  };

  const handleDelete = () => {
    if (delStdID === "") return toast.error("Student ID is required");
    const student = findStudentById(delStdID);
    if (student) {
      deleteStudent(student.studentID);
      const newStudents = getStudentRecordsFromLocal();
      setStudents(newStudents);
      setDelStdID("");
      setDelStdName(null);
      toast.success("Student deleted successfully");
    } else {
      toast.error("Student not found");
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("studentRecords");
    if (storedData) {
      setStudents(JSON.parse(storedData));
    } else {
      setStudents(stdRecords);
      addStudentRecordsToLocal(stdRecords);
    }
  }, []);

  return (
    <div className="bg-silver flex flex-col p-10 gap-10 text-black w-screen min-h-screen">
      <h1 className="text-5xl font-bold w-full text-center">
        ATTENDANCE MANAGER
      </h1>
      <div className="bg-white p-5 rounded-lg flex flex-col">
        <h2 className="text-2xl w-full text-center font-bold">{tab}</h2>
        <div className="flex justify-center gap-5 mt-5">
          <Button
            onClick={() => setTab("Students Record")}
            className={`${
              tab === "Students Record" ? "bg-blue-900 text-white" : ""
            }`}
          >
            Students Record
          </Button>
          <Button
            onClick={() => setTab("Settings")}
            className={`${tab === "Settings" ? "bg-blue-900 text-white" : ""}`}
          >
            Settings
          </Button>
          <Button
            onClick={() => setTab("Notifications")}
            className={`${
              tab === "Notifications" ? "bg-blue-900 text-white" : ""
            }`}
          >
            Notifications
          </Button>
        </div>
        {tab === "Students Record" && (
          <div className="mt-5 flex flex-col gap-3 items-center">
            <div className="flex justify-between items-center w-full">
              <h1 className="w-full text-lg font-bold">Date: {selectedDate}</h1>
              <div className="flex items-center gap-3 w-full">
                <Input
                  value={value}
                  className="w-full"
                  placeholder="Enter the date in YYYY-MM-DD format"
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button onClick={() => changeDate(value)} variant={"outline"}>
                  Change Date
                </Button>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center">Serial Number</th>
                  <th className="text-center">Student ID</th>
                  <th className="text-center">Student Name</th>
                  <th className="text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students === null && (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <p className="text-lg font-bold">Loading.....</p>
                    </td>
                  </tr>
                )}
                {students &&
                  students.map((student, idx) => (
                    <tr key={student.studentID}>
                      <td className="w-10 text-center">{idx + 1}.</td>
                      <td className="text-center">{student.studentID}</td>
                      <td className="text-center">{student.studentName}</td>
                      <td className="text-center">
                        {student.attendanceRecord[selectedDate] ? (
                          <div>
                            <div>
                              Class 1:{" "}
                              {student.attendanceRecord[selectedDate].class1 ??
                                "null"}
                            </div>
                            <div>
                              Class 2:{" "}
                              {student.attendanceRecord[selectedDate].class2 ??
                                "null"}
                            </div>
                            <div>
                              Class 3:{" "}
                              {student.attendanceRecord[selectedDate].class3 ??
                                "null"}
                            </div>
                          </div>
                        ) : (
                          "No records"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
        {tab === "Settings" && (
          <div className="flex flex-col items-center w-full gap-5 mt-10">
            <div className="flex items-center gap-10 w-full">
              <h1 className="w-full">Change Bunking Threshold in Minutes</h1>
              <Input
                placeholder="Enter the threshold in minutes"
                value={threshold}
                type="number"
                className="border-black"
                onChange={(e) => {
                  const value = e.target.value.trim(); // Trim whitespace
                  let newValue = value === "" ? 0 : parseInt(value, 10); // If empty, set to 0; otherwise parse integer
                  newValue = newValue < 0 ? 0 : newValue; // Ensure threshold is not less than 0
                  setThreshold(newValue);
                }}
              />
            </div>
            <div className="flex flex-col items-center w-full gap-3">
              <h1 className="text-lg font-bold">Add a new student</h1>
              <Input
                placeholder="Student ID"
                value={stdID}
                onChange={(e) => setStdID(e.target.value)}
              />
              <Input
                placeholder="Student Name"
                value={stdName}
                onChange={(e) => setName(e.target.value)}
              />
              <SingleImageDropzone
                value={image}
                height={300}
                onChange={(file) => setImage(file)}
              />
              <Button
                variant={"default"}
                onClick={() => handleAddStudent()}
                className="w-full"
              >
                Add Student
              </Button>
            </div>
            <div className="flex flex-col items-center w-full gap-3">
              <h1 className="text-lg font-bold">Delete a Student</h1>
              <Input
                placeholder="Student ID"
                value={delStdID}
                onChange={(e) => setDelStdID(e.target.value)}
              />
              <Input
                placeholder="Student Name"
                value={
                  delStdName ??
                  "Enter the Student ID to search for the id to delete"
                }
                disabled
              />
              <div className="flex w-full items-center gap-3">
                <Button
                  className="w-full"
                  variant={"default"}
                  onClick={() => handleSearchClick()}
                >
                  Search
                </Button>
                <Button
                  className="w-full bg-red-950"
                  variant={"destructive"}
                  onClick={() => handleDelete()}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        {tab === "Notifications" && (
          <div className="flex flex-col items-center w-full gap-5 mt-10">
            {renderNotifications}
          </div>
        )}
        <div className="mt-5 w-full">
          <Button
            onClick={() => handleLogout()}
            className="w-full bg-red-900 tex-silver"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};
const generateRandomNotifications = (): JSX.Element[] => {
  const notifications: JSX.Element[] = [];
  const allStudents = getStudentRecordsFromLocal();

  for (let i = 0; i < 30; i++) {
    const randomStudentIndex = Math.floor(Math.random() * allStudents.length);
    const randomStudent = allStudents[randomStudentIndex];
    const _class = chooseRandomClass();
    const date = chooseRandomDate(randomStudent);

    if (date) {
      notifications.push(
        <div key={i} className="w-full">
          <div className="flex items-center justify-between gap-5 border-2 border-brownish rounded-lg px-5 py-3 w-full">
            <div className="flex items-center gap-5">
              <InfoCircledIcon className="w-5 h-5" />
              <p>
                Student with ID {randomStudent.studentID},{" "}
                {randomStudent.studentName} has bunked {_class} on {date}
              </p>
            </div>
            <Button
              variant={"outline"}
              className="bg-slate-800 text-white self-end"
              onClick={() => sendMail()}
            >
              Send Mail
            </Button>
          </div>
        </div>
      );
    }
  }

  return notifications;
};

export default Dashboard;
