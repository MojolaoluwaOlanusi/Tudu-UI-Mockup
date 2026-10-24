import { Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import Landing from './pages/Landing.jsx';
import Demo from './pages/Demo.jsx';
import AuthPage from './pages/AuthPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import ChangelogPage from './pages/ChangelogPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import StatusPage from './pages/StatusPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import SolutionsPage from './pages/SolutionsPage.jsx';
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
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        <Route path="/docs" element={<DocsPage />} />
        <Route path="/docs/:slug" element={<DocsPage />} />
        <Route path="/webhooks" element={<DocsPage forcedSlug="webhooks" />} />

        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/privacy" element={<LegalPage mode="privacy" />} />
        <Route path="/terms" element={<LegalPage mode="terms" />} />
        <Route path="/solutions" element={<Navigate to="/solutions/teams" replace />} />
        <Route path="/solutions/:slug" element={<SolutionsPage />} />

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