import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  
  // Logic to show appropriate page numbers
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // Always show at least 5 pages if available
  if (endPage - startPage + 1 < 5) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>
          &laquo; Prev
        </button>
      )}
      
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)}>1</button>
          {startPage > 2 && <span>...</span>}
        </>
      )}
      
      {pageNumbers.map(number => (
        <button 
          key={number}
          className={currentPage === number ? 'active' : ''}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span>...</span>}
          <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>
          Next &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;
