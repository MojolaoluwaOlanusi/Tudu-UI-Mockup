import { Routes, Route } from 'react-router-dom';
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
          <Route path="settings" element={<AppSettings />} />
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </MotionConfig>
  );
}