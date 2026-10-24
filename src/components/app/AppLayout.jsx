import { Outlet } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import Topbar from './Topbar';
import Sidebar from './sidebar/Sidebar';
import DetailPanel from './DetailPanel';

export default function AppLayout() {
  return (
    <AppProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-canvas text-ink">
        <Topbar />
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main data-main className="min-w-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
          <DetailPanel />
        </div>
      </div>
    </AppProvider>
  );
}