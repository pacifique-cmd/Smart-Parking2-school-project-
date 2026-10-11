import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ DepartmentCode: '', DepartmentName: '', GrossSalary: '' });

  useEffect(() => { fetchDepts(); }, []);

  const fetchDepts = async () => {
    try {
      const res = await axios.get('/api/departments');
      setDepartments(res.data);
    } catch {}
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/departments', form);
      setMessage({ type: 'success', text: 'Department added successfully!' });
      setForm({ DepartmentCode: '', DepartmentName: '', GrossSalary: '' });
      setShowForm(false);
      fetchDepts();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving department.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Departments</h1>
          <p className="text-slate-400 text-sm mt-1">{departments.length} departments configured</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Close Form' : '+ Add Department'}
        </button>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">New Department</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Department Code</label>
              <input type="text" name="DepartmentCode" className="input-field" placeholder="e.g. IT" value={form.DepartmentCode} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Department Name</label>
              <input type="text" name="DepartmentName" className="input-field" placeholder="e.g. Information Technology" value={form.DepartmentName} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Gross Salary (RWF)</label>
              <input type="number" name="GrossSalary" className="input-field" placeholder="e.g. 300000" value={form.GrossSalary} onChange={handleChange} required min="0" />
            </div>
            <div className="sm:col-span-3 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Department'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map(dept => (
          <div key={dept.DepartmentCode} className="card p-5 border border-slate-800 hover:border-sky-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="badge bg-sky-500/10 text-sky-400 text-xs font-bold">{dept.DepartmentCode}</span>
            </div>
            <h3 className="text-white font-semibold">{dept.DepartmentName}</h3>
            <p className="text-emerald-400 font-bold mt-2 text-lg">
              {Number(dept.GrossSalary).toLocaleString()} <span className="text-xs text-slate-500 font-normal">RWF/mo</span>
            </p>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="sm:col-span-4 card p-10 text-center text-slate-500">No departments found.</div>
        )}
      </div>

      {/* Table view */}
      {departments.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Code</th>
                  <th className="px-5 py-3 text-left">Department Name</th>
                  <th className="px-5 py-3 text-left">Gross Salary (RWF)</th>
                </tr>
              </thead>
              <tbody>
                {departments.map(dept => (
                  <tr key={dept.DepartmentCode} className="table-row">
                    <td className="px-5 py-3"><span className="badge bg-slate-700 text-slate-300">{dept.DepartmentCode}</span></td>
                    <td className="px-5 py-3 text-white">{dept.DepartmentName}</td>
                    <td className="px-5 py-3 text-emerald-400 font-medium">{Number(dept.GrossSalary).toLocaleString()} RWF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
