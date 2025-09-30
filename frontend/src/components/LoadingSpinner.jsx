const LoadingSpinner = () => {
  return (
    <div className="w-full flex items-center justify-center py-6" role="status" aria-live="polite">
      <div className="rounded-full border-4 border-gray-700 border-t-[#FFB300] animate-spin
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
