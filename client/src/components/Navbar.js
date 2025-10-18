import Link from 'next/link';
import { FaBriefcase } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900">Job Board</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              Jobs
            </Link>
            <Link
              href="/imports"
              className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              Import History
            </Link>
            <Link
              href="/imports/trigger"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Trigger Import
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
