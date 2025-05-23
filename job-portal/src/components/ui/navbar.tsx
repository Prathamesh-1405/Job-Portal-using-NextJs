'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role: string;
  exp: number;
  iat: number;
}

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
const router = useRouter();

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      console.log('Token:', token);
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Decoded role:', decoded.role);
      setRole(decoded.role);
    } catch (err) {
      console.error('Invalid token:', err);
      setRole(null);
    }
  } else {
    setRole(null);
  }
}, []);

useEffect(() => {
  if (role) {
    console.log(`Updated role: ${role}`);
  }
}, [role]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div>
        <Link href="/" className="text-xl font-bold">Job Portal</Link>
      </div>

      <div className="space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost">Jobs</Button>
        </Link>

        {role === 'admin' && (
          <Link href="/addJob">
            <Button variant="ghost">Add Job</Button>
          </Link>
        )}

        {role === 'jobSeeker' && (
          <Link href="/applications">
            <Button variant="ghost">Applications</Button>
          </Link>
        )}

        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>
    </nav>
  );
}
