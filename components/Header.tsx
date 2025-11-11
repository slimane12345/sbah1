import React from 'react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                {/* Right side in RTL: Title & Menu Button */}
                <div className="flex items-center">
                    {/* Hamburger button, visible on screens smaller than lg */}
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden ml-4"
                        onClick={onMenuClick}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                </div>

                {/* Center: Search bar */}
                <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
                    <div className="max-w-md w-full lg:max-w-xs">
                        <label htmlFor="search" className="sr-only">بحث</label>
                        <div className="relative text-gray-400 focus-within:text-gray-600">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input id="search" name="search" className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="بحث..." type="search" />
                        </div>
                    </div>
                </div>

                {/* Left side in RTL: Actions */}
                <div className="flex items-center gap-4">
                    <button type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
                         <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3"><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span></span>
                    </button>

                    <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

                    <div className="relative">
                        <button className="flex items-center gap-2">
                            <img className="h-9 w-9 rounded-full" src="https://picsum.photos/100" alt="User" />
                            <div className="hidden sm:block text-right">
                               <p className="text-sm font-semibold text-gray-700">مدير النظام</p>
                               <p className="text-xs text-gray-500">Admin</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
};

export default Header;