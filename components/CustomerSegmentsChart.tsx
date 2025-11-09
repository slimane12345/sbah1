import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
// Fix: Corrected import path for types.
import type { CustomerSegment } from '../types';

const data: CustomerSegment[] = [
  { name: 'بلاتيني', value: 400 },
  { name: 'ذهبي', value: 300 },
  { name: 'فضي', value: 300 },
  { name: 'برونزي', value: 200 },
];

const COLORS = {
    'بلاتيني': '#e0f2fe',
    'ذهبي': '#fef08a',
    'فضي': '#e5e7eb',
    'برونزي': '#fde68a',
};

const CustomerSegmentsChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontFamily: 'Cairo, sans-serif'
            }}
            formatter={(value: number, name) => [`${value} عميل`, name]}
          />
           <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif', fontSize: '14px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerSegmentsChart;
