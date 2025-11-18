import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'سبت', earnings: 120 },
  { day: 'أحد', earnings: 180 },
  { day: 'اثنين', earnings: 150 },
  { day: 'ثلاثاء', earnings: 210 },
  { day: 'أربعاء', earnings: 160 },
  { day: 'خميس', earnings: 250 },
  { day: 'جمعة', earnings: 220 },
];

const EarningsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `${value}`} axisLine={false} tickLine={false} />
        <Tooltip
            cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              direction: 'rtl',
              fontFamily: 'Cairo, sans-serif'
            }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toLocaleString('ar-MA')} د.م.`, 'الأرباح']}
          />
        <Bar dataKey="earnings" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EarningsChart;