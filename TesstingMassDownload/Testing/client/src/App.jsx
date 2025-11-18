import React, { useState } from 'react';
import './App.css';

function App() {
  const [referenceId, setReferenceId] = useState('');
  const [startBillNo, setStartBillNo] = useState('');
  const [endBillNo, setEndBillNo] = useState('');
  const [randomBillNos, setRandomBillNos] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [failedDownloads, setFailedDownloads] = useState([]);
  const [foundDocuments, setFoundDocuments] = useState([]);

  // NEW FUNCTION: Check reference number
  const checkReference = async () => {
    if (!referenceId.trim()) {
      setMessage('❗ Please enter a reference ID');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:3008/api/check-reference?referenceId=${encodeURIComponent(referenceId)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check reference');
      }

      if (data.billingDocuments.length === 0) {
        setMessage('No billing documents found for this reference');
      } else {
        setFoundDocuments(data.billingDocuments);
        setMessage(`Found ${data.billingDocuments.length} billing documents`);
        // Auto-populate the random documents field
        setRandomBillNos(data.billingDocuments.join(', '));
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // YOUR EXISTING DOWNLOAD FUNCTION (NO CHANGES)
  const downloadPDFs = async () => {
    if (!startBillNo && !endBillNo && !randomBillNos) {
      setMessage('❗ Please enter billing document numbers');
      return;
    }

    setLoading(true);
    setMessage('');
    setFailedDownloads([]);
    setProgress({ current: 0, total: 0 });

    try {
      const randomNumbers = randomBillNos.split(/[,|\n]+/)
        .map(doc => doc.trim())
        .filter(doc => doc.length > 0);

      const response = await fetch('/api/downloadBillingPDFs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startBillNo,
          endBillNo,
          billingDocuments: randomNumbers,
          downloadAsZip: true
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to download PDFs');
      }

      setProgress({ current: data.results.length, total: data.results.length });

      if (data.zipFile) {
        const link = document.createElement('a');
        link.href = `data:application/zip;base64,${data.zipFile}`;
        link.download = 'BillingDocuments.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const failed = data.results.filter(r => !r.success);
        setFailedDownloads(failed);
        
        if (failed.length === 0) {
          setMessage(`✅ Successfully downloaded ZIP with ${data.results.length} documents`);
        } else {
          setMessage(
            `✅ Downloaded ZIP with ${data.results.length - failed.length} documents. ` +
            `${failed.length} failed to include in ZIP.`
          );
        }
      } else {
        throw new Error('ZIP file not received from server');
      }
    } catch (error) {
      console.error('Download error:', error);
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message.includes('Server returned')) {
        errorMessage = 'Server error - please try again later';
      }
      
      setMessage(`❌ Error: ${errorMessage}`);
      setFailedDownloads([{ documentNumber: 'All documents', error: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  // YOUR EXISTING retryFailedDownloads FUNCTION (NO CHANGES)
  const retryFailedDownloads = async () => {
    if (failedDownloads.length === 0) return;
    
    setRandomBillNos(failedDownloads
      .filter(f => f.documentNumber !== 'All documents')
      .map(f => f.documentNumber)
      .join(', '));
    setStartBillNo('');
    setEndBillNo('');
    await downloadPDFs();
  };

  return (
    <div className="container">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqNwcAqVQ99H8d89-LsqsG30Q6YN-9PmfY1V4hN5YpwVPvTrt5jLeCi3QEw9C5RNwMDPE&usqp=CAU"
        alt="logo"
        height="70"
        width="130"
      />
      <h1>Billing Document PDF Downloader</h1>
      
      {/* NEW REFERENCE CHECK SECTION */}
      <div className="form-section">
        <h3>Check by Reference Number</h3>
        <div className="input-group">
          <label htmlFor="referenceId">Reference ID</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              id="referenceId"
              type="text"
              placeholder="Enter reference number"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button 
              onClick={checkReference}
              disabled={loading}
              className="check-button"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>
        {foundDocuments.length > 0 && (
          <div className="found-documents">
            <p>Found Documents:</p>
            <div className="document-list">
              {foundDocuments.map((doc, index) => (
                <span key={index} className="document-tag">{doc}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* YOUR EXISTING UI BELOW - NO CHANGES */}
      <div className="form-section">
        <h3>Download by Range</h3>
        <div className="form-group">
          <div className="input-group">
            <label htmlFor="startBillNo">Start Billing Number</label>
            <input
              id="startBillNo"
              type="text"
              placeholder="Start Billing Num Range"
              value={startBillNo}
              onChange={(e) => setStartBillNo(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="endBillNo">End Billing Number</label>
            <input
              id="endBillNo"
              type="text"
              placeholder="End Billing Num Range"
              value={endBillNo}
              onChange={(e) => setEndBillNo(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Download Documents</h3>
        <div className="input-group">
          <label htmlFor="randomBillNos">Document Numbers (comma or newline separated)</label>
          <textarea
            id="randomBillNos"
            placeholder="e.g. MI25100001, 90000234, AB12345678"
            value={randomBillNos}
            onChange={(e) => setRandomBillNos(e.target.value)}
            disabled={loading}
            rows={4}
          />
        </div>
      </div>
      
      <div className="button-group">
        <button 
          onClick={downloadPDFs} 
          disabled={loading || (!startBillNo && !endBillNo && !randomBillNos)}
          className="download-button"
        >
          {loading ? 'Processing...' : 'Download PDFs'}
        </button>
        
        {failedDownloads.length > 0 && (
          <button 
            onClick={retryFailedDownloads}
            className="retry-button"
            disabled={loading}
          >
            Retry Failed ({failedDownloads.length})
          </button>
        )}
      </div>

      {progress && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Processed {progress.current} of {progress.total} documents
          </div>
        </div>
      )}

      {message && (
        <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}

      {failedDownloads.length > 0 && (
        <div className="failed-downloads">
          <h3>Failed Downloads:</h3>
          <ul>
            {failedDownloads.map((item, index) => (
              <li key={index}>
                <strong>{item.documentNumber}</strong>: {item.error || 'Unknown error'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="loading-info">
          <p>Processing your documents. This may take some time for large batches.</p>
          <p>Please keep this window open until download completes.</p>
        </div>
      )}
    </div>
  );
}

export default App;