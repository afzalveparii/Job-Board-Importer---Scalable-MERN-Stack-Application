'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { fetchImportHistory } from '@/services/api';
import ImportTable from '@/components/ImportTable';
import ImportStats from '@/components/ImportStats';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaSync } from 'react-icons/fa';

export default function ImportsPage() {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });
  const [filter, setFilter] = useState('all');

  const socket = useSocket();

  useEffect(() => {
    loadImports();
  }, [pagination.page, filter]);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates
    socket.on('import-progress', (data) => {
      setImports((prev) =>
        prev.map((imp) =>
          imp._id === data.logId
            ? { ...imp, ...data.stats, progress: data.progress }
            : imp
        )
      );
    });

    socket.on('import-completed', () => {
      loadImports();
    });

    return () => {
      socket.off('import-progress');
      socket.off('import-completed');
    };
  }, [socket]);

  const loadImports = async () => {
    try {
      setLoading(true);
      const data = await fetchImportHistory({
        page: pagination.page,
        limit: pagination.limit,
        status: filter === 'all' ? undefined : filter,
      });
      setImports(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load imports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadImports();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Import History</h1>
          <p className="text-gray-600">
            Track all job import operations with detailed statistics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <ImportStats imports={imports} />

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="text-sm font-semibold text-gray-700 mr-4">
          Filter by Status:
        </label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : imports.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No import history found</p>
        </div>
      ) : (
        <>
          <ImportTable imports={imports} />
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
          />
        </>
      )}
    </div>
  );
}
