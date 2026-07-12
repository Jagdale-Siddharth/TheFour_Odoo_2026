import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';
import ChartCard from './ChartCard';

export default function MaintenanceCostChart({ data }) {
  return (
    <ChartCard title="Maintenance Cost">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Bar dataKey="amount" fill="var(--color-warning)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
