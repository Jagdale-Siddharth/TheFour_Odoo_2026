import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import ChartCard from './ChartCard';

export default function FleetUtilizationGauge({ value }) {
  const data = [{ name: 'Utilization', value, fill: 'var(--color-primary)' }];
  return (
    <ChartCard title="Fleet Utilization">
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: 'var(--color-line)' }} dataKey="value" cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-data text-2xl font-semibold text-[var(--color-ink)]">{value}%</span>
          <span className="text-xs text-[var(--color-muted)]">of active fleet</span>
        </div>
      </div>
    </ChartCard>
  );
}
