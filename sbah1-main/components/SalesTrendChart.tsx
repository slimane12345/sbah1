import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// Fix: Corrected import path for types.
import type { SalesDataPoint } from '../types';

const data: SalesDataPoint[] = [
  { date: '22 أكتوبر', sales: 4000 },
  { date: '23 أكتوبر', sales: 3000 },
  { date: '24 أكتوبر', sales: 2000 },
  { date: '25 أكتوبر', sales: 2780 },
  { date: '26 أكتوبر', sales: 1890 },
  { date: '27 أكتوبر', sales: 2390 },
  { date: '28 أكتوبر', sales: 3490 },
];

const SalesTrendChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `${value / 1000} ألف`} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              direction: 'rtl',
              fontFamily: 'Cairo, sans-serif'
            }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
            formatter={(value: number) => [`${value.toLocaleString('ar-MA')} د.م.`, 'المبيعات']}
          />
          <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif' }} formatter={() => "المبيعات"} />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesTrendChart;