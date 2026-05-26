import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { ProgressBar } from 'primereact/progressbar';

export default function ReusableTable({ columns, data, loading, pagination, onPageChange, onSort, sortField, sortOrder, title, headerRight }) {
  const { total = 0, page = 1, limit = 10 } = pagination || {};

  const handleSort = (e) => {
    if (onSort) onSort(e.sortField, e.sortOrder === 1 ? 'asc' : 'desc');
  };

  const handlePage = (e) => {
    if (onPageChange) onPageChange(e.page + 1, e.rows);
  };

  return (
    <div className="table-card">
      {(title || headerRight) && (
        <div className="table-header">
          {title && <h3>{title}</h3>}
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      {loading && <ProgressBar mode="indeterminate" style={{ height: '3px' }} />}

      <DataTable
        value={data}
        loading={loading}
        sortField={sortField}
        sortOrder={sortOrder === 'asc' ? 1 : -1}
        onSort={handleSort}
        emptyMessage={
          <div className="empty-state">
            <i className="pi pi-inbox" />
            <p>No records found</p>
          </div>
        }
        removableSort
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            body={col.body}
            style={col.style}
          />
        ))}
      </DataTable>

      {total > 0 && (
        <div className="table-footer">
          <span className="total-text">Total {total} record{total !== 1 ? 's' : ''}</span>
          <Paginator
            first={(page - 1) * limit}
            rows={limit}
            totalRecords={total}
            rowsPerPageOptions={[10, 25, 50]}
            onPageChange={handlePage}
            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          />
        </div>
      )}
    </div>
  );
}
