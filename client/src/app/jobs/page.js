'use client';

import { useState, useEffect } from 'react';
import { fetchJobs } from '@/services/api';
import JobCard from '@/components/JobCard';
import JobFilters from '@/components/JobFilters';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaSearch } from 'react-icons/fa';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    jobType: '',
    company: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12,
  });

  useEffect(() => {
    loadJobs();
  }, [pagination.page, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setJobs(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">
          {pagination.total} jobs available • Updated regularly
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or description..."
              value={filters.search}
              onChange={(e) =>
                handleFilterChange({ ...filters, search: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <JobFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Jobs Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSpinner />
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No jobs found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              <Pagination
                pagination={pagination}
                onPageChange={(page) =>
                  setPagination((prev) => ({ ...prev, page }))
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
