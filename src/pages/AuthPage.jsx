import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('mojola@tudu.app');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';
  const heading = isSignup ? 'Create your account' : 'Welcome back';
  const sub = isSignup ? 'Start free. No credit card required.' : 'Sign in to your board.';
  const submitLabel = isSignup ? 'Create account' : 'Sign in';

  const finish = () => {
    setBusy(true);
    setTimeout(() => { setBusy(false); navigate('/app'); }, 600);
  };

  const onEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    finish();
  };

  return (
    <div className="flex min-h-screen bg-canvas text-ink">
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-line-subtle bg-surface p-10 lg:flex">
        <Link to="/" className="inline-block"><Wordmark size="md" /></Link>
        <div className="max-w-md">
          <h2 className="font-handwritten text-4xl leading-tight text-ink">
            Where simple boards become serious work.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            The fast, offline-first Kanban for teams tired of Trello's limits and Jira's chaos.
            Free for personal use, scales when you do.
          </p>
          <ul className="mt-6 space-y-2 text-[13px] text-ink-muted">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Free forever for personal use</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Real-time sync across every device</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand" />AI, Pomodoro, analytics, GitHub + Slack</li>
          </ul>
        </div>
        <p className="text-[11px] text-ink-faint">Made with love in Ibadan.</p>
      </aside>

      <main className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Link to="/" className="inline-block"><Wordmark size="md" /></Link>
          </div>
          <h1 className="font-handwritten text-4xl text-ink">{heading}</h1>
          <p className="mt-2 text-sm text-ink-muted">{sub}</p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={finish}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={finish}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-line-strong"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line-subtle" /></div>
            <div className="relative flex justify-center"><span className="bg-canvas px-2 text-[11px] uppercase tracking-wider text-ink-faint">Or with email</span></div>
          </div>

          <form onSubmit={onEmailSubmit} className="space-y-3">
            {isSignup && (
              <div>
                <label htmlFor="auth-name" className="label">Name</label>
                <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="input" />
              </div>
            )}
            <div>
              <label htmlFor="auth-email" className="label">Email</label>
              <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </div>
            <div>
              <label htmlFor="auth-pass" className="label">Password</label>
              <input id="auth-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required minLength={6} />
            </div>
            <button type="submit" disabled={busy} className="btn-accent brush-stroke w-full py-2.5">
              {busy ? 'Just a moment...' : submitLabel}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-ink-muted">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="font-medium text-brand hover:underline">Sign in</Link></>
            ) : (
              <>No account? <Link to="/signup" className="font-medium text-brand hover:underline">Sign up</Link></>
            )}
          </p>

          <p className="mt-6 text-center text-[11px] text-ink-faint">
            By continuing, you agree to our <Link to="/terms" className="underline hover:text-ink">Terms</Link> and <Link to="/privacy" className="underline hover:text-ink">Privacy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
}