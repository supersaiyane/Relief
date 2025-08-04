// src/pages/ManagementReportsPage.jsx

import React, { useState } from 'react';
import Tabs      from '../components/Tabs';
import TabPanel  from '../components/TabPanel';
import RecruiterPage from './RecruiterPage'; // serves as "Overall Report"
import { downloadCsv } from '../utils/downloadCsv';

export default function ManagementReportsPage() {
  const subTabs = ['Overall Report'];
  const [active, setActive] = useState(subTabs[0]);

 // Grab the data out of RecruiterPage
 const overallData = RecruiterPage.getData?.() || [];
 const headers     = overallData.length > 0
   ? Object.keys(overallData[0])
   : [];

 // Download handler
 const handleDownload = () => {
   if (!overallData.length) return alert('No data to download');
   const filename = `${active}.csv`;
   downloadCsv(filename, headers, overallData);
 };

  return (
    <div className="management-reports-page">
      <h2>Management Reports</h2>
      <Tabs tabs={subTabs} activeTab={active} onChange={setActive} />

     {/* Download button for Overall Report */}
      {active === 'Overall Report' && (
        <button className="download-btn" onClick={handleDownload} style={{ margin: '1rem 0' }}>
          Download "{active}"
        </button>
      )}

      <TabPanel isActive={active === 'Overall Report'}>
        <RecruiterPage />
      </TabPanel>
    </div>
  );
}
