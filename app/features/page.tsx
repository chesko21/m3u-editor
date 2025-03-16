export default function Features() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Judul dan Deskripsi */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Features
          </h2>
          <p className="mt-4 text-lg ">
            Discover the powerful features of our M3U Playlist Manager designed to make your IPTV experience seamless and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <h3 className="text-xl text-gray-900 dark:text-white font-bold mb-2">
              Upload M3U File
            </h3>
            <p className="text-gray-900 dark:text-white">
              Easily upload your M3U files to manage and edit your IPTV playlists.
            </p>
          </div>

          {/* Fitur 2: Edit Channel Details */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Channel Details
            </h3>
            <p className="text-gray-900 dark:text-white">
              Modify channel names, logos, URLs, and other details with ease.
            </p>
          </div>

          {/* Fitur 3: Fetch from URL */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Fetch from URL
            </h3>
            <p className="text-gray-900 dark:text-white">
              Load M3U playlists directly from a URL for quick access and editing.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-yellow-600 dark:text-yellow-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Download M3U File
            </h3>
            <p className="text-gray-900 dark:text-white">
              Save your edited playlists as M3U files for offline use.
            </p>
          </div>

          {/* Fitur 5: Light & Dark Mode */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-pink-100 dark:bg-pink-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-pink-600 dark:text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Light & Dark Mode
            </h3>
            <p className="text-gray-900 dark:text-white">
              Switch between light and dark themes for a comfortable viewing experience.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Responsive Design
            </h3>
            <p className="text-gray-900 dark:text-white">
              Access and manage your playlists on any device with a fully responsive design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}