import React from 'react';

interface StatusToggleProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

const StatusToggle: React.FC<StatusToggleProps> = ({ enabled, onChange, disabled = false }) => {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!enabled);
        }
    };

    return (
        <button
            type="button"
            className={`
                ${enabled ? 'bg-green-600' : 'bg-gray-300'}
                relative inline-flex items-center h-6 rounded-full w-11 transition-colors
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={handleToggle}
            disabled={disabled}
            aria-checked={enabled}
        >
            <span className="sr-only">Toggle Status</span>
            <span
                className={`
                    ${enabled ? 'translate-x-6' : 'translate-x-1'}
                    inline-block w-4 h-4 transform bg-white rounded-full transition-transform
                `}
            />
        </button>
    );
};

export default StatusToggle;
