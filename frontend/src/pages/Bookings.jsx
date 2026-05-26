import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ReusableFilter from '../components/ReusableFilter';
import ReusableTable from '../components/ReusableTable';
import { fetchBookings, fetchUsers, fetchHotels, cancelBooking, downloadBookings } from '../services/api';

const statusOptions = [
  { label: 'Confirmed', value: 0 },
  { label: 'Cancelled', value: 1 },
  { label: 'Completed', value: 2 }
];

const statusMeta = {
  0: { label: 'Confirmed', cls: 'status-confirmed' },
  1: { label: 'Cancelled', cls: 'status-cancelled' },
  2: { label: 'Completed', cls: 'status-completed' }
};

export default function Bookings() {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10 });
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeFilters, setActiveFilters] = useState({});
  const [userOptions, setUserOptions] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchUsers({ limit: 500 }),
      fetchHotels({ limit: 500 })
    ]).then(([usersRes, hotelsRes]) => {
      setUserOptions(usersRes.data.data.map((u) => ({ label: u.name, value: u._id })));
      setHotelOptions(hotelsRes.data.data.map((h) => ({ label: h.name, value: h._id })));
    });
    loadBookings({}, 1, 10, 'createdAt', 'desc');
  }, []);

  const loadBookings = useCallback(async (filters, page, limit, sf, so) => {
    setLoading(true);
    try {
      const { data: res } = await fetchBookings({ ...filters, page, limit, sortBy: sf, sortOrder: so });
      setData(res.data);
      setPagination(res.pagination);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApply = (filters) => {
    const mapped = { ...filters };
    if (filters.fromDate) mapped.fromDate = new Date(filters.fromDate).toISOString().split('T')[0];
    if (filters.toDate) mapped.toDate = new Date(filters.toDate).toISOString().split('T')[0];
    setActiveFilters(mapped);
    loadBookings(mapped, 1, pagination.limit, sortField, sortOrder);
  };

  const handleClear = () => {
    setActiveFilters({});
    loadBookings({}, 1, pagination.limit, sortField, sortOrder);
  };

  const handlePageChange = (page, limit) => {
    setPagination((p) => ({ ...p, page, limit }));
    loadBookings(activeFilters, page, limit, sortField, sortOrder);
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
    loadBookings(activeFilters, pagination.page, pagination.limit, field, order);
  };

  const handleCancel = (booking) => {
    confirmDialog({
      message: `Cancel booking for ${booking.userId?.name} at ${booking.hotelId?.name}?`,
      header: 'Cancel Booking',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await cancelBooking(booking._id);
          toast.current.show({ severity: 'success', summary: 'Cancelled', detail: 'Booking cancelled successfully' });
          loadBookings(activeFilters, pagination.page, pagination.limit, sortField, sortOrder);
        } catch (err) {
          toast.current.show({ severity: 'error', summary: 'Error', detail: err?.response?.data?.message || 'Failed to cancel' });
        }
      }
    });
  };

  const filterConfig = [
    { key: 'userId', type: 'dropdown', label: 'User', options: userOptions, width: 200 },
    { key: 'hotelId', type: 'dropdown', label: 'Hotel', options: hotelOptions, width: 200 },
    { key: 'status', type: 'dropdown', label: 'Status', options: statusOptions, width: 160 },
    { key: 'fromDate', type: 'date', label: 'From Date', width: 160 },
    { key: 'toDate', type: 'date', label: 'To Date', width: 160 }
  ];

  const columns = [
    {
      field: 'userId.name',
      header: 'Guest Name',
      body: (row) => row.userId?.name || '-'
    },
    {
      field: 'hotelId.name',
      header: 'Hotel Name',
      body: (row) => row.hotelId?.name || '-'
    },
    {
      field: 'checkInDate',
      header: 'Check-in Date',
      sortable: true,
      body: (row) => row.checkInDate ? new Date(row.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      body: (row) => {
        const meta = statusMeta[row.status];
        return <span className={`status-badge ${meta?.cls}`}>{meta?.label}</span>;
      }
    },
    {
      field: 'actions',
      header: 'Actions',
      body: (row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            icon="pi pi-eye"
            size="small"
            outlined
            onClick={() => { setSelected(row); setViewVisible(true); }}
            tooltip="View"
            tooltipOptions={{ position: 'top' }}
          />
          {row.status === 0 && (
            <Button
              icon="pi pi-times"
              size="small"
              outlined
              severity="danger"
              onClick={() => handleCancel(row)}
              tooltip="Cancel"
              tooltipOptions={{ position: 'top' }}
            />
          )}
        </div>
      )
    }
  ];

  const downloadButton = (
    <Button
      label="Download"
      icon="pi pi-download"
      outlined
      severity="success"
      onClick={() => downloadBookings(activeFilters)}
    />
  );

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog />
      <ReusableFilter config={filterConfig} onApply={handleApply} onClear={handleClear} extraButtons={downloadButton} />
      <ReusableTable
        title="Bookings"
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      <Dialog
        header="Booking Details"
        visible={viewVisible}
        onHide={() => setViewVisible(false)}
        style={{ width: 520 }}
      >
        {selected && (
          <div className="dialog-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Guest Name</span>
                <span className="detail-value">{selected.userId?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{selected.userId?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{selected.userId?.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hotel</span>
                <span className="detail-value">{selected.hotelId?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">City</span>
                <span className="detail-value">{selected.hotelId?.city}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Check-in Date</span>
                <span className="detail-value">{selected.checkInDate ? new Date(selected.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Guests</span>
                <span className="detail-value">{selected.numberOfGuests}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${statusMeta[selected.status]?.cls}`}>{statusMeta[selected.status]?.label}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Special Requests</span>
                <span className="detail-value">{selected.specialRequests || 'None'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Booking Date</span>
                <span className="detail-value">{selected.bookingDate ? new Date(selected.bookingDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}</span>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
