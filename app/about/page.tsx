export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Judul dan Deskripsi */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            About Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            We are a team of developers passionate about creating tools that make
            managing media playlists simple and efficient.
          </p>
        </div>

        {/* Bagian Misi */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Mission
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
            Our mission is to provide innovative solutions that simplify the
            management of IPTV playlists, enabling users to enjoy seamless media
            experiences.
          </p>
        </div>

        {/* Bagian Nilai */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Our Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Innovation
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                We constantly strive to innovate and improve our tools to meet the
                evolving needs of our users.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                User-Centric
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Our users are at the heart of everything we do. We design our
                tools with their needs in mind.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Quality
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                We are committed to delivering high-quality tools that are
                reliable and easy to use.
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Tim */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Meet Our Team
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-24 h-24 bg-blue-100 dark:bg-blue-800 rounded-full mb-4 mx-auto">
                <svg
                  className="w-12 h-12 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                John Doe
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Lead Developer
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-800 rounded-full mb-4 mx-auto">
                <svg
                  className="w-12 h-12 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Jane Smith
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                UI/UX Designer
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-24 h-24 bg-purple-100 dark:bg-purple-800 rounded-full mb-4 mx-auto">
                <svg
                  className="w-12 h-12 text-purple-600 dark:text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                Mike Johnson
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Product Manager
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}