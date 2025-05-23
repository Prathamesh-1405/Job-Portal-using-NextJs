/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';

interface Job {
  _id: string;
  companyName: string;
  role: string;
  type: string;
  salaryRange: string;
  skillsRequired: string[];
  description?: string;
  applicationStatus: 'pending' | 'selected' | 'rejected' | null;
}

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const res = await axios.get('/api/user/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data)

        // Filter jobs to only those where applicationStatus is not null
        const appliedJobs = res.data.jobs.filter((job: Job) => job.applicationStatus !== null);

        setJobs(appliedJobs);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && jobs.length === 0 && <p>You have not applied to any jobs yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <Card key={job._id}>
              <CardContent className="p-4 space-y-3">
                <h2 className="text-xl font-semibold">{job.role}</h2>
                <p className="text-sm text-gray-600">{job.companyName}</p>
                <p>Type: {job.type}</p>
                <p>Salary: {job.salaryRange}</p>
                <p>Skills: {job.skillsRequired.join(', ')}</p>
                <p>{job.description}</p>

                <div>
                  <strong>Status: </strong>
                  <span
                    className={
                      job.applicationStatus === 'pending'
                        ? 'text-yellow-600'
                        : job.applicationStatus === 'selected'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {job.applicationStatus?.toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
