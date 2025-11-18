// import React, { useState, useEffect } from 'react';
// //import { api } from "../api";


// const Dashboard = () => {
//   const [gateEntries, setGateEntries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   // Fetch data function
//   const fetchDashboardData = async () => {
//     try {
//       console.log('🔄 Fetching dashboard data...');
//               const API_BASE = 'http://localhost:5000'; // adjust if your backend uses different port
//         const response = await fetch(`${API_BASE}/api/gate-entries`);
// //      const response = await fetch('/api/gate-entries/dashboard');
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setGateEntries(data);
//       setLastUpdate(new Date());
//       setError(null);
//       console.log(`✅ Loaded ${data.length} entries`);
//     } catch (err) {
//       console.error('❌ Error fetching dashboard data:', err);
//       setError(`Failed to load data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-refresh every 1 minute (60000 milliseconds)
//   useEffect(() => {
//     // Initial load
//     fetchDashboardData();

//     // Set up interval for auto-refresh
//     const interval = setInterval(fetchDashboardData, 60000); // 1 minute

//     // Cleanup on component unmount
//     return () => {
//       console.log('🧹 Cleaning up dashboard interval');
//       clearInterval(interval);
//     };
//   }, []);

//   // Manual refresh function
//   const handleManualRefresh = () => {
//     setLoading(true);
//     fetchDashboardData();
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h2>📊 Gate Entries Dashboard</h2>
//         <div>Loading gate entries...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       {/* Header with refresh controls */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         marginBottom: '20px',
//         flexWrap: 'wrap',
//         gap: '10px'
//       }}>
//         <h2 style={{ margin: 0 }}>📊 Gate Entries Dashboard</h2>
        
//         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//           {/* Last update time */}
//           {lastUpdate && (
//             <div style={{ fontSize: '0.9em', color: '#666' }}>
//               Last updated: {lastUpdate.toLocaleTimeString()}
//             </div>
//           )}
          
//           {/* Auto-refresh indicator */}
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: '5px',
//             padding: '4px 8px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             borderRadius: '4px',
//             fontSize: '0.8em'
//           }}>
//             <div style={{
//               width: '8px',
//               height: '8px',
//               backgroundColor: 'white',
//               borderRadius: '50%',
//               animation: 'pulse 2s infinite'
//             }}></div>
//             Auto-refresh: 1min
//           </div>

//           {/* Manual refresh button */}
//           <button 
//             onClick={handleManualRefresh}
//             style={{
//               padding: '8px 16px',
//               background: '#007acc',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '0.9em'
//             }}
//           >
//             🔄 Refresh Now
//           </button>
//         </div>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div style={{ 
//           padding: '10px', 
//           background: '#ffebee', 
//           border: '1px solid #ffcdd2',
//           borderRadius: '4px',
//           marginBottom: '20px',
//           color: '#c62828'
//         }}>
//           ⚠️ {error}
//         </div>
//       )}

//       {/* Summary stats */}
//       <div style={{ 
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: '15px',
//         marginBottom: '20px'
//       }}>
//         <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
//             {gateEntries.length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Total Entries</div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2e7d32' }}>
//             {gateEntries.filter(entry => entry.active).length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Active</div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ef6c00' }}>
//             {gateEntries.filter(entry => entry.canceled).length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Canceled</div>
//         </div>
//       </div>

//       {/* Entries grid */}
//       <div style={{ 
//         display: 'grid', 
//         gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
//         gap: '20px' 
//       }}>
//         {gateEntries.length > 0 ? (
//           gateEntries.map(entry => (
//             <div 
//               key={entry.id}
//               style={{
//                 border: '1px solid #ddd',
//                 padding: '15px',
//                 borderRadius: '8px',
//                 backgroundColor: '#f9f9f9',
//                 boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//               }}
//             >
//               <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
//                 {entry.spaceMatrixNumber || 'N/A'}
//               </h3>
//               <p style={{ margin: '5px 0' }}><strong>PO:</strong> {entry.poNumber || 'N/A'}</p>
//               <p style={{ margin: '5px 0' }}><strong>Supplier:</strong> {entry.supplierName || 'N/A'}</p>
//               <p style={{ margin: '5px 0' }}><strong>Status:</strong> {entry.statusText || 'N/A'}</p>
//               <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
//                 <strong>Updated:</strong> {entry.lastChanged ? new Date(entry.lastChanged).toLocaleString() : 'N/A'}
//               </p>
//               <div style={{ 
//                 display: 'flex', 
//                 gap: '5px', 
//                 marginTop: '10px',
//                 fontSize: '0.7em'
//               }}>
//                 {entry.active && (
//                   <span style={{ padding: '2px 6px', background: '#4CAF50', color: 'white', borderRadius: '3px' }}>
//                     Active
//                   </span>
//                 )}
//                 {entry.canceled && (
//                   <span style={{ padding: '2px 6px', background: '#f44336', color: 'white', borderRadius: '3px' }}>
//                     Canceled
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
//             No gate entries found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Add CSS for pulse animation
// const styles = `
// @keyframes pulse {
//   0% { opacity: 1; }
//   50% { opacity: 0.5; }
//   100% { opacity: 1; }
// }
// `;

