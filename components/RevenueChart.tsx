import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Fix: Corrected import path for types.
import type { RevenueDataPoint } from '../types';

const data: RevenueDataPoint[] = [
  { month: 'يناير', revenue: 24000 },
  { month: 'فبراير', revenue: 22100 },
  { month: 'مارس', revenue: 22900 },
  { month: 'أبريل', revenue: 20000 },
  { month: 'مايو', revenue: 21810 },
  { month: 'يونيو', revenue: 25000 },
  { month: 'يوليو', revenue: 21000 },
];

const RevenueChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
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
            formatter={(value: number) => [`${value.toLocaleString('ar-MA')} د.م.`, 'الإيرادات']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;