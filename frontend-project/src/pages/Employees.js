import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    FirstName: '', LastName: '', Position: '', Address: '',
    Telephone: '', Gender: '', HiredDate: '', DepartmentCode: ''
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [eRes, dRes] = await Promise.all([axios.get('/api/employees'), axios.get('/api/departments')]);
      setEmployees(eRes.data);
      setDepartments(dRes.data);
    } catch {}
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/employees', form);
      setMessage({ type: 'success', text: 'Employee added successfully!' });
      setForm({ FirstName: '', LastName: '', Position: '', Address: '', Telephone: '', Gender: '', HiredDate: '', DepartmentCode: '' });
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving employee.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Employees</h1>
          <p className="text-slate-400 text-sm mt-1">{employees.length} total employees</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Close Form' : '+ Add Employee'}
        </button>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Add Employee Form */}
      {showForm && (
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">New Employee Record</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'FirstName', label: 'First Name', type: 'text' },
              { name: 'LastName', label: 'Last Name', type: 'text' },
              { name: 'Position', label: 'Position', type: 'text' },
              { name: 'Address', label: 'Address', type: 'text' },
              { name: 'Telephone', label: 'Telephone', type: 'tel' },
              { name: 'HiredDate', label: 'Hired Date', type: 'date' },
            ].map(field => (
              <div key={field.name}>
                <label className="label">{field.label}</label>
                <input type={field.type} name={field.name} className="input-field" value={form[field.name]} onChange={handleChange} required />
              </div>
            ))}

            <div>
              <label className="label">Gender</label>
              <select name="Gender" className="input-field" value={form.Gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="label">Department</label>
              <select name="DepartmentCode" className="input-field" value={form.DepartmentCode} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.DepartmentCode} value={d.DepartmentCode}>{d.DepartmentName}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Employees Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Position</th>
                <th className="px-5 py-3 text-left">Department</th>
                <th className="px-5 py-3 text-left">Telephone</th>
                <th className="px-5 py-3 text-left">Gender</th>
                <th className="px-5 py-3 text-left">Hired Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-500">No employees found. Add your first employee above.</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.EmployeeNumber} className="table-row">
                  <td className="px-5 py-3 text-slate-500">{emp.EmployeeNumber}</td>
                  <td className="px-5 py-3 text-white font-medium">{emp.FirstName} {emp.LastName}</td>
                  <td className="px-5 py-3 text-slate-300">{emp.Position}</td>
                  <td className="px-5 py-3 text-slate-400">{emp.DepartmentName || '—'}</td>
                  <td className="px-5 py-3 text-slate-400">{emp.Telephone}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${emp.Gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>{emp.Gender}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{new Date(emp.HiredDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
