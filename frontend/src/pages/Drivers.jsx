import React, { useEffect, useState } from 'react';
import { Plus, Search, Users, ShieldAlert } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Field, inputCls, ErrorBanner } from '../components/Form';
import { useAuth } from '../context/AuthContext';

const EMPTY = { name: '', license_number: '', license_category: '', license_expiry_date: '', contact_number: '', safety_score: 100, status: 'Available', region: 'Central' };

function isExpiringSoon(dateStr) {
  const days = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return days < 30;
}
function isExpired(dateStr) {
  return new Date(dateStr) < new Date();
}

export default function Drivers() {
  const { user } = useAuth();
  const canEdit = user?.role === 'FleetManager' || user?.role === 'SafetyOfficer';
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
    const { data } = await api.get('/drivers', { params });
    setDrivers(data);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [search, statusFilter]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(null); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setForm({ ...d, license_expiry_date: d.license_expiry_date?.slice(0, 10) }); setError(null); setModalOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing) {
        await api.put(`/drivers/${editing.id}`, form);
      } else {
        await api.post('/drivers', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save driver');
    }
  };

  const suspend = async (d) => {
    if (!confirm(`Suspend driver ${d.name}?`)) return;
    await api.delete(`/drivers/${d.id}`);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">DRIVER MANAGEMENT</h1>
          <p className="eyebrow mt-1">Compliance, licensing & safety scores</p>
        </div>
        {canEdit && (
          <button onClick={openCreate} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
            <Plus size={16} /> Add driver
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-fog" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or license…" className="w-full bg-asphalt border border-steeledge rounded-md pl-9 pr-3 py-2 text-sm focus-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
          <option value="">All statuses</option>
          {['Available', 'On Trip', 'Off Duty', 'Suspended'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steeledge text-left">
              <th className="eyebrow font-normal px-4 py-3">Name</th>
              <th className="eyebrow font-normal px-4 py-3">License #</th>
              <th className="eyebrow font-normal px-4 py-3">Category</th>
              <th className="eyebrow font-normal px-4 py-3">Expiry</th>
              <th className="eyebrow font-normal px-4 py-3">Safety Score</th>
              <th className="eyebrow font-normal px-4 py-3">Status</th>
              {canEdit && <th className="eyebrow font-normal px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-fog">Loading…</td></tr>
            ) : drivers.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-fog"><Users size={28} className="mx-auto mb-2 opacity-40" />No drivers match these filters.</td></tr>
            ) : drivers.map((d) => (
              <tr key={d.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                <td className="px-4 py-3">{d.name}</td>
                <td className="px-4 py-3 font-mono">{d.license_number}</td>
                <td className="px-4 py-3 text-fog">{d.license_category}</td>
                <td className={`px-4 py-3 font-mono ${isExpired(d.license_expiry_date) ? 'text-alert' : isExpiringSoon(d.license_expiry_date) ? 'text-amber' : ''}`}>
                  <div className="flex items-center gap-1.5">
                    {(isExpired(d.license_expiry_date) || isExpiringSoon(d.license_expiry_date)) && <ShieldAlert size={13} />}
                    {new Date(d.license_expiry_date).toLocaleDateString('en-IN')}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono">{Number(d.safety_score).toFixed(1)}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                {canEdit && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(d)} className="text-teal hover:underline mr-3 text-xs">Edit</button>
                    {d.status !== 'Suspended' && (
                      <button onClick={() => suspend(d)} className="text-alert hover:underline text-xs">Suspend</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit driver' : 'Add driver'}>
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <Field label="Full name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="License number">
              <input required disabled={!!editing} value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} className={inputCls} />
            </Field>
            <Field label="License category">
              <input required value={form.license_category} onChange={(e) => setForm({ ...form, license_category: e.target.value })} className={inputCls} placeholder="LMV / HMV" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="License expiry date">
              <input required type="date" value={form.license_expiry_date} onChange={(e) => setForm({ ...form, license_expiry_date: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Contact number">
              <input value={form.contact_number || ''} onChange={(e) => setForm({ ...form, contact_number: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Safety score">
              <input type="number" min="0" max="100" step="0.1" value={form.safety_score} onChange={(e) => setForm({ ...form, safety_score: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputCls}>
                {['Available', 'On Trip', 'Off Duty', 'Suspended'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Region">
            <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputCls} />
          </Field>
          <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">
            {editing ? 'Save changes' : 'Add driver'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
