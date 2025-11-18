import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FiDownload, FiFilter, FiSearch, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function CollectionReport() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [filters, setFilters] = useState({
    companyCode: '',
    customerName: '',
    fiscalYear: '',
    glAccount: '',
    accountingDocument: '',
    clearingDocument: '',
    postingDateFrom: '',
    postingDateTo: '',
    documentDateFrom: '',
    documentDateTo: '',
    currency: '',
    amountFrom: '',
    amountTo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filtered.length > 0) {
      groupByAccountingDocument();
    }
  }, [filtered]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3111/api/collections');
      const collection = res.data.d?.results || res.data || [];
      setData(collection);
      setFiltered(collection);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupByAccountingDocument = () => {
    const groups = {};
    filtered.forEach(item => {
      const docNum = item.AccountingDocumentNumber || 'UNKNOWN';
      if (!groups[docNum]) {
        groups[docNum] = {
          header: {
            ...item,
            isHeader: true,
            totalAmount: 0
          },
          items: []
        };
      }
      groups[docNum].items.push(item);
      groups[docNum].header.totalAmount += parseFloat(item.AmountInTransCrcy || 0);
    });
    setGroupedData(Object.values(groups));
  };

  const toggleGroup = (docNumber) => {
    setExpandedGroups(prev => ({
      ...prev,
      [docNumber]: !prev[docNumber]
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let temp = [...data];
    
    if (filters.companyCode) {
      temp = temp.filter(item => 
        item.CompanyCode?.toString().toLowerCase().includes(filters.companyCode.toLowerCase())
      );
    }
    
    if (filters.customerName) {
      temp = temp.filter(item => 
        item.CustomerName?.toString().toLowerCase().includes(filters.customerName.toLowerCase())
      );
    }
    
    if (filters.fiscalYear) {
      temp = temp.filter(item => 
        item.FiscalYear?.toString() === filters.fiscalYear
      );
    }
    
    if (filters.glAccount) {
      temp = temp.filter(item => 
        item.GLAccount?.toString().toLowerCase().includes(filters.glAccount.toLowerCase())
      );
    }
    
    if (filters.accountingDocument) {
      temp = temp.filter(item => 
        item.AccountingDocumentNumber?.toString() === filters.accountingDocument
      );
    }
    
    if (filters.clearingDocument) {
      temp = temp.filter(item => 
        item.ClearingDocument?.toString() === filters.clearingDocument
      );
    }
    
    if (filters.postingDateFrom) {
      temp = temp.filter(item => 
        new Date(item.PostingDate) >= new Date(filters.postingDateFrom)
      );
    }
    
    if (filters.postingDateTo) {
      temp = temp.filter(item => 
        new Date(item.PostingDate) <= new Date(filters.postingDateTo)
      );
    }
    
    if (filters.documentDateFrom) {
      temp = temp.filter(item => 
        new Date(item.DocumentDate) >= new Date(filters.documentDateFrom)
      );
    }
    
    if (filters.documentDateTo) {
      temp = temp.filter(item => 
        new Date(item.DocumentDate) <= new Date(filters.documentDateTo)
      );
    }
    
    if (filters.currency) {
      temp = temp.filter(item => 
        item.Currency?.toString().toLowerCase() === filters.currency.toLowerCase()
      );
    }
    
    if (filters.amountFrom) {
      const amount = parseFloat(filters.amountFrom);
      temp = temp.filter(item => 
        parseFloat(item.AmountInTransCrcy) >= amount
      );
    }
    
    if (filters.amountTo) {
      const amount = parseFloat(filters.amountTo);
      temp = temp.filter(item => 
        parseFloat(item.AmountInTransCrcy) <= amount
      );
    }
    
    setFiltered(temp);
  };

  const resetFilters = () => {
    setFilters({
      companyCode: '',
      customerName: '',
      fiscalYear: '',
      glAccount: '',
      accountingDocument: '',
      clearingDocument: '',
      postingDateFrom: '',
      postingDateTo: '',
      documentDateFrom: '',
      documentDateTo: '',
      currency: '',
      amountFrom: '',
      amountTo: ''
    });
    setFiltered(data);
  };

  const exportToExcel = () => {
    const exportData = groupedData.flatMap(group => [
      { ...group.header, isTotal: true },
      ...(expandedGroups[group.header.AccountingDocumentNumber] ? group.items : [])
    ]);
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Collections');
    XLSX.writeFile(wb, `Collections_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const formatCurrency = (amount, currency) => {
    if (amount === null || amount === undefined) return '-';
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
    }
  };

  return (
    <div className="report-container">
      <style jsx>{`
        .report-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          min-height: 100vh;
          padding: 20px;
        }
        
        .report-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .report-header {
          background: linear-gradient(to right, #1e3a8a, #2563eb);
          color: white;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .report-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        
        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
        }
        
        .primary-button {
          background-color: #2563eb;
          color: white;
        }
        
        .primary-button:hover {
          background-color: #1d4ed8;
        }
        
        .secondary-button {
          background-color: white;
          color: #2563eb;
          border: 1px solid #d1d5db;
        }
        
        .secondary-button:hover {
          background-color: #f3f4f6;
        }
        
        .filter-panel {
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }
        
        .filter-group {
          display: flex;
          gap: 8px;
        }
        
        .filter-label {
          display: block;
          margin-bottom: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .filter-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }
        
        .filter-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        
        .date-range-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }
        
        .table-header {
          background-color: #f3f4f6;
          color: #374151;
          text-align: left;
          font-weight: 500;
        }
        
        .table-header th {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table-row {
          border-bottom: 1px solid #e5e7eb;
        }
        
        .table-row td {
          padding: 12px 16px;
          vertical-align: top;
        }
        
        .document-header {
          background-color: #e0e7ff;
          font-weight: 500;
        }
        
        .document-header td {
          padding: 12px 16px;
          cursor: pointer;
        }
        
        .document-item {
          background-color: white;
        }
        
        .document-total {
          background-color: #f0fdf4;
          font-weight: 500;
        }
        
        .amount-positive {
          color: #16a34a;
        }
        
        .amount-negative {
          color: #dc2626;
        }
        
        .expand-icon {
          transition: transform 0.2s;
        }
        
        .expanded .expand-icon {
          transform: rotate(180deg);
        }
        
        .loading-spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .footer {
          padding: 16px 24px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>

      <div className="report-card">
        {/* Header */}
        <div className="report-header">
          <h1 className="report-title">Collections Report</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="action-button secondary-button"
            >
              <FiFilter size={18} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button 
              onClick={exportToExcel}
              className="action-button primary-button"
            >
              <FiDownload size={18} />
              Export Excel
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filter-panel">
            <div className="filter-grid">
              <div>
                <label className="filter-label">Company Code</label>
                <input
                  type="text"
                  name="companyCode"
                  value={filters.companyCode}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter company code"
                />
              </div>
              <div>
                <label className="filter-label">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={filters.customerName}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="filter-label">Fiscal Year</label>
                <input
                  type="text"
                  name="fiscalYear"
                  value={filters.fiscalYear}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter fiscal year"
                />
              </div>
              <div>
                <label className="filter-label">GL Account</label>
                <input
                  type="text"
                  name="glAccount"
                  value={filters.glAccount}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter GL account"
                />
              </div>
              <div>
                <label className="filter-label">Accounting Document</label>
                <input
                  type="text"
                  name="accountingDocument"
                  value={filters.accountingDocument}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter document number"
                />
              </div>
              <div>
                <label className="filter-label">Clearing Document</label>
                <input
                  type="text"
                  name="clearingDocument"
                  value={filters.clearingDocument}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter clearing doc"
                />
              </div>
              <div>
                <label className="filter-label">Currency</label>
                <input
                  type="text"
                  name="currency"
                  value={filters.currency}
                  onChange={handleFilterChange}
                  className="filter-input"
                  placeholder="Enter currency"
                />
              </div>
              <div className="date-range-group">
                <div>
                  <label className="filter-label">Posting Date From</label>
                  <input
                    type="date"
                    name="postingDateFrom"
                    value={filters.postingDateFrom}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
                <div>
                  <label className="filter-label">Posting Date To</label>
                  <input
                    type="date"
                    name="postingDateTo"
                    value={filters.postingDateTo}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>
              <div className="date-range-group">
                <div>
                  <label className="filter-label">Document Date From</label>
                  <input
                    type="date"
                    name="documentDateFrom"
                    value={filters.documentDateFrom}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
                <div>
                  <label className="filter-label">Document Date To</label>
                  <input
                    type="date"
                    name="documentDateTo"
                    value={filters.documentDateTo}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>
              <div className="date-range-group">
                <div>
                  <label className="filter-label">Amount From</label>
                  <input
                    type="number"
                    name="amountFrom"
                    value={filters.amountFrom}
                    onChange={handleFilterChange}
                    className="filter-input"
                    placeholder="Min amount"
                  />
                </div>
                <div>
                  <label className="filter-label">Amount To</label>
                  <input
                    type="number"
                    name="amountTo"
                    value={filters.amountTo}
                    onChange={handleFilterChange}
                    className="filter-input"
                    placeholder="Max amount"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={resetFilters}
                className="action-button secondary-button"
              >
                Reset Filters
              </button>
              <button
                onClick={applyFilters}
                className="action-button primary-button"
              >
                <FiSearch size={18} />
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="table-container">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <FiRefreshCw className="loading-spinner" size={24} />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : (
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th>Doc. Number</th>
                  <th>Company</th>
                  <th>Customer</th>
                  <th>Fiscal Year</th>
                  <th>GL Account</th>
                  <th>Posting Date</th>
                  <th>Document Date</th>
                  <th>Currency</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.length > 0 ? (
                  groupedData.map((group, index) => {
                    const isExpanded = expandedGroups[group.header.AccountingDocumentNumber];
                    return (
                      <React.Fragment key={index}>
                        {/* Document Header */}
                        <tr 
                          className={`document-header ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => toggleGroup(group.header.AccountingDocumentNumber)}
                        >
                          <td>
                            <div className="flex items-center gap-2">
                              {group.header.AccountingDocumentNumber || '-'}
                              <FiChevronDown className="expand-icon" size={18} />
                            </div>
                          </td>
                          <td>{group.header.CompanyCode || '-'}</td>
                          <td>{group.header.CustomerName || '-'}</td>
                          <td>{group.header.FiscalYear || '-'}</td>
                          <td>{group.header.GLAccount || '-'}</td>
                          <td>{formatDate(group.header.PostingDate)}</td>
                          <td>{formatDate(group.header.DocumentDate)}</td>
                          <td>{group.header.Currency || '-'}</td>
                          <td className={group.header.totalAmount >= 0 ? 'amount-positive' : 'amount-negative'}>
                            {formatCurrency(group.header.totalAmount, group.header.Currency)}
                          </td>
                        </tr>
                        
                        {/* Document Items (if expanded) */}
                        {isExpanded && group.items.map((item, itemIndex) => (
                          <tr key={itemIndex} className="document-item">
                            <td></td>
                            <td>{item.CompanyCode || '-'}</td>
                            <td>{item.CustomerName || '-'}</td>
                            <td>{item.FiscalYear || '-'}</td>
                            <td>{item.GLAccount || '-'}</td>
                            <td>{formatDate(item.PostingDate)}</td>
                            <td>{formatDate(item.DocumentDate)}</td>
                            <td>{item.Currency || '-'}</td>
                            <td className={item.AmountInTransCrcy >= 0 ? 'amount-positive' : 'amount-negative'}>
                              {formatCurrency(item.AmountInTransCrcy, item.Currency)}
                              {itemIndex === 0 && item.AMOUNTTRANSCURR_DZ_CAL && (
                                <span className="ml-2 text-xs text-gray-500">(DZ Calculated: {formatCurrency(item.AMOUNTTRANSCURR_DZ_CAL, item.Currency)})</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4 text-gray-500">
                      {data.length === 0 ? 'No data available' : 'No records match your filters'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <div>
            Showing {filtered.length} of {data.length} records
          </div>
          <div>
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}