// // Inject styles
// const styleSheet = document.createElement('style');
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

// export default Dashboard;




//Second Version Code Working fine Day not coming properly 



// import React, { useState, useEffect } from 'react';

// const Dashboard = () => {
//   const [gateEntries, setGateEntries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [lastUpdate, setLastUpdate] = useState(null);
//   const [currentDay, setCurrentDay] = useState(new Date().toDateString());
//   const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

//   // Calculate time until next midnight
//   const calculateTimeUntilMidnight = () => {
//     const now = new Date();
//     const midnight = new Date();
//     midnight.setHours(24, 0, 0, 0); // Next midnight
//     const diff = midnight - now;
    
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   // Check if day changed (runs every minute)
//   const checkDayChange = () => {
//     const today = new Date().toDateString();
//     if (today !== currentDay) {
//       console.log('🔄 Day changed! Updating day status...');
//       setCurrentDay(today);
//       // Optional: Refresh data when day changes
//       fetchDashboardData();
//     }
//     setTimeUntilMidnight(calculateTimeUntilMidnight());
//   };

//   // Fetch data function
//   const fetchDashboardData = async () => {
//     try {
//       console.log('🔄 Fetching dashboard data...');
//       const API_BASE = 'http://localhost:5000';
//       const response = await fetch(`${API_BASE}/api/gate-entries`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setGateEntries(data);
//       setLastUpdate(new Date());
//       setError(null);
//       console.log(`✅ Loaded ${data.length} entries`);
//     } catch (err) {
//       console.error('❌ Error fetching dashboard data:', err);
//       setError(`Failed to load data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate today's entries
//   const getTodayEntries = () => {
//     const today = new Date().toDateString();
//     return gateEntries.filter(entry => {
//       if (!entry.creationDate) return false;
//       const entryDate = new Date(entry.creationDate).toDateString();
//       return entryDate === today;
//     });
//   };

//   // Calculate yesterday's entries
//   const getYesterdayEntries = () => {
//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);
//     const yesterdayString = yesterday.toDateString();
    
//     return gateEntries.filter(entry => {
//       if (!entry.creationDate) return false;
//       const entryDate = new Date(entry.creationDate).toDateString();
//       return entryDate === yesterdayString;
//     });
//   };

//   // Auto-refresh every 1 minute + day change monitoring
//   useEffect(() => {
//     // Initial load
//     fetchDashboardData();
//     checkDayChange();

//     // Set up interval for auto-refresh (1 minute)
//     const dataInterval = setInterval(fetchDashboardData, 60000);
    
//     // Set up interval for day change check (every minute)
//     const dayCheckInterval = setInterval(checkDayChange, 60000);
    
//     // Set up interval for midnight countdown (every second)
//     const midnightInterval = setInterval(() => {
//       setTimeUntilMidnight(calculateTimeUntilMidnight());
//     }, 1000);

//     // Cleanup on component unmount
//     return () => {
//       console.log('🧹 Cleaning up dashboard intervals');
//       clearInterval(dataInterval);
//       clearInterval(dayCheckInterval);
//       clearInterval(midnightInterval);
//     };
//   }, [currentDay]);

//   // Manual refresh function
//   const handleManualRefresh = () => {
//     setLoading(true);
//     fetchDashboardData();
//   };

//   const todayEntries = getTodayEntries();
//   const yesterdayEntries = getYesterdayEntries();

