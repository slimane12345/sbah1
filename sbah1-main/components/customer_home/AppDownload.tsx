import React from 'react';

const AppDownload: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    <span className="block">هل أنت مستعد لتجربة أسهل؟</span>
                    <span className="block text-blue-400">حمل تطبيقنا الآن.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            App Store
                        </a>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">
                        <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                            Google Play
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppDownload;
