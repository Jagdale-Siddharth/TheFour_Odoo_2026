import React, { useEffect, useState } from 'react';
import { Plus, Route, Check, X as XIcon, Play } from 'lucide-react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { Field, inputCls, ErrorBanner } from '../components/Form';

const EMPTY = { source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight: '', planned_distance: '' };

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [completeModal, setCompleteModal] = useState(null);
  const [completeForm, setCompleteForm] = useState({ actual_distance: '', fuel_consumed: '', fuel_cost: '', final_odometer: '', revenue: '' });
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [completeError, setCompleteError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    const { data } = await api.get('/trips', { params });
    setTrips(data);
    setLoading(false);
  };

  const loadPools = async () => {
    const [v, d] = await Promise.all([api.get('/vehicles/available'), api.get('/drivers/available')]);
    setAvailableVehicles(v.data);
    setAvailableDrivers(d.data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const openCreate = () => { setForm(EMPTY); setError(null); loadPools(); setModalOpen(true); };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/trips', form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
    }
  };

  const dispatch = async (t) => {
    try {
      await api.post(`/trips/${t.id}/dispatch`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to dispatch trip');
    }
  };

  const cancel = async (t) => {
    if (!confirm('Cancel this trip?')) return;
    try {
      await api.post(`/trips/${t.id}/cancel`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel trip');
    }
  };

  const openComplete = (t) => {
    setCompleteModal(t);
    setCompleteForm({ actual_distance: t.planned_distance, fuel_consumed: '', fuel_cost: '', final_odometer: '', revenue: '' });
    setCompleteError(null);
  };

  const submitComplete = async (e) => {
    e.preventDefault();
    setCompleteError(null);
    try {
      await api.post(`/trips/${completeModal.id}/complete`, completeForm);
      setCompleteModal(null);
      load();
    } catch (err) {
      setCompleteError(err.response?.data?.error || 'Failed to complete trip');
    }
  };

  const selectedVehicle = availableVehicles.find((v) => String(v.id) === String(form.vehicle_id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">TRIPS & DISPATCH</h1>
          <p className="eyebrow mt-1">Draft → Dispatched → Completed / Cancelled</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
          <Plus size={16} /> New trip
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-asphalt border border-steeledge rounded-md px-3 py-2 text-sm focus-ring">
          <option value="">All statuses</option>
          {['Draft', 'Dispatched', 'Completed', 'Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-steeledge text-left">
              <th className="eyebrow font-normal px-4 py-3">Route</th>
              <th className="eyebrow font-normal px-4 py-3">Vehicle</th>
              <th className="eyebrow font-normal px-4 py-3">Driver</th>
              <th className="eyebrow font-normal px-4 py-3">Cargo</th>
              <th className="eyebrow font-normal px-4 py-3">Distance</th>
              <th className="eyebrow font-normal px-4 py-3">Status</th>
              <th className="eyebrow font-normal px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-fog">Loading…</td></tr>
            ) : trips.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-fog"><Route size={28} className="mx-auto mb-2 opacity-40" />No trips yet.</td></tr>
            ) : trips.map((t) => (
              <tr key={t.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                <td className="px-4 py-3">{t.source} <span className="text-fog">→</span> {t.destination}</td>
                <td className="px-4 py-3 font-mono">{t.registration_number}</td>
                <td className="px-4 py-3">{t.driver_name}</td>
                <td className="px-4 py-3 font-mono">{Number(t.cargo_weight).toLocaleString()} kg</td>
                <td className="px-4 py-3 font-mono">{Number(t.planned_distance).toLocaleString()} km</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {t.status === 'Draft' && (
                    <>
                      <button onClick={() => dispatch(t)} className="inline-flex items-center gap-1 text-amber hover:underline mr-3 text-xs"><Play size={12} />Dispatch</button>
                      <button onClick={() => cancel(t)} className="inline-flex items-center gap-1 text-alert hover:underline text-xs"><XIcon size={12} />Cancel</button>
                    </>
                  )}
                  {t.status === 'Dispatched' && (
                    <>
                      <button onClick={() => openComplete(t)} className="inline-flex items-center gap-1 text-teal hover:underline mr-3 text-xs"><Check size={12} />Complete</button>
                      <button onClick={() => cancel(t)} className="inline-flex items-center gap-1 text-alert hover:underline text-xs"><XIcon size={12} />Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create new trip">
        <form onSubmit={submit} className="space-y-4">
          <ErrorBanner message={error} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source">
              <input required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className={inputCls} placeholder="Mumbai" />
            </Field>
            <Field label="Destination">
              <input required value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className={inputCls} placeholder="Pune" />
            </Field>
          </div>
          <Field label="Vehicle (available only)">
            <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} className={inputCls}>
              <option value="">Select a vehicle…</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.registration_number} — {v.name} (max {v.max_load_capacity}kg)</option>
              ))}
            </select>
          </Field>
          <Field label="Driver (available only)">
            <select required value={form.driver_id} onChange={(e) => setForm({ ...form, driver_id: e.target.value })} className={inputCls}>
              <option value="">Select a driver…</option>
              {availableDrivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.license_number}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Cargo weight (kg)${selectedVehicle ? ` — max ${selectedVehicle.max_load_capacity}kg` : ''}`}>
              <input required type="number" min="1" value={form.cargo_weight} onChange={(e) => setForm({ ...form, cargo_weight: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Planned distance (km)">
              <input required type="number" min="1" value={form.planned_distance} onChange={(e) => setForm({ ...form, planned_distance: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">
            Save as draft
          </button>
        </form>
      </Modal>

      <Modal open={!!completeModal} onClose={() => setCompleteModal(null)} title="Complete trip">
        {completeModal && (
          <form onSubmit={submitComplete} className="space-y-4">
            <ErrorBanner message={completeError} />
            <p className="text-sm text-fog">{completeModal.source} → {completeModal.destination} · {completeModal.registration_number}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Actual distance (km)">
                <input type="number" value={completeForm.actual_distance} onChange={(e) => setCompleteForm({ ...completeForm, actual_distance: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Final odometer (km)">
                <input type="number" value={completeForm.final_odometer} onChange={(e) => setCompleteForm({ ...completeForm, final_odometer: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Fuel consumed (L)">
                <input type="number" value={completeForm.fuel_consumed} onChange={(e) => setCompleteForm({ ...completeForm, fuel_consumed: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Fuel cost (₹)">
                <input type="number" value={completeForm.fuel_cost} onChange={(e) => setCompleteForm({ ...completeForm, fuel_cost: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Trip revenue (₹)">
              <input type="number" value={completeForm.revenue} onChange={(e) => setCompleteForm({ ...completeForm, revenue: e.target.value })} className={inputCls} />
            </Field>
            <button type="submit" className="w-full bg-teal text-ink font-medium rounded-md py-2.5 hover:opacity-90 transition-opacity focus-ring">
              Mark as completed
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
