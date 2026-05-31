import { useState } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import './Auth.css'

/* ─── ICONS ─────────────────────────────────────────────── */
const EventHubIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="eventhub-logo-svg">
    <rect x="2" y="4" width="20" height="16" rx="3" fill="#6366f1"/>
    <path d="M7 2v4M17 2v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 10h20" stroke="white" strokeWidth="2"/>
    <path d="M12 12l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z" fill="white"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.6 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.1l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.1 0-9.5-3.2-11.2-7.8l-6.5 5C9.5 39.4 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.5l6.2 5.2C41.4 36.7 44 30.8 44 24c0-1.3-.1-2.7-.4-3.9z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
)

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

/* ─── INPUT FIELD ────────────────────────────────────────── */
function InputField({ icon, type = 'text', placeholder, value, onChange, rightSlot }) {
  return (
    <div className="auth-input-wrap">
      <span className="auth-input-icon">{icon}</span>
      <input
        className="auth-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {rightSlot && <span className="auth-input-right">{rightSlot}</span>}
    </div>
  )
}

/* ─── LOGIN FORM ─────────────────────────────────────────── */
function LoginForm({ onSwitch, onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [remember, setRemember] = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      onLogin(userCredential.user)
    } catch (err) {
      setError('Invalid email or password.')
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: result.user.displayName || 'User',
          email: result.user.email,
          phone: '',
          dob: '',
          yearOfStudy: '',
          department: '',
          college: '',
          interests: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
      onLogin(result.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-form-header">
        <h2>Welcome Back! 👋</h2>
        <p>Sign in to your EventHub account</p>
      </div>

      {error && <div className="auth-error" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label className="auth-label">Email</label>
          <InputField
            icon={<MailIcon />}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field-group">
          <div className="auth-label-row">
            <label className="auth-label">Password</label>
            <span className="auth-forgot" onClick={() => {}}>Forgot?</span>
          </div>
          <InputField
            icon={<LockIcon />}
            type={showPw ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                <EyeIcon open={showPw} />
              </button>
            }
          />
        </div>

        <label className="auth-checkbox-row">
          <div
            className={`auth-checkbox ${remember ? 'checked' : ''}`}
            onClick={() => setRemember(!remember)}
          >
            {remember && <span className="auth-check-mark">✓</span>}
          </div>
          <span className="auth-terms-text">Remember me</span>
        </label>

        <button className="auth-submit-btn" type="submit">
          Sign In
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      {/* Social Buttons */}
      <div className="auth-social-row">
        <button type="button" className="auth-social-btn" onClick={handleGoogleLogin}>
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button type="button" className="auth-social-btn" onClick={() => {}}>
          <MicrosoftIcon />
          <span>Microsoft</span>
        </button>
      </div>

      <div className="auth-footer-text">
        Don't have an account? <span className="auth-switch-link" onClick={onSwitch}>Sign up</span>
      </div>
    </div>
  )
}

/* ─── SIGNUP FORM ────────────────────────────────────────── */
function SignupForm({ onSwitch, onLogin }) {
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirmPw,  setConfirmPw]  = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [agreed,     setAgreed]     = useState(false)
  const [error,      setError]      = useState('')

  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!agreed) {
      setError('Please agree to the Terms & Conditions')
      return
    }
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    if (password !== confirmPw) {
      setError('Passwords do not match')
      return
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        phone: '',
        dob: '',
        yearOfStudy: '',
        department: '',
        college: '',
        interests: [],
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      
      setShowSuccess(true)
      setTimeout(() => {
        onSwitch()
      }, 2000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: result.user.displayName || 'User',
          email: result.user.email,
          phone: '',
          dob: '',
          yearOfStudy: '',
          department: '',
          college: '',
          interests: [],
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
      onLogin(result.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-form-header">
        <h2>Create Your Account ✨</h2>
        <p>Join EventHub and explore amazing events</p>
      </div>

      {error && <div className="auth-error" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

      {showSuccess && (
        <div style={{ color: '#16a34a', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '28px' }}>🎉</span>
          <strong>Account Created Successfully!</strong>
          <span>Redirecting you to Login page...</span>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label className="auth-label">Full Name</label>
          <InputField
            icon={<UserIcon />}
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Email</label>
          <InputField
            icon={<MailIcon />}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Password</label>
          <InputField
            icon={<LockIcon />}
            type={showPw ? 'text' : 'password'}
            placeholder="Create a password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                <EyeIcon open={showPw} />
              </button>
            }
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Confirm Password</label>
          <InputField
            icon={<LockIcon />}
            type={showConfPw ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowConfPw(!showConfPw)}>
                <EyeIcon open={showConfPw} />
              </button>
            }
          />
        </div>

        {/* Terms Checkbox */}
        <label className="auth-checkbox-row">
          <div
            className={`auth-checkbox ${agreed ? 'checked' : ''}`}
            onClick={() => setAgreed(!agreed)}
          >
            {agreed && <span className="auth-check-mark">✓</span>}
          </div>
          <span className="auth-terms-text">
            I agree to the <span className="auth-link">Terms & Conditions</span>
          </span>
        </label>

        <button className="auth-submit-btn" type="submit">
          Sign Up
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      {/* Social Buttons */}
      <div className="auth-social-row">
        <button type="button" className="auth-social-btn" onClick={handleGoogleSignup}>
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button type="button" className="auth-social-btn" onClick={() => {}}>
          <MicrosoftIcon />
          <span>Microsoft</span>
        </button>
      </div>

      <div className="auth-footer-text">
        Already have an account? <span className="auth-switch-link" onClick={onSwitch}>Login</span>
      </div>
    </div>
  )
}


/* ─── MAIN AUTH PAGE ─────────────────────────────────────── */
export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')

  return (
    <div className="auth-centered-page">
      {/* Decorative Background Elements */}
      <div className="auth-bg-blob auth-blob-top"></div>
      <div className="auth-bg-blob auth-blob-bottom"></div>
      <div className="auth-bg-bunting"></div>
      
      {/* Bottom Illustration Placeholder */}
      <div className="auth-bottom-illustration"></div>

      <div className="auth-content-wrapper">
        {/* Logo Header */}
        <div className="auth-logo-header">
          <EventHubIcon />
          <h1 className="auth-logo-text">EventHub</h1>
          <p className="auth-logo-tagline">Explore. Register. Participate.</p>
        </div>

        {/* Dynamic Form Content */}
        {mode === 'login' ? (
          <LoginForm onSwitch={() => setMode('signup')} onLogin={onLogin} />
        ) : (
          <SignupForm onSwitch={() => setMode('login')} onLogin={onLogin} />
        )}
      </div>
    </div>
  )
}