//   if (loading) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <h2>📊 Gate Entries Dashboard</h2>
//         <div>Loading gate entries...</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: '20px' }}>
//       {/* Header with refresh controls */}
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center', 
//         marginBottom: '20px',
//         flexWrap: 'wrap',
//         gap: '10px'
//       }}>
//         <div>
//           <h2 style={{ margin: 0 }}>📊 Gate Entries Dashboard</h2>
//           <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
//             {currentDay} • Next update: {timeUntilMidnight}
//           </div>
//         </div>
        
//         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//           {/* Last update time */}
//           {lastUpdate && (
//             <div style={{ fontSize: '0.9em', color: '#666' }}>
//               Data updated: {lastUpdate.toLocaleTimeString()}
//             </div>
//           )}
          
//           {/* Auto-refresh indicator */}
//           <div style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             gap: '5px',
//             padding: '4px 8px',
//             backgroundColor: '#4CAF50',
//             color: 'white',
//             borderRadius: '4px',
//             fontSize: '0.8em'
//           }}>
//             <div style={{
//               width: '8px',
//               height: '8px',
//               backgroundColor: 'white',
//               borderRadius: '50%',
//               animation: 'pulse 2s infinite'
//             }}></div>
//             Auto-refresh: 1min
//           </div>

//           {/* Manual refresh button */}
//           <button 
//             onClick={handleManualRefresh}
//             style={{
//               padding: '8px 16px',
//               background: '#007acc',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               fontSize: '0.9em'
//             }}
//           >
//             🔄 Refresh Now
//           </button>
//         </div>
//       </div>

//       {/* Error message */}
//       {error && (
//         <div style={{ 
//           padding: '10px', 
//           background: '#ffebee', 
//           border: '1px solid #ffcdd2',
//           borderRadius: '4px',
//           marginBottom: '20px',
//           color: '#c62828'
//         }}>
//           ⚠️ {error}
//         </div>
//       )}

//       {/* Day Status Summary */}
//       <div style={{ 
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//         gap: '15px',
//         marginBottom: '20px'
//       }}>
//         <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
//             {gateEntries.length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Total Entries</div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center', border: '2px solid #4CAF50' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2e7d32' }}>
//             {todayEntries.length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Today's Entries</div>
//           <div style={{ fontSize: '0.7em', color: '#4CAF50', marginTop: '5px' }}>
//             📅 {new Date().toLocaleDateString()}
//           </div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ef6c00' }}>
//             {yesterdayEntries.length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Yesterday's Entries</div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#f3e5f5', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#7b1fa2' }}>
//             {gateEntries.filter(entry => entry.active).length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Active</div>
//         </div>
        
//         <div style={{ padding: '15px', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
//           <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#c62828' }}>
//             {gateEntries.filter(entry => entry.canceled).length}
//           </div>
//           <div style={{ fontSize: '0.9em', color: '#666' }}>Canceled</div>
//         </div>
//       </div>

//       {/* Day Status Banner */}
//       <div style={{
//         padding: '10px 15px',
//         background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//         color: 'white',
//         borderRadius: '8px',
//         marginBottom: '20px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <div>
//           <strong>📅 {currentDay}</strong>
//           <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
//             {todayEntries.length} entries today • Auto-refresh at midnight
//           </div>
//         </div>
//         <div style={{ textAlign: 'right' }}>
//           <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Next day starts in</div>
//           <div style={{ fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'monospace' }}>
//             {timeUntilMidnight}
//           </div>
//         </div>
//       </div>

//       {/* Today's Entries Section */}
//       <div style={{ marginBottom: '30px' }}>
//         <h3 style={{ color: '#1976d2', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #1976d2' }}>
//           📋 Today's Gate Entries ({todayEntries.length})
//         </h3>
        
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
//           gap: '20px' 
//         }}>
//           {todayEntries.length > 0 ? (
//             todayEntries.map(entry => (
//               <EntryCard key={entry.id} entry={entry} highlightToday={true} />
//             ))
//           ) : (
//             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
//               No entries for today yet.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* All Entries Section */}
//       <div>
//         <h3 style={{ color: '#666', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #ddd' }}>
//           📋 All Gate Entries ({gateEntries.length})
//         </h3>
        
