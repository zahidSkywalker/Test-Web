import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [verified, setVerified] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async (p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', '20');
      if (role) params.set('role', role);
      if (verified) params.set('verified', verified);
      if (search) params.set('search', search);
      const res = await axios.get(`/api/users/admin?${params.toString()}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role, verified]);

  const verifyUser = async (id) => {
    await axios.put(`/api/users/${id}/verify`);
    await fetchUsers();
  };

  const updateRole = async (id, newRole) => {
    await axios.put(`/api/users/${id}/role`, { role: newRole });
    await fetchUsers();
  };

  const deleteUser = async (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (!window.confirm('Delete this user? (blocked if user has orders)')) return;
    await axios.delete(`/api/users/${id}`);
    await fetchUsers();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Admin Users</h1>

      <div className="mb-3 flex gap-2 items-center">
        <input className="border p-2" placeholder="Search name or email" value={search} onChange={e=>setSearch(e.target.value)} />
        <button className="border px-3" onClick={()=>{setPage(1); fetchUsers(1);}}>Search</button>
        <select className="border p-2" value={role} onChange={e=>{setRole(e.target.value); setPage(1);}}>
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select className="border p-2" value={verified} onChange={e=>{setVerified(e.target.value); setPage(1);}}>
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-2">Loading...</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <select className="border p-1" value={u.role} onChange={e=>updateRole(u._id, e.target.value)}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-2">{u.isVerified ? 'Yes' : 'No'}</td>
                  <td className="p-2 flex gap-2">
                    {!u.isVerified && (
                      <button className="border px-2" onClick={()=>verifyUser(u._id)}>Verify</button>
                    )}
                    <button className="text-red-600" onClick={()=>deleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button className="border px-2" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="border px-2" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
};

export default AdminUsers;

