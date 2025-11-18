import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ReportScreen = () => {
  const [gateEntries, setGateEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: '',
    status: '',
    supplier: '',
    plant: '',
    searchText: '',
    active: '',
    canceled: ''
  });

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Available options for filters
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    suppliers: [],
    plants: []
  });

  // Function to parse Microsoft JSON Date format
  const parseSAPDate = (sapDate) => {
    if (!sapDate) return null;
    
    if (typeof sapDate === 'string' && sapDate.startsWith('/Date(')) {
      const timestampMatch = sapDate.match(/\/Date\((\d+)\)\//) || sapDate.match(/\/Date\((\d+)\+\d+\)\//);
      if (timestampMatch && timestampMatch[1]) {
        return new Date(parseInt(timestampMatch[1]));
      }
    }
    
    try {
      return new Date(sapDate);
    } catch {
      return null;
    }
  };

  // Fetch data
  const fetchReportData = async () => {
    try {
      console.log('📊 Fetching report data...');
      const API_BASE = 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/gate-entries`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGateEntries(data);
      setFilteredEntries(data);
      
      // Extract filter options from data
      extractFilterOptions(data);
      
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching report data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique values for filters
  const extractFilterOptions = (data) => {
    const statuses = [...new Set(data.map(entry => entry.statusText).filter(Boolean))];
    const suppliers = [...new Set(data.map(entry => entry.supplierName).filter(Boolean))];
    const plants = [...new Set(data.map(entry => entry.plant).filter(Boolean))];
    
    setFilterOptions({
      statuses,
      suppliers,
      plants
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...gateEntries];

    // Date range filter
    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(entry => {
        const entryDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
        if (!entryDate) return false;
        
        const entryDateStr = entryDate.toISOString().split('T')[0];
        return entryDateStr >= dateRange.startDate && entryDateStr <= dateRange.endDate;
      });
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(entry => entry.statusText === filters.status);
    }

    // Supplier filter
    if (filters.supplier) {
      filtered = filtered.filter(entry => entry.supplierName === filters.supplier);
    }

    // Plant filter
    if (filters.plant) {
      filtered = filtered.filter(entry => entry.plant === filters.plant);
    }

    // Active filter
    if (filters.active !== '') {
      filtered = filtered.filter(entry => entry.active === (filters.active === 'true'));
    }

    // Canceled filter
    if (filters.canceled !== '') {
      filtered = filtered.filter(entry => entry.canceled === (filters.canceled === 'YES' ? 'YES' : ''));
    }

    // Search text filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(entry =>
        (entry.spaceMatrixNumber && entry.spaceMatrixNumber.toLowerCase().includes(searchLower)) ||
        (entry.poNumber && entry.poNumber.toLowerCase().includes(searchLower)) ||
        (entry.supplierName && entry.supplierName.toLowerCase().includes(searchLower)) ||
        (entry.spaceMatrixName && entry.spaceMatrixName.toLowerCase().includes(searchLower))
      );
    }

    setFilteredEntries(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateRange: '',
      status: '',
      supplier: '',
      plant: '',
      searchText: '',
      active: '',
      canceled: ''
    });
    setDateRange({
      startDate: '',
      endDate: ''
    });
    setFilteredEntries(gateEntries);
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredEntries.map(entry => {
        const creationDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
        const lastChanged = parseSAPDate(entry.lastChanged);
        
        return {
          'Space Matrix Number': entry.spaceMatrixNumber || '',
          'Space Matrix Name': entry.spaceMatrixName || '',
          'Description': entry.description || '',
          'PO Number': entry.poNumber || '',
          'Invoice Number': entry.invoiceNumber || '',
          'Supplier Code': entry.supplierCode || '',
          'Supplier Name': entry.supplierName || '',
          'Plant': entry.plant || '',
          'Status': entry.statusText || '',
          'Active': entry.active ? 'Yes' : 'No',
          'Canceled': entry.canceled || 'No',
          'Created By': entry.createdBy || '',
          'Creation Date': creationDate ? creationDate.toLocaleDateString() : '',
          'Creation Time': creationDate ? creationDate.toLocaleTimeString() : '',
          'Last Changed': lastChanged ? lastChanged.toLocaleString() : '',
          'Entry Time': entry.entryTime || ''
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Gate Entries Report');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Gate_Entries_Report_${timestamp}.xlsx`;

      // Export to Excel
      XLSX.writeFile(wb, filename);
      
      console.log(`✅ Excel file exported: ${filename}`);
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      alert('Error exporting to Excel. Please try again.');
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    try {
      const csvData = filteredEntries.map(entry => {
        const creationDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
        return [
          entry.spaceMatrixNumber || '',
          entry.spaceMatrixName || '',
          entry.poNumber || '',
          entry.supplierName || '',
          entry.statusText || '',
          entry.active ? 'Yes' : 'No',
          entry.canceled || 'No',
          creationDate ? creationDate.toLocaleDateString() : '',
          entry.createdBy || ''
        ].join(',');
      });

      const headers = 'Space Matrix Number,Space Matrix Name,PO Number,Supplier Name,Status,Active,Canceled,Creation Date,Created By\n';
      const csvContent = headers + csvData.join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Gate_Entries_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ CSV file exported');
    } catch (error) {
      console.error('❌ Error exporting to CSV:', error);
      alert('Error exporting to CSV. Please try again.');
    }
  };

  // Apply filters when filter state changes
  useEffect(() => {
    if (gateEntries.length > 0) {
      applyFilters();
    }
  }, [filters, dateRange, gateEntries]);

  // Initial data load
  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>📊 Gate Entries Report</h2>
        <div>Loading report data...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>📊 Gate Entries Report</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Total: {gateEntries.length} entries • Filtered: {filteredEntries.length} entries
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={exportToCSV}
            style={{
              padding: '10px 16px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            📥 Export CSV
          </button>
          
          <button 
            onClick={exportToExcel}
            style={{
              padding: '10px 16px',
              background: '#217346',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            📊 Export Excel
          </button>
          
          <button 
            onClick={resetFilters}
            style={{
              padding: '10px 16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            🔄 Reset Filters
          </button>
          
          <button 
            onClick={fetchReportData}
            style={{
              padding: '10px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            🔃 Refresh Data
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ 
          padding: '15px', 
          background: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '6px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Filters Section */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🔍 Filters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {/* Search Text */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by PO, Supplier, Matrix..."
              value={filters.searchText}
              onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            />
          </div>

          {/* Date Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Supplier Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Supplier
            </label>
            <select
              value={filters.supplier}
              onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              <option value="">All Suppliers</option>
              {filterOptions.suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          {/* Active Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Active
            </label>
            <select
              value={filters.active}
              onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              <option value="">All</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>
          </div>

          {/* Canceled Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9em' }}>
              Canceled
            </label>
            <select
              value={filters.canceled}
              onChange={(e) => setFilters(prev => ({ ...prev, canceled: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9em'
              }}
            >
              <option value="">All</option>
              <option value="YES">Canceled Only</option>
              <option value="NO">Not Canceled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '15px 20px', 
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>
            📋 Results ({filteredEntries.length} entries)
          </h3>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Matrix No.</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>PO Number</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Supplier</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Active</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Canceled</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Created Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6', fontWeight: '600' }}>Created By</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry, index) => {
                  const creationDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
                  
                  return (
                    <tr 
                      key={entry.id} 
                      style={{ 
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8f9fa',
                        borderBottom: '1px solid #dee2e6'
                      }}
                    >
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <strong>{entry.spaceMatrixNumber || 'N/A'}</strong>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {entry.poNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {entry.supplierName || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8em',
                          fontWeight: '500',
                          backgroundColor: entry.statusText === 'Active' ? '#d4edda' : '#f8d7da',
                          color: entry.statusText === 'Active' ? '#155724' : '#721c24'
                        }}>
                          {entry.statusText || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          color: entry.active ? '#28a745' : '#dc3545',
                          fontWeight: '500'
                        }}>
                          {entry.active ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <span style={{
                          color: entry.canceled === 'YES' ? '#dc3545' : '#28a745',
                          fontWeight: '500'
                        }}>
                          {entry.canceled === 'YES' ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {creationDate ? creationDate.toLocaleDateString() : 'N/A'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        {entry.createdBy || 'N/A'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    No entries found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportScreen;