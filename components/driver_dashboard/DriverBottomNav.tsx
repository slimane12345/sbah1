import React from 'react';
import type { DriverView } from '../../types';

interface DriverBottomNavProps {
    activeView: DriverView;
    setActiveView: (view: DriverView) => void;
    activeOrderCount: number;
}

const navItems: { id: DriverView; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'نظرة عامة', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'my-orders', label: 'طلباتي', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" /></svg> },
    { id: 'orders', label: 'الطلبات', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h2.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l1.414-1.414a1 1 0 01.707-.293H17a2 2 0 012 2v2" /></svg> },
    { id: 'earnings', label: 'الأرباح', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'profile', label: 'ملفي', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
];

const DriverBottomNav: React.FC<DriverBottomNavProps> = ({ activeView, setActiveView, activeOrderCount }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
                            activeView === item.id ? 'text-[#3B82F6]' : 'text-gray-500'
                        }`}
                    >
                        {item.icon}
                        <span className="text-xs font-medium">{item.label}</span>
                        {item.id === 'my-orders' && activeOrderCount > 0 && (
                             <span className="absolute top-1 right-4 bg-red-500 text-white font-bold text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {activeOrderCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DriverBottomNav;