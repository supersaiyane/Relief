import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import TabPanel from '../components/TabPanel';
import AuditLogPage from './AuditLogPage';
import QueueMonitorPage from './QueueMonitorPage';
import ActiveUsersPage from './ActiveUsersPage';

export default function SystemReportsPage() {
  const subTabs = ['Audit Log', 'Queue Monitor', 'Active Users'];
  const [activeSubTab, setActiveSubTab] = useState(subTabs[0]);

  return (
    <div className="system-reports-page">
      <h2>System Reports</h2>
      <Tabs
        tabs={subTabs}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
      />

      <TabPanel isActive={activeSubTab === 'Audit Log'}>
        <AuditLogPage />
      </TabPanel>
      <TabPanel isActive={activeSubTab === 'Queue Monitor'}>
        <QueueMonitorPage />
      </TabPanel>
      <TabPanel isActive={activeSubTab==='Active Users'}>
        <ActiveUsersPage />
      </TabPanel>
    </div>
  );
}
