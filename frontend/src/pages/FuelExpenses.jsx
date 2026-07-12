import React, { useEffect, useState } from 'react';
import { Plus, Fuel, Receipt } from 'lucide-react';
import api from '../api';
import Modal from '../components/Modal';
import { Field, inputCls, ErrorBanner } from '../components/Form';

export default function FuelExpenses() {
  const [tab, setTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '', liters: '', cost: '', log_date: '' });
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: '', category: 'Toll', amount: '', expense_date: '', notes: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [f, e, v] = await Promise.all([
      api.get('/fuel-logs'),
      api.get('/expenses'),
      api.get('/vehicles'),
    ]);
    setFuelLogs(f.data);
    setExpenses(e.data);
    setVehicles(v.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitFuel = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/fuel-logs', fuelForm);
      setModalOpen(false);
      setFuelForm({ vehicle_id: '', liters: '', cost: '', log_date: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record fuel log');
    }
  };

  const submitExpense = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/expenses', expenseForm);
      setModalOpen(false);
      setExpenseForm({ vehicle_id: '', category: 'Toll', amount: '', expense_date: '', notes: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record expense');
    }
  };

  const totalFuelCost = fuelLogs.reduce((s, f) => s + Number(f.cost), 0);
  const totalExpenseCost = expenses.reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">FUEL & EXPENSES</h1>
          <p className="eyebrow mt-1">Operational cost tracking per vehicle</p>
        </div>
        <button onClick={() => { setError(null); setModalOpen(true); }} className="flex items-center gap-2 bg-amber text-ink font-medium rounded-md px-4 py-2 text-sm hover:bg-amber-soft transition-colors focus-ring">
          <Plus size={16} /> Log entry
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="panel p-4">
          <p className="eyebrow mb-2">Total fuel spend</p>
          <p className="digit text-2xl text-amber">₹{totalFuelCost.toLocaleString()}</p>
        </div>
        <div className="panel p-4">
          <p className="eyebrow mb-2">Total other expenses</p>
          <p className="digit text-2xl text-teal">₹{totalExpenseCost.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-steeledge">
        <button onClick={() => setTab('fuel')} className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${tab === 'fuel' ? 'border-amber text-amber' : 'border-transparent text-fog hover:text-cargo'}`}>
          <Fuel size={15} /> Fuel logs
        </button>
        <button onClick={() => setTab('expenses')} className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors ${tab === 'expenses' ? 'border-amber text-amber' : 'border-transparent text-fog hover:text-cargo'}`}>
          <Receipt size={15} /> Other expenses
        </button>
      </div>

      {tab === 'fuel' ? (
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steeledge text-left">
                <th className="eyebrow font-normal px-4 py-3">Vehicle</th>
                <th className="eyebrow font-normal px-4 py-3">Liters</th>
                <th className="eyebrow font-normal px-4 py-3">Cost</th>
                <th className="eyebrow font-normal px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-fog">Loading…</td></tr>
              ) : fuelLogs.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-fog">No fuel logs yet.</td></tr>
              ) : fuelLogs.map((f) => (
                <tr key={f.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                  <td className="px-4 py-3 font-mono">{f.registration_number}</td>
                  <td className="px-4 py-3 font-mono">{Number(f.liters).toFixed(1)} L</td>
                  <td className="px-4 py-3 font-mono">₹{Number(f.cost).toLocaleString()}</td>
                  <td className="px-4 py-3 text-fog">{new Date(f.log_date).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steeledge text-left">
                <th className="eyebrow font-normal px-4 py-3">Vehicle</th>
                <th className="eyebrow font-normal px-4 py-3">Category</th>
                <th className="eyebrow font-normal px-4 py-3">Amount</th>
                <th className="eyebrow font-normal px-4 py-3">Date</th>
                <th className="eyebrow font-normal px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-fog">Loading…</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-fog">No expenses logged yet.</td></tr>
              ) : expenses.map((e) => (
                <tr key={e.id} className="border-b border-steeledge/60 hover:bg-steel/30 transition-colors">
                  <td className="px-4 py-3 font-mono">{e.registration_number}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3 font-mono">₹{Number(e.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-fog">{new Date(e.expense_date).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-fog max-w-xs truncate">{e.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Log an entry">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('fuel')} className={`flex-1 py-2 rounded-md text-sm border ${tab === 'fuel' ? 'bg-amber/10 text-amber border-amber/30' : 'border-steeledge text-fog'}`}>Fuel log</button>
          <button onClick={() => setTab('expenses')} className={`flex-1 py-2 rounded-md text-sm border ${tab === 'expenses' ? 'bg-amber/10 text-amber border-amber/30' : 'border-steeledge text-fog'}`}>Expense</button>
        </div>
        <ErrorBanner message={error} />
        {tab === 'fuel' ? (
          <form onSubmit={submitFuel} className="space-y-4 mt-4">
            <Field label="Vehicle">
              <select required value={fuelForm.vehicle_id} onChange={(e) => setFuelForm({ ...fuelForm, vehicle_id: e.target.value })} className={inputCls}>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registration_number} — {v.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Liters">
                <input required type="number" min="0" step="0.1" value={fuelForm.liters} onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Cost (₹)">
                <input required type="number" min="0" value={fuelForm.cost} onChange={(e) => setFuelForm({ ...fuelForm, cost: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Date">
              <input type="date" value={fuelForm.log_date} onChange={(e) => setFuelForm({ ...fuelForm, log_date: e.target.value })} className={inputCls} />
            </Field>
            <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">Log fuel entry</button>
          </form>
        ) : (
          <form onSubmit={submitExpense} className="space-y-4 mt-4">
            <Field label="Vehicle">
              <select required value={expenseForm.vehicle_id} onChange={(e) => setExpenseForm({ ...expenseForm, vehicle_id: e.target.value })} className={inputCls}>
                <option value="">Select vehicle…</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.registration_number} — {v.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <select value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })} className={inputCls}>
                  <option>Toll</option>
                  <option>Parking</option>
                  <option>Permit</option>
                  <option>Insurance</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Amount (₹)">
                <input required type="number" min="0" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Date">
              <input type="date" value={expenseForm.expense_date} onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Notes">
              <input value={expenseForm.notes} onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })} className={inputCls} />
            </Field>
            <button type="submit" className="w-full bg-amber text-ink font-medium rounded-md py-2.5 hover:bg-amber-soft transition-colors focus-ring">Log expense</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
