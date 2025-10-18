import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ pagination, onPageChange }) {
  const { page, pages } = pagination;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift('...');
    }
    if (page + delta < pages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (pages > 1) range.push(pages);

    return range;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((pageNum, idx) =>
        pageNum === '...' ? (
          <span key={idx} className="px-3 py-2">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(pageNum)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              pageNum === page
                ? 'bg-blue-500 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
