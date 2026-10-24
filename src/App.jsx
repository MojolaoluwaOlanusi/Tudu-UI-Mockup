import { Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Demo from './pages/Demo.jsx';
import Stub from './pages/Stub.jsx';
import AppLayout from './components/app/AppLayout.jsx';
import AppHome from './pages/app/AppHome.jsx';
import AppBoard from './pages/app/AppBoard.jsx';
import AppStats from './pages/app/AppStats.jsx';
import AppAnalytics from './pages/app/AppAnalytics.jsx';
import AppSettings from './pages/app/AppSettings.jsx';
import AppShared from './pages/app/AppShared.jsx';
import SettingsAccount from './pages/app/settings/SettingsAccount.jsx';
import SettingsNotifications from './pages/app/settings/SettingsNotifications.jsx';
import SettingsAppearance from './pages/app/settings/SettingsAppearance.jsx';
import SettingsIntegrations from './pages/app/settings/SettingsIntegrations.jsx';
import SettingsWorkspace from './pages/app/settings/SettingsWorkspace.jsx';
import SettingsBilling from './pages/app/settings/SettingsBilling.jsx';
import SettingsLicense from './pages/app/settings/SettingsLicense.jsx';
import SettingsApi from './pages/app/settings/SettingsApi.jsx';
import SettingsWebhooks from './pages/app/settings/SettingsWebhooks.jsx';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/pricing" element={<Stub title="Pricing" part={7} note="Full pricing with monthly/yearly toggle and currency switcher lands in Part 7." />} />
        <Route path="/login" element={<Stub title="Sign in" part={14} />} />
        <Route path="/signup" element={<Stub title="Create account" part={14} />} />
        <Route path="/changelog" element={<Stub title="Changelog" part={7} />} />
        <Route path="/docs" element={<Stub title="Documentation" part={15} />} />
        <Route path="/docs/*" element={<Stub title="Documentation" part={15} />} />
        <Route path="/solutions/*" element={<Stub title="Solutions" part={15} />} />
        <Route path="/help" element={<Stub title="Help center" part={15} />} />
        <Route path="/contact" element={<Stub title="Contact" part={15} />} />
        <Route path="/blog" element={<Stub title="Blog" part={15} />} />
        <Route path="/community" element={<Stub title="Community" part={15} />} />
        <Route path="/status" element={<Stub title="Status page" part={15} />} />
        <Route path="/privacy" element={<Stub title="Privacy" part={15} />} />
        <Route path="/terms" element={<Stub title="Terms" part={15} />} />
        <Route path="/webhooks" element={<Stub title="Webhooks" part={15} />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<AppHome />} />
          <Route path="board" element={<AppBoard />} />
          <Route path="stats" element={<AppStats />} />
          <Route path="analytics" element={<AppAnalytics />} />
          <Route path="shared/:id" element={<AppShared />} />
          <Route path="settings" element={<AppSettings />}>
            <Route index element={<Navigate to="account" replace />} />
            <Route path="account" element={<SettingsAccount />} />
            <Route path="notifications" element={<SettingsNotifications />} />
            <Route path="appearance" element={<SettingsAppearance />} />
            <Route path="integrations" element={<SettingsIntegrations />} />
            <Route path="workspace" element={<SettingsWorkspace />} />
            <Route path="billing" element={<SettingsBilling />} />
            <Route path="license" element={<SettingsLicense />} />
            <Route path="api" element={<SettingsApi />} />
            <Route path="webhooks" element={<SettingsWebhooks />} />
          </Route>
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </MotionConfig>
  );
}