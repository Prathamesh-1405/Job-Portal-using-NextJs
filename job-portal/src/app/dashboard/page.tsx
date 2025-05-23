/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import axios from 'axios';
import router from 'next/router';
import Navbar from '@/components/ui/navbar';
// import { Coins, Briefcase, Building } from 'lucide-react';

import { IJob } from '@/models/Job';
import JobCard from '@/components/ui/jobCard';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/');
          return;
        }
        const response = await axios.get('/api/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs);
        setRole(response.data.role);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded: any = jwtDecode(token);

    await axios.post(
      "/api/applications",
      {
        userId: decoded.userId,
        jobId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // remove job from local list
    setJobs(jobs.filter((job) => job._id !== jobId));
  };

  return (
    <>
    <Navbar/>
    <div className="p-6 space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {jobs.map((job) => (
      <JobCard key={job._id} job={job} role={role} onApply={handleApply}/>
    ))}
  </div>
    </div>
    </>
  );
}
