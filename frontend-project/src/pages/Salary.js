import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Salary() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ EmployeeNumber: '', GrossSalary: '', TotalDeduction: '', Month: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [sRes, eRes] = await Promise.all([axios.get('/api/salary'), axios.get('/api/employees')]);
      setSalaries(sRes.data);
      setEmployees(eRes.data);
    } catch {}
  };

  const handleChange = e => {
    const updated = { ...form, [e.target.name]: e.target.value };
    // Auto-fill gross salary from employee's department
    if (e.target.name === 'EmployeeNumber') {
      const emp = employees.find(emp => emp.EmployeeNumber === parseInt(e.target.value));
      if (emp && emp.DeptGrossSalary) updated.GrossSalary = emp.DeptGrossSalary;
    }
    setForm(updated);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`/api/salary/${editId}`, form);
        setMessage({ type: 'success', text: 'Salary record updated!' });
      } else {
        await axios.post('/api/salary', form);
        setMessage({ type: 'success', text: 'Salary record added!' });
      }
      resetForm();
      fetchAll();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error saving record.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleEdit = (sal) => {
    setForm({ EmployeeNumber: sal.EmployeeNumber, GrossSalary: sal.GrossSalary, TotalDeduction: sal.TotalDeduction, Month: sal.Month });
    setEditId(sal.SalaryID);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this salary record?')) return;
    try {
      await axios.delete(`/api/salary/${id}`);
      setMessage({ type: 'success', text: 'Record deleted.' });
      fetchAll();
    } catch {
      setMessage({ type: 'error', text: 'Error deleting record.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const resetForm = () => {
    setForm({ EmployeeNumber: '', GrossSalary: '', TotalDeduction: '', Month: '' });
    setEditId(null);
    setShowForm(false);
  };

  const netSalary = form.GrossSalary && form.TotalDeduction
    ? (parseFloat(form.GrossSalary) - parseFloat(form.TotalDeduction)).toLocaleString()
    : '—';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Salary Records</h1>
          <p className="text-slate-400 text-sm mt-1">{salaries.length} records • Full CRUD enabled</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); if (editId) resetForm(); }} className="btn-primary">
          {showForm ? 'Close Form' : '+ Add Salary'}
        </button>
      </div>

      {message.text && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="card p-6">
          <h2 className="font-semibold text-white mb-5">{editId ? 'Edit Salary Record' : 'New Salary Record'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Employee</label>
              <select name="EmployeeNumber" className="input-field" value={form.EmployeeNumber} onChange={handleChange} required>
                <option value="">Select Employee</option>
                {employees.map(e => (
                  <option key={e.EmployeeNumber} value={e.EmployeeNumber}>{e.FirstName} {e.LastName} — {e.DepartmentName || 'N/A'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Month</label>
              <select name="Month" className="input-field" value={form.Month} onChange={handleChange} required>
                <option value="">Select Month</option>
                {MONTHS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Gross Salary (RWF)</label>
              <input type="number" name="GrossSalary" className="input-field" value={form.GrossSalary} onChange={handleChange} required min="0" />
            </div>
            <div>
              <label className="label">Total Deduction (RWF)</label>
              <input type="number" name="TotalDeduction" className="input-field" value={form.TotalDeduction} onChange={handleChange} required min="0" />
            </div>

            {form.GrossSalary && form.TotalDeduction && (
              <div className="sm:col-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <p className="text-slate-400 text-sm">Net Salary Preview:</p>
                <p className="text-emerald-400 text-2xl font-bold">{netSalary} RWF</p>
              </div>
            )}

            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : (editId ? 'Update Record' : 'Save Record')}</button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Employee</th>
                <th className="px-5 py-3 text-left">Month</th>
                <th className="px-5 py-3 text-right">Gross (RWF)</th>
                <th className="px-5 py-3 text-right">Deduction (RWF)</th>
                <th className="px-5 py-3 text-right">Net Salary (RWF)</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-slate-500">No salary records found.</td></tr>
              ) : salaries.map(sal => (
                <tr key={sal.SalaryID} className="table-row">
                  <td className="px-5 py-3 text-slate-500">{sal.SalaryID}</td>
                  <td className="px-5 py-3 text-white font-medium">{sal.FirstName} {sal.LastName}</td>
                  <td className="px-5 py-3"><span className="badge bg-sky-500/10 text-sky-400">{sal.Month}</span></td>
                  <td className="px-5 py-3 text-right text-slate-300">{Number(sal.GrossSalary).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-red-400">-{Number(sal.TotalDeduction).toLocaleString()}</td>
                  <td className="px-5 py-3 text-right font-semibold text-emerald-400">{Number(sal.NetSalary).toLocaleString()}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEdit(sal)} className="btn-warning text-xs px-3 py-1.5">Edit</button>
                      <button onClick={() => handleDelete(sal.SalaryID)} className="btn-danger text-xs px-3 py-1.5">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
