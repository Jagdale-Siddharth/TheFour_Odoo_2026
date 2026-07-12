import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { STATUS_COLOR_MAP } from '../../constants/status';
import ChartCard from './ChartCard';

export default function VehicleStatusChart({ data }) {
  return (
    <ChartCard title="Vehicle Status">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="status" innerRadius={55} outerRadius={80} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.status} fill={STATUS_COLOR_MAP[entry.status]?.color || '#94A3B8'} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [value, STATUS_COLOR_MAP[name]?.label || name]} />
          <Legend formatter={(value) => STATUS_COLOR_MAP[value]?.label || value} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
