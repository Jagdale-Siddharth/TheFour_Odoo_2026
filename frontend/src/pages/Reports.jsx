import React, { useEffect, useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import api from '../api';

export default function Reports() {
  const [analytics, setAnalytics] = useState([]);
  const [summary, setSummary] = useState({ monthlyFuel: [], monthlyMaint: [], monthlyTrips: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [a, s] = await Promise.all([
        api.get('/reports/vehicle-analytics'),
        api.get('/reports/fleet-summary'),
      ]);
      setAnalytics(a.data);
      setSummary(s.data);
      setLoading(false);
    })();
  }, []);

  const exportCsv = () => {
    window.open('/api/reports/export/csv', '_blank');
  };

  const chartData = analytics.map((v) => ({
    name: v.name,
    operationalCost: v.operationalCost,
    revenue: v.revenue,
    roi: v.roi,
  }));

  const trendData = summary.monthlyTrips.map((t) => {
    const fuel = summary.monthlyFuel.find((f) => f.month === t.month);
    const maint = summary.monthlyMaint.find((m) => m.month === t.month);
    return {
      month: t.month,
      revenue: Number(t.revenue) || 0,
      fuelCost: Number(fuel?.fuel_cost) || 0,
      maintCost: Number(maint?.maint_cost) || 0,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">REPORTS & ANALYTICS</h1>
          <p className="eyebrow mt-1">Fuel efficiency · Utilization · Operational cost · ROI</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-fog text-sm">Crunching the numbers…</div>
      ) : (
        <>
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="panel p-5">
              <p className="eyebrow mb-4">Operational cost vs revenue by vehicle</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#323C47" />
                  <XAxis dataKey="name" stroke="#8B96A3" fontSize={11} />
                  <YAxis stroke="#8B96A3" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#1B2127', border: '1px solid #323C47', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="operationalCost" name="Operational Cost" fill="#F5A623" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="panel p-5">
              <p className="eyebrow mb-4">Monthly cost trend</p>
              {trendData.length === 0 ? (
                <div className="h-[260px] flex items-center justify-center text-fog text-sm">
                  <BarChart3 size={24} className="mr-2 opacity-40" /> Not enough data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#323C47" />
                    <XAxis dataKey="month" stroke="#8B96A3" fontSize={11} />
                    <YAxis stroke="#8B96A3" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#1B2127', border: '1px solid #323C47', borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#2DD4BF" strokeWidth={2} />
                    <Line type="monotone" dataKey="fuelCost" stroke="#F5A623" strokeWidth={2} />
                    <Line type="monotone" dataKey="maintCost" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="panel overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-steeledge text-left">
                  <th className="eyebrow font-normal px-4 py-3">Vehicle</th>
                  <th className="eyebrow font-normal px-4 py-3">Trips</th>
                  <th className="eyebrow font-normal px-4 py-3">Distance</th>
                  <th className="eyebrow font-normal px-4 py-3">Fuel Efficiency</th>
                  <th className="eyebrow font-normal px-4 py-3">Operational Cost</th>
                  <th className="eyebrow font-normal px-4 py-3">Revenue</th>
                  <th className="eyebrow font-normal px-4 py-3">ROI</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((v) => (
                  <tr key={v.vehicle_id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                    <td className="px-4 py-3 font-mono">{v.registration_number} <span className="text-fog font-body">({v.name})</span></td>
                    <td className="px-4 py-3 font-mono">{v.trip_count}</td>
                    <td className="px-4 py-3 font-mono">{v.distance.toLocaleString()} km</td>
                    <td className="px-4 py-3 font-mono">{v.fuelEfficiency !== null ? `${v.fuelEfficiency} km/L` : '—'}</td>
                    <td className="px-4 py-3 font-mono">₹{v.operationalCost.toLocaleString()}</td>
                    <td className="px-4 py-3 font-mono">₹{v.revenue.toLocaleString()}</td>
                    <td className={`px-4 py-3 font-mono ${v.roi !== null && v.roi < 0 ? 'text-alert' : 'text-teal'}`}>
                      {v.roi !== null ? `${v.roi}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
