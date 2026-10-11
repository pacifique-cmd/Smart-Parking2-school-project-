import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Reports() {
  const [report, setReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => { fetchReport(); }, [selectedMonth]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const params = selectedMonth ? `?month=${selectedMonth}` : '';
      const res = await axios.get(`/api/salary/report/monthly${params}`);
      setReport(res.data);
    } catch {}
    setLoading(false);
  };

  const handlePrint = () => window.print();

  const totals = report.reduce((acc, row) => ({
    gross: acc.gross + Number(row.GrossSalary),
    deduction: acc.deduction + Number(row.TotalDeduction),
    net: acc.net + Number(row.NetSalary),
  }), { gross: 0, deduction: 0, net: 0 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Payroll Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Monthly employee payroll summary</p>
        </div>
        <button onClick={handlePrint} className="btn-secondary no-print flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>

      {/* Filter */}
      <div className="card p-5 no-print">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="label">Filter by Month</label>
            <select className="input-field" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <option value="">All Months</option>
              {MONTHS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <button onClick={fetchReport} className="btn-primary">Refresh</button>
        </div>
      </div>

      {/* Report */}
      <div ref={printRef} className="card overflow-hidden">
        {/* Print header */}
        <div className="p-6 border-b border-slate-800">
          <div className="text-center">
            <h2 className="font-display text-xl font-bold text-white">SmartPark — Monthly Payroll Report</h2>
            <p className="text-slate-400 text-sm">Rubavu District, Western Province, Rwanda</p>
            <p className="text-sky-400 text-sm mt-1 font-medium">
              {selectedMonth ? `Month: ${selectedMonth}` : 'All Months'} • Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading report...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="px-5 py-3 text-left">No.</th>
                    <th className="px-5 py-3 text-left">First Name</th>
                    <th className="px-5 py-3 text-left">Last Name</th>
                    <th className="px-5 py-3 text-left">Position</th>
                    <th className="px-5 py-3 text-left">Department</th>
                    <th className="px-5 py-3 text-left">Month</th>
                    <th className="px-5 py-3 text-right">Gross (RWF)</th>
                    <th className="px-5 py-3 text-right">Deduction (RWF)</th>
                    <th className="px-5 py-3 text-right">Net Salary (RWF)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-10 text-slate-500">No payroll data for the selected period.</td></tr>
                  ) : report.map((row, i) => (
                    <tr key={row.SalaryID} className="table-row">
                      <td className="px-5 py-3 text-slate-500">{i + 1}</td>
                      <td className="px-5 py-3 text-white">{row.FirstName}</td>
                      <td className="px-5 py-3 text-white">{row.LastName}</td>
                      <td className="px-5 py-3 text-slate-300">{row.Position}</td>
                      <td className="px-5 py-3 text-slate-400">{row.DepartmentName || '—'}</td>
                      <td className="px-5 py-3"><span className="badge bg-sky-500/10 text-sky-400">{row.Month}</span></td>
                      <td className="px-5 py-3 text-right text-slate-300">{Number(row.GrossSalary).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-red-400">{Number(row.TotalDeduction).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-400">{Number(row.NetSalary).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                {report.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-800/60 border-t border-slate-700">
                      <td colSpan={6} className="px-5 py-3 text-white font-semibold">TOTALS ({report.length} employees)</td>
                      <td className="px-5 py-3 text-right text-slate-300 font-semibold">{totals.gross.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-red-400 font-semibold">{totals.deduction.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right text-emerald-400 font-bold text-base">{totals.net.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Summary cards */}
            {report.length > 0 && (
              <div className="p-5 border-t border-slate-800 grid grid-cols-3 gap-4 no-print">
                {[
                  { label: 'Total Gross', value: totals.gross, color: 'text-slate-300' },
                  { label: 'Total Deductions', value: totals.deduction, color: 'text-red-400' },
                  { label: 'Total Net Payroll', value: totals.net, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-slate-500 text-xs">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value.toLocaleString()} RWF</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
