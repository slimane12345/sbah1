import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// Fix: Corrected import path for types.
import type { OrderDataPoint } from '../types';

const data: OrderDataPoint[] = [
  { day: 'السبت', orders: 4000 },
  { day: 'الأحد', orders: 3000 },
  { day: 'الاثنين', orders: 2000 },
  { day: 'الثلاثاء', orders: 2780 },
  { day: 'الأربعاء', orders: 1890 },
  { day: 'الخميس', orders: 2390 },
  { day: 'الجمعة', orders: 3490 },
];

const OrdersChart: React.FC = () => {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              direction: 'rtl',
              fontFamily: 'Cairo, sans-serif'
            }}
            labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
            formatter={(value, name) => [`${value} طلب`, 'الطلبات']}
          />
          <Legend wrapperStyle={{ fontFamily: 'Cairo, sans-serif' }} formatter={(value) => "الطلبات"} />
          <Bar dataKey="orders" fill="#3B82F6" barSize={30} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersChart;
