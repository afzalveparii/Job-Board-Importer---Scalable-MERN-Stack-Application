'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { triggerImport } from '@/services/api';
import { FaRocket, FaSpinner } from 'react-icons/fa';

// const PRESET_URLS = [
//   { label: 'All Jobs', url: 'https://jobicy.com/?feed=job_feed' },
//   { label: 'Data Science', url: 'https://jobicy.com/?feed=job_feed&job_categories=data-science' },
//   { label: 'Design & Multimedia', url: 'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia' },
//   { label: 'IT & Tech', url: 'https://jobicy.com/?feed=job_feed&job_categories=it-tech' },
//   { label: 'Marketing', url: 'https://jobicy.com/?feed=job_feed&job_categories=marketing' },
// ];

const PRESET_URLS = [
  { label: 'All Jobs', url: 'https://jobicy.com/?feed=job_feed' },
  { label: 'Data Science', url: 'https://jobicy.com/?feed=job_feed&job_categories=data-science' },
  { label: 'Design & Multimedia', url: 'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia' },
  { label: 'Development (IT)', url: 'https://jobicy.com/?feed=job_feed&job_categories=dev' },
  { label: 'Marketing', url: 'https://jobicy.com/?feed=job_feed&job_categories=marketing' },
  { label: 'Engineering', url: 'https://jobicy.com/?feed=job_feed&job_categories=engineering' },
];

export default function TriggerImportPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTrigger = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setLoading(true);
      await triggerImport(url);
      setSuccess(true);
      setTimeout(() => {
        router.push('/imports');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to trigger import');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetUrl) => {
    setUrl(presetUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaRocket className="text-4xl text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trigger Job Import
          </h1>
          <p className="text-gray-600">
            Start a new job import from external API sources
          </p>
        </div>

        {/* Preset URLs */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Quick Select (Preset URLs):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PRESET_URLS.map((preset) => (
              <button
                key={preset.url}
                onClick={() => handlePresetSelect(preset.url)}
                className={`text-left px-4 py-3 rounded-lg border-2 transition ${
                  url === preset.url
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="font-semibold text-gray-900">{preset.label}</div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {preset.url}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom URL Input */}
        <form onSubmit={handleTrigger}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or Enter Custom URL:
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/feed"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                ✓ Import started successfully! Redirecting to history...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                Triggering Import...
              </>
            ) : (
              <>
                <FaRocket />
                Trigger Import
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Import is queued using Redis</li>
            <li>• Worker processes handle the import</li>
            <li>• Real-time progress updates via Socket.IO</li>
            <li>• Check Import History for status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
