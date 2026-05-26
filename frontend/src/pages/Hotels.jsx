import React, { useState, useEffect, useCallback } from 'react';
import ReusableFilter from '../components/ReusableFilter';
import ReusableTable from '../components/ReusableTable';
import { fetchHotels, fetchStates, fetchCities } from '../services/api';

const ratingOptions = [1, 2, 3, 4, 5].map((n) => ({ label: `${n} Star${n > 1 ? 's' : ''}`, value: n }));
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

export default function Hotels() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilters, setActiveFilters] = useState({});
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    fetchStates().then(({ data: res }) => {
      setStateOptions(res.data.map((s) => ({ label: s.name, value: s.name })));
    });
    fetchCities().then(({ data: res }) => {
      setCityOptions(res.data.map((c) => ({ label: c.name, value: c.name })));
    });
    loadHotels({}, 1, 10, 'createdAt', 'desc');
  }, []);

  const loadHotels = useCallback(async (filters, page, limit, sf, so) => {
    setLoading(true);
    try {
      const { data: res } = await fetchHotels({ ...filters, page, limit, sortBy: sf, sortOrder: so });
      setData(res.data);
      setPagination(res.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStateChange = async (state) => {
    if (state) {
      const { data: res } = await fetchCities(state);
      setCityOptions(res.data.map((c) => ({ label: c.name, value: c.name })));
    } else {
      const { data: res } = await fetchCities();
      setCityOptions(res.data.map((c) => ({ label: c.name, value: c.name })));
    }
  };

  const filterConfig = [
    { key: 'search', type: 'text', label: 'Search', placeholder: 'Search hotel name...' },
    { key: 'state', type: 'dropdown', label: 'State', options: stateOptions, onChange: handleStateChange },
    { key: 'city', type: 'dropdown', label: 'City', options: cityOptions },
    { key: 'rating', type: 'dropdown', label: 'Rating', options: ratingOptions },
    { key: 'status', type: 'dropdown', label: 'Status', options: statusOptions }
  ];

  const handleApply = (filters) => {
    setActiveFilters(filters);
    loadHotels(filters, 1, pagination.limit, sortField, sortOrder);
  };

  const handleClear = () => {
    setActiveFilters({});
    loadHotels({}, 1, pagination.limit, sortField, sortOrder);
  };

  const handlePageChange = (page, limit) => {
    setPagination((p) => ({ ...p, page, limit }));
    loadHotels(activeFilters, page, limit, sortField, sortOrder);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    loadHotels(activeFilters, pagination.page, pagination.limit, field, order);
  };

  const columns = [
    { field: 'name', header: 'Hotel Name' },
    { field: 'location', header: 'Location' },
    { field: 'city', header: 'City' },
    { field: 'state', header: 'State' },
    {
      field: 'rating',
      header: 'Rating',
      body: (row) => (
        <span className="rating-stars">
          {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}
          <span style={{ color: '#999', marginLeft: 4, fontSize: 12 }}>({row.rating})</span>
        </span>
      )
    },
    {
      field: 'isActive',
      header: 'Status',
      body: (row) => (
        <span className={`status-badge ${row.isActive ? 'status-active' : 'status-inactive'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <div>
      <ReusableFilter config={filterConfig} onApply={handleApply} onClear={handleClear} />
      <ReusableTable
        title="Hotels"
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
