import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const fetchOrders = async (p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(p));
      params.set('limit', '20');
      if (status) params.set('status', status);
      if (paymentStatus) params.set('paymentStatus', paymentStatus);
      const res = await axios.get(`/api/orders/admin?${params.toString()}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status, paymentStatus]);

  const updateStatus = async (id, newStatus) => {
    await axios.put(`/api/orders/${id}/status`, { orderStatus: newStatus });
    await fetchOrders();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Admin Orders</h1>

      <div className="mb-3 flex gap-2 items-center">
        <select className="border p-2" value={status} onChange={e=>{setStatus(e.target.value); setPage(1);}}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="border p-2" value={paymentStatus} onChange={e=>{setPaymentStatus(e.target.value); setPage(1);}}>
          <option value="">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Order #</th>
              <th className="p-2">User</th>
              <th className="p-2">Total</th>
              <th className="p-2">Payment</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-2">Loading...</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o._id} className="border-b">
                  <td className="p-2">{o.orderNumber}</td>
                  <td className="p-2">{o.user?.name || '—'}</td>
                  <td className="p-2">{o.total} {o.currency}</td>
                  <td className="p-2">{o.paymentStatus}</td>
                  <td className="p-2">{o.orderStatus}</td>
                  <td className="p-2">
                    <select className="border p-1" value={o.orderStatus} onChange={e=>updateStatus(o._id, e.target.value)}>
                      {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s=> (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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

export default AdminOrders;

