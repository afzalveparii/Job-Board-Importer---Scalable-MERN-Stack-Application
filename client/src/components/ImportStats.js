import { FaCheckCircle, FaSpinner, FaTimesCircle, FaDatabase } from 'react-icons/fa';

export default function ImportStats({ imports }) {
  const stats = imports.reduce(
    (acc, imp) => {
      acc.total++;
      if (imp.status === 'completed') acc.completed++;
      if (imp.status === 'processing') acc.processing++;
      if (imp.status === 'failed') acc.failed++;
      acc.totalImported += imp.totalImported || 0;
      return acc;
    },
    { total: 0, completed: 0, processing: 0, failed: 0, totalImported: 0 }
  );

  const statCards = [
    {
      label: 'Total Imports',
      value: stats.total,
      icon: FaDatabase,
      color: 'blue',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: FaCheckCircle,
      color: 'green',
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: FaSpinner,
      color: 'yellow',
    },
    {
      label: 'Failed',
      value: stats.failed,
      icon: FaTimesCircle,
      color: 'red',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Icon className={`text-2xl text-${stat.color}-500`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
