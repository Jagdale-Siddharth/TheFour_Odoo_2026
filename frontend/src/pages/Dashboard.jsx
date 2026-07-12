import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle2, Wrench, Route, Clock, Users, Gauge } from 'lucide-react';
import api from '../api';

function KpiTile({ label, value, suffix, icon: Icon, accent = 'amber' }) {
  const colors = {
    amber: 'text-amber border-amber/20 bg-amber/5',
    teal: 'text-teal border-teal/20 bg-teal/5',
    fog: 'text-fog border-fog/20 bg-fog/5',
    alert: 'text-alert border-alert/20 bg-alert/5',
  };
  return (
    <div className={`panel p-4 flex flex-col justify-between border ${colors[accent]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow">{label}</span>
        <Icon size={16} className="opacity-70" />
      </div>
      <div className="digit text-3xl">
        {value}
        {suffix && <span className="text-lg text-fog ml-1">{suffix}</span>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [filters, setFilters] = useState({ types: [], regions: [] });
  const [selType, setSelType] = useState('');
  const [selRegion, setSelRegion] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (selType) params.type = selType;
    if (selRegion) params.region = selRegion;
    const { data } = await api.get('/dashboard/kpis', { params });
    setKpis(data);
    setLoading(false);
  };

  useEffect(() => {
    api.get('/dashboard/filters').then(({ data }) => setFilters(data));
  }, []);

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [selType, selRegion]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-cargo">DISPATCH BOARD</h1>
          <p className="eyebrow mt-1">Real-time fleet status overview</p>
        </div>
        <div className="flex gap-2">
          <select value={selType} onChange={(e) => setSelType(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
            <option value="">All vehicle types</option>
            {filters.types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={selRegion} onChange={(e) => setSelRegion(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
            <option value="">All regions</option>
            {filters.regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {loading || !kpis ? (
        <div className="text-fog text-sm">Loading dispatch board…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiTile label="Active Vehicles" value={kpis.activeVehicles} icon={Truck} accent="amber" />
            <KpiTile label="Available Vehicles" value={kpis.availableVehicles} icon={CheckCircle2} accent="teal" />
            <KpiTile label="In Maintenance" value={kpis.vehiclesInMaintenance} icon={Wrench} accent="fog" />
            <KpiTile label="Fleet Utilization" value={kpis.fleetUtilization} suffix="%" icon={Gauge} accent="amber" />
            <KpiTile label="Active Trips" value={kpis.activeTrips} icon={Route} accent="amber" />
            <KpiTile label="Pending Trips" value={kpis.pendingTrips} icon={Clock} accent="fog" />
            <KpiTile label="Drivers On Duty" value={kpis.driversOnDuty} icon={Users} accent="teal" />
            <KpiTile label="Drivers Available" value={kpis.driversAvailable} icon={Users} accent="teal" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="panel p-5">
              <p className="eyebrow mb-4">Trip pipeline</p>
              <div className="space-y-3">
                {[
                  { label: 'Pending (Draft)', value: kpis.pendingTrips, color: 'bg-fog' },
                  { label: 'Dispatched', value: kpis.activeTrips, color: 'bg-amber' },
                  { label: 'Completed', value: kpis.completedTrips, color: 'bg-teal' },
                  { label: 'Cancelled', value: kpis.cancelledTrips, color: 'bg-alert' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-sm text-fog w-32 flex-shrink-0">{row.label}</span>
                    <div className="flex-1 h-2 bg-steel rounded-full overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: `${Math.min(100, row.value * 8)}%` }} />
                    </div>
                    <span className="digit text-sm w-8 text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-5 md:col-span-2">
              <p className="eyebrow mb-4">Fleet composition</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Available', value: kpis.availableVehicles, color: 'text-teal' },
                  { label: 'On Trip', value: kpis.onTripVehicles, color: 'text-amber' },
                  { label: 'In Shop', value: kpis.vehiclesInMaintenance, color: 'text-fog' },
                  { label: 'Retired', value: kpis.retiredVehicles, color: 'text-alert' },
                ].map((row) => (
                  <div key={row.label} className="text-center py-4 rounded-md bg-steel/40 border border-steeledge">
                    <div className={`digit text-2xl ${row.color}`}>{row.value}</div>
                    <div className="eyebrow mt-1">{row.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-fog">
                Total fleet: <span className="text-cargo font-mono">{kpis.totalVehicles}</span> vehicles tracked
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
