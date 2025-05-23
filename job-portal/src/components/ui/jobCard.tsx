"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, Coins } from "lucide-react";
import Link from "next/link";

import { IJob } from "@/models/Job";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

interface JobCardProps {
  job: IJob;
  role: string | null;
  onApply: (jobId: string) => void;
}

export default function JobCard({ job, role, onApply }: JobCardProps) {


  return (
    <Card className="hover:shadow-lg transition duration-300 border rounded-2xl">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Briefcase className="text-blue-600" />
          <h2 className="text-lg font-bold">{job.role}</h2>
        </div>

        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Building size={16} /> {job.companyName}
        </p>

        <p className="text-sm text-gray-700">
          <span className="font-medium">Type:</span> {job.type}
        </p>

        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Coins size={16} /> {job.salaryRange}
        </p>

        <p className="text-sm">
          <span className="font-medium">Skills:</span>{" "}
          {Array.isArray(job.skillsRequired)
            ? job.skillsRequired.join(", ")
            : "N/A"}
        </p>

        <p className="text-sm text-gray-600">{job.description}</p>

        <div className="flex gap-3 mt-4">
          {role === "admin" ? (
            <>
            <Link href={`/applications/admin?jobId=${job._id}`}>
            <Button variant="secondary" className="w-half">
              Applications
            </Button>
            </Link>
            <Button variant="secondary" className="w-half">
             Edit
            </Button>
            </>
          ) : role === "jobSeeker" ? (
            <Button onClick={() => onApply(job._id)}>Apply</Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
