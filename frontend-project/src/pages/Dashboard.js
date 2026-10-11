import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, salaries: 0 });
  const [recentEmployees, setRecentEmployees] = useState([]);

  useEffect(() => {
    Promise.all([
      axios.get('/api/employees'),
      axios.get('/api/departments'),
      axios.get('/api/salary'),
    ]).then(([empRes, deptRes, salRes]) => {
      setStats({
        employees: empRes.data.length,
        departments: deptRes.data.length,
        salaries: salRes.data.length,
      });
      setRecentEmployees(empRes.data.slice(0, 5));
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Employees', value: stats.employees, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20', icon: '👥' },
    { label: 'Departments', value: stats.departments, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: '🏢' },
    { label: 'Salary Records', value: stats.salaries, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome to SmartPark EPMS — Rubavu District, Rwanda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`card p-5 border ${card.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{card.label}</p>
                <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Add Employee', path: '/employees', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400 hover:bg-sky-500/20' },
            { label: 'Add Department', path: '/departments', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' },
            { label: 'Add Salary', path: '/salary', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' },
            { label: 'View Reports', path: '/reports', color: 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20' },
          ].map(item => (
            <Link key={item.path} to={item.path} className={`border rounded-xl p-4 text-center font-medium text-sm transition-colors ${item.color}`}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent employees */}
      {recentEmployees.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <h2 className="font-semibold text-white">Recent Employees</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Position</th>
                  <th className="px-5 py-3 text-left">Department</th>
                  <th className="px-5 py-3 text-left">Gender</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map(emp => (
                  <tr key={emp.EmployeeNumber} className="table-row">
                    <td className="px-5 py-3 text-white font-medium">{emp.FirstName} {emp.LastName}</td>
                    <td className="px-5 py-3 text-slate-300">{emp.Position}</td>
                    <td className="px-5 py-3 text-slate-400">{emp.DepartmentName || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${emp.Gender === 'Male' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                        {emp.Gender}
                      </span>
                    </td>
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
