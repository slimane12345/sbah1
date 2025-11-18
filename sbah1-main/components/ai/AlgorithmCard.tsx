import React, { useState } from 'react';
import type { AiAlgorithm } from '../../types';
import AiStatusBadge from './AiStatusBadge';

interface AlgorithmCardProps {
  algorithm: AiAlgorithm;
}

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
    <button
        type="button"
        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        onClick={() => onChange(!enabled)}
    >
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);


const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
    const [isEnabled, setIsEnabled] = useState(algorithm.enabled);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{algorithm.name}</h3>
                    <AiStatusBadge status={algorithm.status} />
                </div>
                <p className="text-sm text-gray-600 mb-4">{algorithm.description}</p>
                
                <div className="border-t border-b py-4 my-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">المقاييس الرئيسية</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {/* Fix: Explicitly typed `value` to avoid `unknown` type which isn't a valid ReactNode. This is resolved by creating a proper `types.ts` file. */}
                        {Object.entries(algorithm.metrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="text-gray-500">{key}:</span>
                                <span className="font-semibold text-gray-800">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                    <Toggle enabled={isEnabled} onChange={setIsEnabled} />
                    <span className={`mr-3 text-sm font-medium ${isEnabled ? 'text-gray-800' : 'text-gray-500'}`}>
                        {isEnabled ? 'مفعل' : 'معطل'}
                    </span>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors">
                    ضبط الإعدادات
                </button>
            </div>
        </div>
    );
};

export default AlgorithmCard;
