import React, { useEffect, useState } from 'react';
import { Plus, Wrench } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Field, inputCls, ErrorBanner } from '../components/Form';

const EMPTY = { vehicle_id: '', service_type: '', description: '', cost: '' };

export default function Maintenance() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [closeModal, setCloseModal] = useState(null);
  const [finalCost, setFinalCost] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    const { data } = await api.get('/maintenance', { params });
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const openCreate = async () => {
    setForm(EMPTY);
    setError(null);
    const { data } = await api.get('/vehicles', { params: { status: undefined } });
    setVehicles(data.filter((v) => v.status !== 'On Trip' && v.status !== 'Retired'));
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/maintenance', form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create maintenance record');
    }
  };

  const submitClose = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/maintenance/${closeModal.id}/close`, { final_cost: finalCost || undefined });
      setCloseModal(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to close maintenance record');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">MAINTENANCE</h1>
          <p className="eyebrow mt-1">Vehicle service history & shop status</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
          <Plus size={16} /> New maintenance record
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
          <option value="">All statuses</option>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steeledge text-left">
              <th className="eyebrow font-normal px-4 py-3">Vehicle</th>
              <th className="eyebrow font-normal px-4 py-3">Service</th>
              <th className="eyebrow font-normal px-4 py-3">Description</th>
              <th className="eyebrow font-normal px-4 py-3">Cost</th>
              <th className="eyebrow font-normal px-4 py-3">Status</th>
              <th className="eyebrow font-normal px-4 py-3">Started</th>
              <th className="eyebrow font-normal px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-fog">Loading…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-fog"><Wrench size={28} className="mx-auto mb-2 opacity-40" />No maintenance records yet.</td></tr>
            ) : logs.map((m) => (
              <tr key={m.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                <td className="px-4 py-3 font-mono">{m.registration_number}</td>
                <td className="px-4 py-3">{m.service_type}</td>
                <td className="px-4 py-3 text-fog max-w-xs truncate">{m.description || '—'}</td>
                <td className="px-4 py-3 font-mono">₹{Number(m.cost).toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3 text-fog">{new Date(m.started_at).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-right">
                  {m.status === 'Open' && (
                    <button onClick={() => { setCloseModal(m); setFinalCost(m.cost); }} className="text-teal hover:underline text-xs">Close & release vehicle</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New maintenance record">
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <Field label="Vehicle">
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} className={inputCls}>
              <option value="">Select a vehicle…</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registration_number} — {v.name} ({v.status})</option>
              ))}
            </select>
          </Field>
          <Field label="Service type">
            <input required value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} className={inputCls} placeholder="Oil Change, Engine Overhaul…" />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} rows={3} />
          </Field>
          <Field label="Estimated cost">
            <input type="number" min="0" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className={inputCls} />
          </Field>
          <p className="text-xs text-fog">Creating this record automatically sets the vehicle status to "In Shop" and removes it from dispatch.</p>
          <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">
            Create record
          </button>
        </form>
      </Modal>

      <Modal open={!!closeModal} onClose={() => setCloseModal(null)} title="Close maintenance record">
        {closeModal && (
          <form onSubmit={submitClose} className="space-y-4">
            <p className="text-sm text-fog">{closeModal.registration_number} — {closeModal.service_type}</p>
            <Field label="Final cost">
              <input type="number" min="0" value={finalCost} onChange={(e) => setFinalCost(e.target.value)} className={inputCls} />
            </Field>
            <p className="text-xs text-fog">Closing restores the vehicle to Available (unless it's marked Retired).</p>
            <button type="submit" className="w-full bg-teal text-ink font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity focus-ring">
              Close & release vehicle
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
