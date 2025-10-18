import { formatDistanceToNow } from 'date-fns';
import { FaMapMarkerAlt, FaBriefcase, FaExternalLinkAlt } from 'react-icons/fa';

export default function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-blue-500 transition">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            <FaExternalLinkAlt />
          </a>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
          {job.category}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {job.jobType}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{job.location}</span>
        </div>
        {job.salary && (
          <div className="flex items-center gap-1">
            <FaBriefcase className="text-gray-400" />
            <span>{job.salary}</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
        {job.description?.replace(/<[^>]*>/g, '')}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          Posted {formatDistanceToNow(new Date(job.postedDate), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
