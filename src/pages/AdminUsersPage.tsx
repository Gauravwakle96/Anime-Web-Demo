import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';

interface Profile {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export default function AdminUsersPage() {
  const { user, isLoading } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    // In a real app, this would be a secure admin-only function.
    // For demo purposes, we fetch all users if configured.
    const fetchUsers = async () => {
      // Supabase auth.admin is only available on server-side.
      // So you'd typically have a 'profiles' table that syncs with auth.
      const { data } = await client.from('profiles').select('*');
      if (data) setUsers(data as Profile[]);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (isLoading) return null;

  // Simple admin check - replace with real role check
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!supabase) {
    return (
      <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Backend Not Configured</h2>
        <p className="text-muted-foreground mt-2 text-center max-w-md">
          To view logged in users, you must configure your Supabase URL and Key in the `.env` file, and create a `profiles` table.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-display font-bold">Registered Users</h1>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No users found. Ensure your &apos;profiles&apos; table is set up.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-sm text-muted-foreground">
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Created At</th>
                <th className="px-6 py-4 font-medium">Last Sign In</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
