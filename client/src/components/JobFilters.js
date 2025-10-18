export default function JobFilters({ filters, onFilterChange }) {
  const categories = ['All', 'Data Science', 'Design', 'IT & Tech', 'Marketing', 'Sales'];
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Freelance'];

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-20">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) =>
            onFilterChange({ ...filters, category: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === 'All' ? '' : cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Job Type
        </label>
        <select
          value={filters.jobType}
          onChange={(e) =>
            onFilterChange({ ...filters, jobType: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {jobTypes.map((type) => (
            <option key={type} value={type === 'All' ? '' : type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Company Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Company
        </label>
        <input
          type="text"
          value={filters.company}
          onChange={(e) =>
            onFilterChange({ ...filters, company: e.target.value })
          }
          placeholder="Search by company"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={() =>
          onFilterChange({ search: '', category: '', jobType: '', company: '' })
        }
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Clear Filters
      </button>
    </div>
  );
}
