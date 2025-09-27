import React from 'react';
import { Check } from 'lucide-react';

interface SegmentCheckboxProps {
    isSelected: boolean;
    onToggle: () => void;
}

const SegmentCheckbox: React.FC<SegmentCheckboxProps> = ({ isSelected, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
        >
            {isSelected && <Check className="w-4 h-4" />}
        </button>
    );
};

export default SegmentCheckbox;
