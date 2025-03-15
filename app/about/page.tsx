export default function About() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Judul dan Deskripsi */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold  sm:text-4xl">
            About This Project
          </h2>
          <p className="mt-4 text-lg ">
            <strong>M3U Editor</strong> is an open-source tool designed to help users
            manage and edit IPTV playlists easily and efficiently.
          </p>
        </div>

        {/* Bagian Misi */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Our Mission
          </h3>
          <p className="text-center max-w-2xl mx-auto">
            To provide an intuitive and powerful playlist editor that enhances the
            IPTV experience for users worldwide.
          </p>
        </div>

        {/* Link ke GitHub */}
        <div className="text-center mt-16">
          <h3 className="text-xl font-bold">
            Explore the Project
          </h3>
          <p className="mt-2">
            Check out the source code and contribute to the project on GitHub.
          </p>
          <a
            href="https://github.com/chesko21/m3u-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block px-6 py-3 text-lg font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
          >
            Visit GitHub Repo
          </a>
        </div>
      </div>
    </div>
  );
}
