const PageLoader = ({ isLoading, children }) => {
  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#E55938] border-solid"></div>
        </div>
      ) : null}
      {children}
    </>
  );
};

export default PageLoader;
