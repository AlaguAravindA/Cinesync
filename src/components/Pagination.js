// Pagination.js
import React from 'react';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // Adjust this value based on your preference

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
    const startPage = Math.max(1, currentPage - halfMaxVisiblePages);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav className="inline-flex -space-x-px  shadow-sm" aria-label="Pagination">
      {/* First page button */}
      <a
        href="#"
        className={`relative rounded-md inline-flex items-center px-4 py-2 text-sm font-semibold ${
          currentPage === 1
            ? 'bg-indigo-600 text-white'
            : 'text-slate-200 ring-1 ring-inset ring-gray-900 hover:bg-gray-900 focus:z-20 focus:outline-offset-0'
        }`}
        onClick={() => onPageChange(1)}
      >
        First
      </a>

      {/* Previous button */}
      {/* Ellipsis indicator if needed */}
      

      {getPageNumbers().map((pageNumber) => (
        <a
          key={pageNumber}
          href='#'
          className={`relative inline-flex rounded-md items-center px-4 py-2 text-sm font-semibold ${
            pageNumber === currentPage
              ? 'bg-indigo-600 text-white'
              : 'text-slate-200 ring-1 ring-inset ring-gray-900 hover:bg-gray-900 focus:z-20 focus:outline-offset-0'
          }`}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </a>
      ))}

      {/* Ellipsis indicator if needed */}
      

      {/* Last page button */}
      <a
        href="#"
        className={`relative rounded-md inline-flex items-center px-4 py-2 text-sm font-semibold ${
          currentPage === totalPages
            ? 'bg-indigo-600 text-white'
            : 'text-slate-200 ring-1 ring-inset ring-gray-900 hover:bg-gray-900 focus:z-20 focus:outline-offset-0'
        }`}
        onClick={() => onPageChange(totalPages)}
      >
        Last
      </a>
    </nav>
  );
};

export default Pagination;
