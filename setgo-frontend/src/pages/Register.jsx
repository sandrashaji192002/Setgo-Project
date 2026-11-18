import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (err) setErr('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone ||
      !form.password
    ) {
      return setErr('All fields are required');
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return setErr('Enter a valid email');
    }
    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      return setErr('Enter a valid 10-digit mobile number');
    }
    if (form.password.length < 8) {
      return setErr('Password must be at least 8 characters');
    }
    if (form.password !== form.confirmPassword) {
      return setErr('Passwords do not match');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      navigate('/');
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  const labelClass =
    'text-[10px] uppercase tracking-widest text-white/70 md:text-gray-400';
  const inputClass =
    'w-full bg-transparent border-b border-white/50 md:border-gray-300 py-2 text-sm text-white md:text-gray-700 outline-none focus:border-white md:focus:border-purple-600';
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-300 p-4">
      <div className="absolute inset-0 md:hidden">
        <img
          src="/login-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/70 to-purple-600/70"></div>
      </div>
      <div className="relative w-full max-w-5xl min-h-[580px] bg-gradient-to-br from-pink-500 to-purple-600 md:bg-none md:bg-white rounded-lg md:rounded-none shadow-xl overflow-hidden flex">
        <div
          className="hidden md:block absolute inset-y-0 left-0 w-[62%]"
          style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 100%)' }}
        >
          <img
            src="/login-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/60 to-purple-600/60"></div>

          <div className="absolute left-12 top-1/2 text-white max-w-xs">
            <h2 className="text-3xl font-light leading-snug">
              Start your journey with us today!
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Create an account in less than a minute.
            </p>
          </div>
        </div>
        <div className="w-full md:w-[40%] md:ml-auto px-10 py-8 flex flex-col justify-center">
          <h1 className="text-2xl text-white md:text-gray-800 mb-6">
            <span className="font-semibold">Create</span> your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {err && (
              <p className="text-sm text-yellow-200 md:text-red-500">{err}</p>
            )}
            <div>
              <label className={labelClass}>Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Phone number</label>
              <input
                name="phone"
                type="tel"
                maxLength={10}
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Confirm password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-purple-700 md:bg-purple-600 md:text-white hover:bg-purple-50 md:hover:bg-purple-700 disabled:opacity-50 text-xs font-semibold tracking-wider uppercase px-6 py-3 rounded"
            >
              {loading ? 'Please wait...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-xs text-white/80 md:text-gray-400">
            Already registered?{' '}
            <Link
              to="/"
              className="text-white font-semibold md:text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