//         <div style={{ 
//           display: 'grid', 
//           gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
//           gap: '20px' 
//         }}>
//           {gateEntries.length > 0 ? (
//             gateEntries.map(entry => (
//               <EntryCard key={entry.id} entry={entry} />
//             ))
//           ) : (
//             <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
//               No gate entries found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Separate Entry Card Component for better organization
// const EntryCard = ({ entry, highlightToday = false }) => {
//   const isToday = () => {
//     if (!entry.creationDate) return false;
//     const entryDate = new Date(entry.creationDate).toDateString();
//     return entryDate === new Date().toDateString();
//   };

//   return (
//     <div 
//       style={{
//         border: `2px solid ${highlightToday ? '#4CAF50' : '#ddd'}`,
//         padding: '15px',
//         borderRadius: '8px',
//         backgroundColor: highlightToday ? '#f9fff9' : '#f9f9f9',
//         boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//         position: 'relative'
//       }}
//     >
//       {highlightToday && (
//         <div style={{
//           position: 'absolute',
//           top: '-10px',
//           right: '10px',
//           background: '#4CAF50',
//           color: 'white',
//           padding: '2px 8px',
//           borderRadius: '10px',
//           fontSize: '0.7em',
//           fontWeight: 'bold'
//         }}>
//           TODAY
//         </div>
//       )}
      
//       <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
//         {entry.spaceMatrixNumber || 'N/A'}
//       </h3>
//       <p style={{ margin: '5px 0' }}><strong>PO:</strong> {entry.poNumber || 'N/A'}</p>
//       <p style={{ margin: '5px 0' }}><strong>Supplier:</strong> {entry.supplierName || 'N/A'}</p>
//       <p style={{ margin: '5px 0' }}><strong>Status:</strong> {entry.statusText || 'N/A'}</p>
//       <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
//         <strong>Created:</strong> {entry.sapcreationdate ? new Date(entry.sapcreationdate).toLocaleString() : 'N/A'}
//       </p>
//       <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
//         <strong>Updated:</strong> {entry.lastChanged ? new Date(entry.lastChanged).toLocaleString() : 'N/A'}
//       </p>
//       <div style={{ 
//         display: 'flex', 
//         gap: '5px', 
//         marginTop: '10px',
//         fontSize: '0.7em'
//       }}>
//         {isToday() && (
//           <span style={{ padding: '2px 6px', background: '#4CAF50', color: 'white', borderRadius: '3px' }}>
//             Today
//           </span>
//         )}
//         {entry.active && (
//           <span style={{ padding: '2px 6px', background: '#2196F3', color: 'white', borderRadius: '3px' }}>
//             Active
//           </span>
//         )}
//         {entry.canceled && (
//           <span style={{ padding: '2px 6px', background: '#f44336', color: 'white', borderRadius: '3px' }}>
//             Canceled
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// // Add CSS for pulse animation
// const styles = `
// @keyframes pulse {
//   0% { opacity: 1; }
//   50% { opacity: 0.5; }
//   100% { opacity: 1; }
// }
// `;

// // Inject styles
// const styleSheet = document.createElement('style');
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);

// export default Dashboard;




