import React, { useState, useEffect, useCallback } from 'react';
import ReusableFilter from '../components/ReusableFilter';
import ReusableTable from '../components/ReusableTable';
import { fetchUsers } from '../services/api';

const filterConfig = [
  { key: 'search', type: 'text', label: 'Search', placeholder: 'Search by name, email, phone...', width: 280 }
];

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilters, setActiveFilters] = useState({});

  const loadUsers = useCallback(async (filters = activeFilters, page = pagination.page, limit = pagination.limit, sf = sortField, so = sortOrder) => {
    setLoading(true);
    try {
      const { data: res } = await fetchUsers({ ...filters, page, limit, sortBy: sf, sortOrder: so });
      setData(res.data);
      setPagination(res.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers({}, 1, 10, 'createdAt', 'desc'); }, []);

  const handleApply = (filters) => {
    setActiveFilters(filters);
    loadUsers(filters, 1, pagination.limit, sortField, sortOrder);
  };

  const handleClear = () => {
    setActiveFilters({});
    loadUsers({}, 1, pagination.limit, sortField, sortOrder);
  };

  const handlePageChange = (page, limit) => {
    setPagination((p) => ({ ...p, page, limit }));
    loadUsers(activeFilters, page, limit, sortField, sortOrder);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    loadUsers(activeFilters, pagination.page, pagination.limit, field, order);
  };

  const columns = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'phone', header: 'Phone' },
    {
      field: 'createdAt',
      header: 'Created Date',
      sortable: true,
      body: (row) => new Date(row.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }
  ];

  return (
    <div>
      <ReusableFilter config={filterConfig} onApply={handleApply} onClear={handleClear} />
      <ReusableTable
        title="Users"
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
}
