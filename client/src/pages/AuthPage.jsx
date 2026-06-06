import { useState } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import './Auth.css'

/* ─── ICONS (MODERNISED & POLISHED) ─────────────────────── */
const EventHubIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="eventhub-logo-svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect x="2" y="4" width="20" height="16" rx="4" fill="url(#logoGrad)" />
    <path d="M7 2v4M17 2v4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 10h20" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
    <path d="M12 12l1.2 2.4 2.6.4-1.9 1.8.4 2.6-2.3-1.2-2.3 1.2.4-2.6-1.9-1.8 2.6-.4z" fill="#ffffff" />
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.72H24v8.94h12.64C36.09 31.42 32.55 35 27.56 38.38l7.73 5.99c4.52-4.16 7.21-10.28 7.21-17.37z"/>
    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-5.99c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
)

const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
)

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

/* ─── INPUT FIELD ────────────────────────────────────────── */
function InputField({ icon, type = 'text', placeholder, value, onChange, rightSlot, hasError }) {
  return (
    <div className={`auth-input-wrap ${hasError ? 'input-error' : ''}`}>
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      onLogin(userCredential.user)
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)
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
        })
      }
      onLogin(result.user)
    } catch (err) {
      setError('Google Sign-In failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-form-header">
        <h2>Welcome Back! 👋</h2>
        <p>Sign in to your EventHub account</p>
      </div>

      {error && <div className="auth-alert error">{error}</div>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label className="auth-label">Email Address</label>
          <InputField
            icon={<MailIcon />}
            type="email"
            placeholder="name@college.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            hasError={!!error && !email}
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
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            hasError={!!error && !password}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                <EyeIcon open={showPw} />
              </button>
            }
          />
        </div>

        <div className="auth-checkbox-row" onClick={() => setRemember(!remember)}>
          <div className={`auth-checkbox ${remember ? 'checked' : ''}`}>
            {remember && <span className="auth-check-mark">✓</span>}
          </div>
          <span className="auth-terms-text">Keep me signed in</span>
        </div>

        <button className="auth-submit-btn" type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <div className="auth-social-row">
        <button type="button" className="auth-social-btn" onClick={handleGoogleLogin} disabled={loading}>
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button type="button" className="auth-social-btn" onClick={() => {}} disabled={loading}>
          <MicrosoftIcon />
          <span>Microsoft</span>
        </button>
      </div>

      <div className="auth-footer-text">
        Don't have an account? <span className="auth-switch-link" onClick={onSwitch}>Create an account</span>
      </div>
    </div>
  )
}

/* ─── SIGNUP FORM ────────────────────────────────────────── */
function SignupForm({ onSwitch, onLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfPw, setShowConfPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Real-time validations
  const isLengthValid = password.length >= 6
  const isMatchValid = password && password === confirmPw

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password || !confirmPw) {
      setError('Please fill in all fields.')
      return
    }
    if (!isLengthValid) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!isMatchValid) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('You must agree to the Terms & Conditions.')
      return
    }

    setLoading(true)
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
      })
      
      setShowSuccess(true)
      setTimeout(() => {
        onSwitch()
      }, 1800)
    } catch (err) {
      setError(err.message || 'An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)
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
        })
      }
      onLogin(result.user)
    } catch (err) {
      setError('Google Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-form-header">
        <h2>Create Account ✨</h2>
        <p>Join EventHub and explore amazing college events</p>
      </div>

      {error && <div className="auth-alert error">{error}</div>}

      {showSuccess && (
        <div className="auth-alert success">
          <span className="success-icon">🎉</span>
          <div>
            <strong>Account Registered!</strong>
            <p>Redirecting to Login...</p>
          </div>
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field-group">
          <label className="auth-label">Full Name</label>
          <InputField
            icon={<UserIcon />}
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
            hasError={!!error && !name}
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Email Address</label>
          <InputField
            icon={<MailIcon />}
            type="email"
            placeholder="name@college.edu"
            value={email}
            onChange={e => setEmail(e.target.value)}
            hasError={!!error && !email}
          />
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Password</label>
          <InputField
            icon={<LockIcon />}
            type={showPw ? 'text' : 'password'}
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            hasError={!!error && !password}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowPw(!showPw)}>
                <EyeIcon open={showPw} />
              </button>
            }
          />
          {password && (
            <div className="password-checker">
              <div className={`checker-item ${isLengthValid ? 'valid' : 'invalid'}`}>
                <span className="dot"></span>
                <span>Minimum 6 characters</span>
              </div>
            </div>
          )}
        </div>

        <div className="auth-field-group">
          <label className="auth-label">Confirm Password</label>
          <InputField
            icon={<LockIcon />}
            type={showConfPw ? 'text' : 'password'}
            placeholder="Repeat password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            hasError={!!error && !confirmPw}
            rightSlot={
              <button type="button" className="eye-btn" onClick={() => setShowConfPw(!showConfPw)}>
                <EyeIcon open={showConfPw} />
              </button>
            }
          />
          {confirmPw && (
            <div className="password-checker">
              <div className={`checker-item ${isMatchValid ? 'valid' : 'invalid'}`}>
                <span className="dot"></span>
                <span>Passwords match</span>
              </div>
            </div>
          )}
        </div>

        <div className="auth-checkbox-row" onClick={() => setAgreed(!agreed)}>
          <div className={`auth-checkbox ${agreed ? 'checked' : ''}`}>
            {agreed && <span className="auth-check-mark">✓</span>}
          </div>
          <span className="auth-terms-text">
            I agree to the <span className="auth-link">Terms & Conditions</span>
          </span>
        </div>

        <button className="auth-submit-btn" type="submit" disabled={loading || showSuccess}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="auth-divider">
        <span>or register with</span>
      </div>

      <div className="auth-social-row">
        <button type="button" className="auth-social-btn" onClick={handleGoogleSignup} disabled={loading || showSuccess}>
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button type="button" className="auth-social-btn" onClick={() => {}} disabled={loading || showSuccess}>
          <MicrosoftIcon />
          <span>Microsoft</span>
        </button>
      </div>

      <div className="auth-footer-text">
        Already have an account? <span className="auth-switch-link" onClick={onSwitch}>Sign In</span>
      </div>
    </div>
  )
}

/* ─── MAIN AUTH PAGE ─────────────────────────────────────── */
export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [fadeState, setFadeState] = useState('fade-in')

  const handleSwitch = (newMode) => {
    setFadeState('fade-out')
    setTimeout(() => {
      setMode(newMode)
      setFadeState('fade-in')
    }, 200)
  }

  return (
    <div className="auth-centered-page">
      {/* Dynamic Glowing Blob Backgrounds */}
      <div className="auth-glow-blob blob-one"></div>
      <div className="auth-glow-blob blob-two"></div>
      <div className="auth-glow-blob blob-three"></div>
      <div className="auth-noise-overlay"></div>

      <div className="auth-content-wrapper">
        {/* Brand Header */}
        <div className="auth-logo-header">
          <EventHubIcon />
          <h1 className="auth-logo-text">EventHub</h1>
          <p className="auth-logo-tagline">Explore • Register • Participate</p>
        </div>

        {/* Dynamic Translucent Auth Form with CSS Switch Animations */}
        <div className={`auth-animation-wrapper ${fadeState}`}>
          {mode === 'login' ? (
            <LoginForm onSwitch={() => handleSwitch('signup')} onLogin={onLogin} />
          ) : (
            <SignupForm onSwitch={() => handleSwitch('login')} onLogin={onLogin} />
          )}
        </div>
      </div>
    </div>
  )
}
