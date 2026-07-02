import React, { useState } from 'react';

interface WidgetCardProps {
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onRefresh?: () => void;
  onExpand?: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children, icon, onRefresh, onExpand }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col transition-shadow hover:ring-2 hover:ring-green-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {icon && <div className="text-green-600">{icon}</div>}
          {title && <h3 className="text-sm font-semibold text-gray-800">{title}</h3>}
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button onClick={onRefresh} className="text-gray-500 hover:text-gray-700 p-1 rounded" title="Refresh">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6" />
              </svg>
            </button>
          )}
          {onExpand && (
            <button onClick={onExpand} className="text-gray-500 hover:text-gray-700 p-1 rounded" title="Open">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3h6v2H5v4H3V3zM17 17h-6v-2h4v-4h2v6zM3 17v-6h2v4h4v2H3zM17 3v6h-2V5h-4V3h6z"/></svg>
            </button>
          )}
          <button onClick={() => setCollapsed(c => !c)} className="text-gray-500 hover:text-gray-700 p-1 rounded" title={collapsed ? 'Expand' : 'Collapse'}>
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
            )}
          </button>
        </div>
      </div>

      {!collapsed && <div className="flex-grow">{children}</div>}
    </div>
  );
};

export default WidgetCard;
