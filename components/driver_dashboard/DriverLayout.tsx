import React from 'react';
import type { DriverView } from '../../types';
import DriverSidebar from './DriverSidebar';
import DriverBottomNav from './DriverBottomNav';

interface DriverLayoutProps {
    children: React.ReactNode;
    activeView: DriverView;
    setActiveView: (view: DriverView) => void;
}

const DriverLayout: React.FC<DriverLayoutProps> = ({ children, activeView, setActiveView }) => {
    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex">
                <DriverSidebar activeView={activeView} setActiveView={setActiveView} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden">
                <DriverBottomNav activeView={activeView} setActiveView={setActiveView} />
            </div>
        </div>
    );
};

export default DriverLayout;