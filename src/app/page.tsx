"use client";

import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-silver w-screen flex flex-col items-center p-10 h-screen">
      <h1 className="text-5xl text-black font-bold">ATTENDANCE MANAGER</h1>
      <div className="flex items-start flex-col justify-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-3xl font-bold text-black mb-5">Mark Attendance</h2>
        <div className="flex flex-col items-center justify-between gap-2 mb-5">
          <div className="text-xl text-bold text-black flex items-center gap-2 w-full">
            <InfoCircledIcon className="w-5 h-5" />
            <p>Instructions</p>
          </div>
          <p className="text-md text-brownish">
            This is for the students who are registered in the system. <br />
            For coming into the first time press the Initial Attendance button
            to mark the attendance after the facial recognition. <br />
            For temporary leave from the class press the Temporary Pass button.{" "}
            <br />
            After returning from the leave press the Check In button to mark the
            attendance. <br />
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 w-full">
          <Button variant={"outline"} className="w-full">
            Initial Attendance
          </Button>
          <Button variant={"outline"} className="ml-5 w-full">
            Temporary Pass
          </Button>
          <Button variant={"outline"} className="ml-5 w-full">
            Check In
          </Button>
        </div>
        <Link href={"/login"} className="w-full">
          <Button className="w-full mt-5" variant={"default"}>
            Admin Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
