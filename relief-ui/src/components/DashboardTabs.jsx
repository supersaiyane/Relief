// src/components/DashboardTabs.jsx

import React, { useState } from 'react';
import Tabs     from './Tabs';
import TabPanel from './TabPanel';

import AdminPage         from '../pages/AdminPage';
import InterviewerPage   from '../pages/InterviewerPage';
import BulkUploadPage    from '../pages/BulkUploadPage';
import SystemReportsPage from '../pages/SystemReportsPage';
import ManagementReportsPage from '../pages/ManagementReportsPage';

// Main tabs per role
const TABS_BY_ROLE = {
  1: [ // Admin
    'Admin',
    'Interviewer',
    'Bulk Upload',
    'System Reports',
    'Management Reports'
  ],
  2: [ // Manager
    'Interviewer',
    'System Reports',
    'Management Reports'
  ],
  3: [ // User
    'Interviewer'
  ]
};

export default function DashboardTabs({ roleId }) {
  const allowedTabs = TABS_BY_ROLE[roleId] || [];
  const [activeTab, setActiveTab] = useState(allowedTabs[0] || '');

  return (
    <div className="dashboard-tabs">
      <Tabs
        tabs={allowedTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'Admin' && (
        <TabPanel isActive>
          <AdminPage />
        </TabPanel>
      )}

      {activeTab === 'Interviewer' && (
        <TabPanel isActive>
          <InterviewerPage />
        </TabPanel>
      )}

      {activeTab === 'Bulk Upload' && (
        <TabPanel isActive>
          <BulkUploadPage />
        </TabPanel>
      )}

      {activeTab === 'System Reports' && (
        <TabPanel isActive>
          <SystemReportsPage />
        </TabPanel>
      )}

      {activeTab === 'Management Reports' && (
        <TabPanel isActive>
          <ManagementReportsPage />
        </TabPanel>
      )}
    </div>
  );
}
