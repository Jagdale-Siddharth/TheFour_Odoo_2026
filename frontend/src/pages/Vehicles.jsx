import React, { useEffect, useState } from 'react';
import { Plus, Search, Truck } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Field, inputCls, ErrorBanner } from '../components/Form';
import { useAuth } from '../context/AuthContext';

const EMPTY = { registration_number: '', name: '', type: '', max_load_capacity: '', odometer: '', acquisition_cost: '', status: 'Available', region: 'Central' };

export default function Vehicles() {
  const { user } = useAuth();
  const canEdit = user?.role === 'FleetManager';
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.type = typeFilter;
    const { data } = await api.get('/vehicles', { params });
    setVehicles(data);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search, statusFilter, typeFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setModalOpen(true); };
  const openEdit = (v) => { setEditing(v); setForm({ ...v }); setError(null); setModalOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await api.put(`/vehicles/${editing.id}`, form);
      } else {
        await api.post('/vehicles', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save vehicle');
    }
  };

  const retire = async (v) => {
    if (!confirm(`Retire vehicle ${v.registration_number}?`)) return;
    await api.delete(`/vehicles/${v.id}`);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">VEHICLE REGISTRY</h1>
          <p className="eyebrow mt-1">Master fleet asset list</p>
        </div>
        {canEdit && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
            <Plus size={16} /> Register vehicle
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search registration or name…"
            className="w-full bg-asphalt border border-steeledge rounded-md pl-9 pr-3 py-2 text-sm focus-ring"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
          <option value="">All statuses</option>
          {['Available', 'On Trip', 'In Shop', 'Retired'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Filter by type…"
          className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm w-40 focus-ring"
        />
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steeledge text-left">
              <th className="eyebrow font-normal px-4 py-3">Registration</th>
              <th className="eyebrow font-normal px-4 py-3">Name / Model</th>
              <th className="eyebrow font-normal px-4 py-3">Type</th>
              <th className="eyebrow font-normal px-4 py-3">Max Load</th>
              <th className="eyebrow font-normal px-4 py-3">Odometer</th>
              <th className="eyebrow font-normal px-4 py-3">Status</th>
              <th className="eyebrow font-normal px-4 py-3">Region</th>
              {canEdit && <th className="eyebrow font-normal px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-8 text-fog">Loading…</td></tr>
            ) : vehicles.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-fog">
                <Truck size={28} className="mx-auto mb-2 opacity-40" />
                No vehicles match these filters.
              </td></tr>
            ) : vehicles.map((v) => (
              <tr key={v.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                <td className="px-4 py-3 font-mono text-cargo">{v.registration_number}</td>
                <td className="px-4 py-3">{v.name}</td>
                <td className="px-4 py-3 text-fog">{v.type}</td>
                <td className="px-4 py-3 font-mono">{Number(v.max_load_capacity).toLocaleString()} kg</td>
                <td className="px-4 py-3 font-mono">{Number(v.odometer).toLocaleString()} km</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3 text-fog">{v.region}</td>
                {canEdit && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(v)} className="text-teal hover:underline mr-3 text-xs">Edit</button>
                    {v.status !== 'Retired' && (
                      <button onClick={() => retire(v)} className="text-alert hover:underline text-xs">Retire</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit vehicle' : 'Register vehicle'}>
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <Field label="Registration number">
            <input required disabled={!!editing} value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} className={inputCls} placeholder="MH-12-AB-1234" />
          </Field>
          <Field label="Name / Model">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Van-05" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} placeholder="Van / Truck" />
            </Field>
            <Field label="Max load capacity (kg)">
              <input required type="number" min="1" value={form.max_load_capacity} onChange={(e) => setForm({ ...form, max_load_capacity: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Odometer (km)">
              <input type="number" min="0" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Acquisition cost">
              <input type="number" min="0" value={form.acquisition_cost} onChange={(e) => setForm({ ...form, acquisition_cost: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                {['Available', 'On Trip', 'In Shop', 'Retired'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Region">
              <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">
            {editing ? 'Save changes' : 'Register vehicle'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