//Days Checking Three
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [gateEntries, setGateEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().toDateString());
  const [timeUntilMidnight, setTimeUntilMidnight] = useState('');

  // Function to parse Microsoft JSON Date format
  const parseSAPDate = (sapDate) => {
    if (!sapDate) return null;
    
    // Handle Microsoft JSON Date format: /Date(timestamp)/
    if (typeof sapDate === 'string' && sapDate.startsWith('/Date(')) {
      const timestampMatch = sapDate.match(/\/Date\((\d+)\)\//);
      if (timestampMatch && timestampMatch[1]) {
        return new Date(parseInt(timestampMatch[1]));
      }
    }
    
    // Handle Microsoft JSON Date with timezone: /Date(timestamp+offset)/
    if (typeof sapDate === 'string' && sapDate.startsWith('/Date(') && sapDate.includes('+')) {
      const timestampMatch = sapDate.match(/\/Date\((\d+)\+\d+\)\//);
      if (timestampMatch && timestampMatch[1]) {
        return new Date(parseInt(timestampMatch[1]));
      }
    }
    
    // Try regular date parsing as fallback
    try {
      return new Date(sapDate);
    } catch {
      return null;
    }
  };

  // Calculate time until next midnight
  const calculateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if day changed
  const checkDayChange = () => {
    const today = new Date().toDateString();
    if (today !== currentDay) {
      console.log('🔄 Day changed! Updating day status...');
      setCurrentDay(today);
      fetchDashboardData();
    }
    setTimeUntilMidnight(calculateTimeUntilMidnight());
  };

  // Fetch data function
  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      const API_BASE = 'http://localhost:5000';
      const response = await fetch(`${API_BASE}/api/gate-entries`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setGateEntries(data);
      setLastUpdate(new Date());
      setError(null);
      console.log(`✅ Loaded ${data.length} entries`);
      
      // Debug: Check date parsing
      if (data.length > 0) {
        const sample = data[0];
        console.log('📅 Sample entry date debug:', {
          creationDate: sample.creationDate,
          parsedDate: parseSAPDate(sample.creationDate),
          sapcreationdate: sample.sapcreationdate,
          parsedSapDate: parseSAPDate(sample.sapcreationdate),
          today: new Date().toDateString()
        });
      }
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate today's entries - FIXED
  const getTodayEntries = () => {
    const today = new Date().toDateString();
    return gateEntries.filter(entry => {
      // Try multiple date fields
      const entryDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
      if (!entryDate) return false;
      
      const entryDateString = entryDate.toDateString();
      return entryDateString === today;
    });
  };

  // Calculate yesterday's entries - FIXED
  const getYesterdayEntries = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    return gateEntries.filter(entry => {
      const entryDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
      if (!entryDate) return false;
      
      const entryDateString = entryDate.toDateString();
      return entryDateString === yesterdayString;
    });
  };

  // Auto-refresh every 1 minute + day change monitoring
  useEffect(() => {
    // Initial load
    fetchDashboardData();
    checkDayChange();

    // Set up interval for auto-refresh (1 minute)
    const dataInterval = setInterval(fetchDashboardData, 60000);
    
    // Set up interval for day change check (every minute)
    const dayCheckInterval = setInterval(checkDayChange, 60000);
    
    // Set up interval for midnight countdown (every second)
    const midnightInterval = setInterval(() => {
      setTimeUntilMidnight(calculateTimeUntilMidnight());
    }, 1000);

    // Cleanup on component unmount
    return () => {
      console.log('🧹 Cleaning up dashboard intervals');
      clearInterval(dataInterval);
      clearInterval(dayCheckInterval);
      clearInterval(midnightInterval);
    };
  }, [currentDay]);

  // Manual refresh function
  const handleManualRefresh = () => {
    setLoading(true);
    fetchDashboardData();
  };

  const todayEntries = getTodayEntries();
  const yesterdayEntries = getYesterdayEntries();

  // Debug: Log filtering results
  useEffect(() => {
    if (gateEntries.length > 0) {
      console.log('🔍 Filtering Results:', {
        totalEntries: gateEntries.length,
        todayEntries: todayEntries.length,
        yesterdayEntries: yesterdayEntries.length,
        sampleToday: todayEntries[0],
        sampleYesterday: yesterdayEntries[0]
      });
    }
  }, [gateEntries, todayEntries, yesterdayEntries]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>📊 Gate Entries Dashboard</h2>
        <div>Loading gate entries...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header with refresh controls */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>📊 Gate Entries Dashboard</h2>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
            {currentDay} • Next update: {timeUntilMidnight}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Last update time */}
          {lastUpdate && (
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Data updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          
          {/* Auto-refresh indicator */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '5px',
            padding: '4px 8px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.8em'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }}></div>
            Auto-refresh: 1min
          </div>

          {/* Manual refresh button */}
          <button 
            onClick={handleManualRefresh}
            style={{
              padding: '8px 16px',
              background: '#007acc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{ 
          padding: '10px', 
          background: '#ffebee', 
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#c62828'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Day Status Summary */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{ padding: '15px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1976d2' }}>
            {gateEntries.length}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Total Entries</div>
        </div>
        
        <div style={{ padding: '15px', background: '#e8f5e8', borderRadius: '8px', textAlign: 'center', border: '2px solid #4CAF50' }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2e7d32' }}>
            {todayEntries.length}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Today's Entries</div>
          <div style={{ fontSize: '0.7em', color: '#4CAF50', marginTop: '5px' }}>
            📅 {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div style={{ padding: '15px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#ef6c00' }}>
            {yesterdayEntries.length}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Yesterday's Entries</div>
        </div>
        
        <div style={{ padding: '15px', background: '#f3e5f5', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#7b1fa2' }}>
            {gateEntries.filter(entry => entry.active).length}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Active</div>
        </div>
        
        <div style={{ padding: '15px', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#c62828' }}>
            {gateEntries.filter(entry => entry.canceled === "YES").length}
          </div>
          <div style={{ fontSize: '0.9em', color: '#666' }}>Canceled</div>
        </div>
      </div>

      {/* Day Status Banner */}
      <div style={{
        padding: '10px 15px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>📅 {currentDay}</strong>
          <div style={{ fontSize: '0.8em', opacity: 0.9 }}>
            {todayEntries.length} entries today • Auto-refresh at midnight
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9em', opacity: 0.9 }}>Next day starts in</div>
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {timeUntilMidnight}
          </div>
        </div>
      </div>

      {/* Today's Entries Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#1976d2', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #1976d2' }}>
          📋 Today's Gate Entries ({todayEntries.length})
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {todayEntries.length > 0 ? (
            todayEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} highlightToday={true} parseSAPDate={parseSAPDate} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              No entries for today yet.
            </div>
          )}
        </div>
      </div>

      {/* All Entries Section */}
      <div>
        <h3 style={{ color: '#666', marginBottom: '15px', paddingBottom: '5px', borderBottom: '2px solid #ddd' }}>
          📋 All Gate Entries ({gateEntries.length})
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {gateEntries.length > 0 ? (
            gateEntries.map(entry => (
              <EntryCard key={entry.id} entry={entry} parseSAPDate={parseSAPDate} />
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              No gate entries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Separate Entry Card Component - FIXED
const EntryCard = ({ entry, highlightToday = false, parseSAPDate }) => {
  const isToday = () => {
    const entryDate = parseSAPDate(entry.creationDate) || parseSAPDate(entry.sapcreationdate);
    if (!entryDate) return false;
    
    const entryDateString = entryDate.toDateString();
    const todayString = new Date().toDateString();
    return entryDateString === todayString;
  };

  const formatSAPDate = (sapDate) => {
    const date = parseSAPDate(sapDate);
    return date ? date.toLocaleString() : 'N/A';
  };

  return (
    <div 
      style={{
        border: `2px solid ${highlightToday ? '#4CAF50' : '#ddd'}`,
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: highlightToday ? '#f9fff9' : '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}
    >
      {highlightToday && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '10px',
          background: '#4CAF50',
          color: 'white',
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: '0.7em',
          fontWeight: 'bold'
        }}>
          TODAY
        </div>
      )}
      
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
        {entry.spaceMatrixNumber || 'N/A'}
      </h3>
      <p style={{ margin: '5px 0' }}><strong>PO:</strong> {entry.poNumber || 'N/A'}</p>
      <p style={{ margin: '5px 0' }}><strong>Supplier:</strong> {entry.supplierName || 'N/A'}</p>
      <p style={{ margin: '5px 0' }}><strong>Status:</strong> {entry.statusText || 'N/A'}</p>
      <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
        <strong>Created:</strong> {formatSAPDate(entry.creationDate)}
      </p>
      <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
        <strong>SAP Created:</strong> {formatSAPDate(entry.sapcreationdate)}
      </p>
      <p style={{ margin: '5px 0', fontSize: '0.8em', color: '#666' }}>
        <strong>Updated:</strong> {formatSAPDate(entry.lastChanged)}
      </p>
      <div style={{ 
        display: 'flex', 
        gap: '5px', 
        marginTop: '10px',
        fontSize: '0.7em'
      }}>
        {isToday() && (
          <span style={{ padding: '2px 6px', background: '#4CAF50', color: 'white', borderRadius: '3px' }}>
            Today
          </span>
        )}
        {entry.active && (
          <span style={{ padding: '2px 6px', background: '#2196F3', color: 'white', borderRadius: '3px' }}>
            Active
          </span>
        )}
        {entry.canceled === "YES" && (
          <span style={{ padding: '2px 6px', background: '#f44336', color: 'white', borderRadius: '3px' }}>
            Canceled
          </span>
        )}
      </div>
    </div>
  );
};

// Add CSS for pulse animation
const styles = `
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Dashboard;