import Link from 'next/link';
import { FaRocket, FaHistory, FaBriefcase } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Job Board Import System
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Scalable job import system with Redis queue processing, real-time updates, 
          and comprehensive import history tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Import History Card */}
        <Link href="/imports" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
              <FaHistory className="text-3xl text-blue-500 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Import History</h2>
            <p className="text-gray-600 mb-4">
              View all import logs with detailed statistics, progress tracking, and failure reasons.
            </p>
            <span className="text-blue-500 font-semibold group-hover:underline">
              View History →
            </span>
          </div>
        </Link>

        {/* Jobs List Card */}
        <Link href="/jobs" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
              <FaBriefcase className="text-3xl text-green-500 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Browse Jobs</h2>
            <p className="text-gray-600 mb-4">
              Search and filter through imported job listings with advanced filtering options.
            </p>
            <span className="text-green-500 font-semibold group-hover:underline">
              Browse Jobs →
            </span>
          </div>
        </Link>

        {/* Trigger Import Card */}
        <Link href="/imports/trigger" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
              <FaRocket className="text-3xl text-purple-500 group-hover:text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trigger Import</h2>
            <p className="text-gray-600 mb-4">
              Manually trigger a new job import from external API sources with queue processing.
            </p>
            <span className="text-purple-500 font-semibold group-hover:underline">
              Start Import →
            </span>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          System Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Redis Queue Processing', desc: 'Asynchronous job processing with BullMQ' },
            { title: 'Real-time Updates', desc: 'Socket.IO for live import progress tracking' },
            { title: 'Batch Processing', desc: 'Efficient batch import for large datasets' },
            { title: 'Error Handling', desc: 'Comprehensive error tracking and retry logic' },
            { title: 'Scheduled Imports', desc: 'Automated hourly imports via cron jobs' },
            { title: 'Scalable Architecture', desc: 'Worker processes for concurrent imports' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
