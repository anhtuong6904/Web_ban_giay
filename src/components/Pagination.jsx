import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button
        className={`pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        ← Trước
      </button>

      <div className="page-numbers">
        {pageNumbers[0] > 1 && (
          <>
            <button
              className="pagination-btn page-btn"
              onClick={() => handlePageClick(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="page-ellipsis">...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`pagination-btn page-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="page-ellipsis">...</span>
            )}
            <button
              className="pagination-btn page-btn"
              onClick={() => handlePageClick(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={`pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Sau →
      </button>
    </div>
  );
};

export default Pagination;
