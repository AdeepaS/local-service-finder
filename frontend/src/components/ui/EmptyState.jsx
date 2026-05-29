const EmptyState = ({ title = "No Results Found", message = "We couldn't find any services matching your criteria.", actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-gray-100 shadow-sm my-8">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{message}</p>
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="bg-primary hover:bg-secondary text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
