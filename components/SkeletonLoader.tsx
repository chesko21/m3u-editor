// components/SkeletonLoader.tsx
const SkeletonLoader = () => {
    return (
      <div className="animate-pulse">
        {/* Skeleton untuk Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="h-10 bg-gray-300 rounded-md w-32"></div>
          <div className="flex-grow h-10 bg-gray-300 rounded-md"></div>
          <div className="h-10 bg-gray-300 rounded-md w-24"></div>
        </div>
  
        {/* Skeleton untuk Tabel */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200 sticky top-0">
              <tr>
                {[...Array(8)].map((_, index) => (
                  <th key={index} className="border p-2 text-left">
                    <div className="h-6 bg-gray-300 rounded-md"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="border hover:bg-gray-100 transition">
                  {[...Array(8)].map((_, colIndex) => (
                    <td key={colIndex} className="border p-2">
                      <div className="h-6 bg-gray-300 rounded-md"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default SkeletonLoader;