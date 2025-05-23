'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import { Card, CardContent } from '@/components/ui/card';

interface Application {
  _id: string;
  status: 'pending' | 'selected' | 'rejected';
  userDetails: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function JobApplicationsPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    console.log(jobId)
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      console.log( `job....Id=>${jobId}`)
      const res = await axios.get(`/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);
    };

    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (applicationId: string, newStatus: 'selected' | 'rejected') => {
    const token = localStorage.getItem('token');
    await axios.put(
      `/api/applications/${applicationId}`,
      { status: newStatus },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setApplications(prev =>
      prev.map(app =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="p-6 space-y-4">
        <h1 className="text-3xl font-bold">Applications for this Job</h1>

        {applications.map(app => (
          <Card key={app._id}>
            <CardContent className="p-4 space-y-2">
              <p><strong>Name:</strong> {app.userDetails.name}</p>
              <p><strong>Email:</strong> {app.userDetails.email}</p>
              <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {app.status}</p>

              <div className="flex gap-2">
                <Button
                  variant={app.status === 'selected' ? 'default' : 'secondary'}
                  onClick={() => handleStatusChange(app._id, 'selected')}
                >
                  Select
                </Button>
                <Button
                  variant={app.status === 'rejected' ? 'default' : 'destructive'}
                  onClick={() => handleStatusChange(app._id, 'rejected')}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
