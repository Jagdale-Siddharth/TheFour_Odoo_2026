import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_COLOR_MAP } from '../../constants/status';
import ChartCard from './ChartCard';

export default function TripStatusChart({ data }) {
  return (
    <ChartCard title="Trip Status">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="status" tickFormatter={(s) => STATUS_COLOR_MAP[s]?.label || s} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip labelFormatter={(s) => STATUS_COLOR_MAP[s]?.label || s} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLOR_MAP[entry.status]?.color || '#94A3B8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
