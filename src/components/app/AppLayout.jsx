import { Outlet } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import Topbar from './Topbar';
import Sidebar from './sidebar/Sidebar';
import DetailPanel from './DetailPanel';
import ToastStack from './Toast';

export default function AppLayout() {
  return (
    <AppProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-canvas text-ink">
        <Topbar />
        <div className="flex min-h-0 flex-1 gap-3 p-3">
          <Sidebar />
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-line-subtle bg-surface">
            <div data-main className="min-h-0 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </main>
          <DetailPanel />
        </div>
        <ToastStack />
      </div>
    </AppProvider>
  );
}