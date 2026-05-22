import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import WavelyLogo from '../components/WavelyLogo';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [loginPage, setLoginPage] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' });

  if (isAuthenticated) {
    navigate('/account', { replace: true });
    return null;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (loginPage) {
        await login(form.email, form.password);
      } else {
        await register({
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phone: form.phone,
        });
      }
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eae8e4] flex items-center justify-center p-4 md:p-8">
      <div className="flex w-full max-w-4xl min-h-[560px] rounded-[var(--wv-radius-lg)] overflow-hidden shadow-[0_24px_80px_rgba(26,26,26,0.12)] bg-wv-elevated">
        <div
          className="hidden md:block w-1/2 relative min-h-[560px] bg-wv-text"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(26,24,21,0.2) 0%, rgba(26,24,21,0.55) 100%), url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute top-10 left-0 right-0 flex justify-center">
            <WavelyLogo variant="gold" showEmblem={false} className="h-9 w-auto drop-shadow-md" />
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-wv-form-pane px-8 md:px-12 py-12 flex flex-col justify-center">
          <h1 className="font-wv-serif text-2xl md:text-3xl text-center text-[#1a1a1a] leading-snug px-4">
            Wavely exclusive
            <br />
            Member portal
          </h1>

          <div className="flex justify-center gap-10 mt-8 mb-6">
            <button type="button" onClick={() => { setLoginPage(true); setError(''); }} className={`pb-3 text-sm font-wv-sans relative ${loginPage ? 'text-[#1a1a1a]' : 'text-wv-muted'}`}>
              Sign in
              {loginPage && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-wv-login-gold" />}
            </button>
            <button type="button" onClick={() => { setLoginPage(false); setError(''); }} className={`pb-3 text-sm font-wv-sans relative ${!loginPage ? 'text-[#1a1a1a]' : 'text-wv-muted'}`}>
              Register
              {!loginPage && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-wv-login-gold" />}
            </button>
          </div>

          {error && <p className="text-center text-sm text-red-600 mb-4 font-wv-sans">{error}</p>}

          <form className="flex flex-col gap-6 max-w-xs mx-auto w-full" onSubmit={handleSubmit}>
            {!loginPage && (
              <div>
                <label className="block text-xs font-wv-sans text-wv-muted mb-3">Full name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  className="w-full bg-transparent border-0 border-b border-[#a0a0a0] py-2 text-sm outline-none focus:border-wv-login-gold"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-wv-sans text-wv-muted mb-3">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-[#a0a0a0] py-2 text-sm outline-none focus:border-wv-login-gold"
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-wv-sans text-wv-muted mb-3">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-[#a0a0a0] py-2 pr-10 text-sm outline-none focus:border-wv-login-gold"
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword(s => !s)} className="absolute right-0 bottom-2 text-wv-muted p-1">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 rounded-[var(--wv-radius-pill)] bg-[#262626] text-wv-login-gold font-wv-sans text-sm disabled:opacity-60"
            >
              {loading ? 'Please wait…' : loginPage ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center mt-8">
            <Link to="/" className="text-xs font-wv-sans text-wv-muted hover:text-wv-text underline underline-offset-4">
              Continue to shop
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
