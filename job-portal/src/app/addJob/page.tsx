/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    companyName: '',
    role: '',
    type: 'Full Time',
    salaryRange: '',
    skillsRequired: '',
    description: '',
    status:'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized: No token found');
      return;
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      alert(data.message || 'Failed to add job');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Add New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div>
              <Label className='mb-1'>Company Name</Label>
              <Input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
                placeholder="Example Corp"
              />
            </div>

            {/* Role */}
            <div>
              <Label className='mb-1'>Role</Label>
              <Input
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <Label className='mb-1'>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value: any) => setForm({ ...form, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full time">Full Time</SelectItem>
                  <SelectItem value="part time">Part Time</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div>
              <Label className='mb-1'>Salary Range</Label>
              <Input
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                required
                placeholder="5-8 LPA"
              />
            </div>

            {/* Skills Required */}
            <div>
              <Label className='mb-1'>Skills Required (comma separated)</Label>
              <Input
                name="skillsRequired"
                value={form.skillsRequired}
                onChange={handleChange}
                required
                placeholder="React, Node, MongoDB"
              />
            </div>

            {/* Description */}
            <div>
              <Label className='mb-1'>Description</Label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Brief job description here..."
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Add Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
