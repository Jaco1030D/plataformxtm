import React from 'react';

interface FilterSidebarProps {
    children: React.ReactNode;
    className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

export default FilterSidebar;
