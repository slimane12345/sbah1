import React from 'react';

export type StatCardIcon = 'orders' | 'revenue' | 'customers' | 'couriers' | 'restaurants';
type ChangeType = 'increase' | 'decrease';

interface StatCardProps {
  icon: StatCardIcon;
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
}

const iconMap: Record<StatCardIcon, { Svg: React.ReactElement; mainColor: string; lightColor: string }> = {
  orders: {
    Svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    mainColor: 'text-blue-500',
    lightColor: 'bg-blue-100',
  },
  revenue: {
    Svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>,
    mainColor: 'text-green-500',
    lightColor: 'bg-green-100',
  },
  customers: {
    Svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    mainColor: 'text-indigo-500',
    lightColor: 'bg-indigo-100',
  },
  couriers: {
    Svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" /></svg>,
    mainColor: 'text-yellow-500',
    lightColor: 'bg-yellow-100',
  },
  restaurants: {
    Svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    mainColor: 'text-pink-500',
    lightColor: 'bg-pink-100',
  },
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, changeType }) => {
  const { Svg, mainColor, lightColor } = iconMap[icon];
  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  const changeIcon = changeType === 'increase' ? '▲' : '▼';

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm flex items-center gap-4">
      <div className={`flex-shrink-0 p-3.5 rounded-full ${lightColor}`}>
        <div className={mainColor}>{Svg}</div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <span className={`text-xs font-semibold ${changeColor} flex items-center`}>
                {changeIcon} {change}
            </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;