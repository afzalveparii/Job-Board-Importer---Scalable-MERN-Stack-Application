import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export default function ImportTable({ imports }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'processing':
        return <FaSpinner className="text-yellow-500 animate-spin" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                File Name / URL
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                New
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Failed
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {imports.map((imp) => (
              <tr key={imp._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(imp.status)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {imp.fileName}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {imp.sourceUrl}
                      </div>
                      {imp.status === 'processing' && imp.progress > 0 && (
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${imp.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-900 font-semibold">
                    {imp.totalImported || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-green-600 font-semibold">
                    {imp.newJobs || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-blue-600 font-semibold">
                    {imp.updatedJobs || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-red-600 font-semibold">
                    {imp.failedJobs || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(imp.status)}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-gray-600">
                    {formatDistanceToNow(new Date(imp.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                  {imp.duration > 0 && (
                    <div className="text-xs text-gray-400 mt-1">
                      {(imp.duration / 1000).toFixed(1)}s
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
