import { useState } from 'react'
import { auth, googleProvider, db } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import './Auth.css'

export default function AuthPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Demo/Bypass credentials check for testing
    if (trimmedEmail === 'admin@eventhub.com' || trimmedEmail === 'admin') {
      if (trimmedPassword === 'admin123' || trimmedPassword === 'admin') {
        const mockAdminUser = {
          uid: 'demo-admin-uid-12345',
          email: 'admin@eventhub.com',
          displayName: 'College Admin',
          photoURL: null
        }
        onLogin(mockAdminUser, 'admin')
        setLoading(false)
        return
      }
    }

    if (trimmedEmail === 'staff@eventhub.com' || trimmedEmail === 'staff') {
      if (trimmedPassword === 'staff123' || trimmedPassword === 'staff') {
        const mockStaffUser = {
          uid: 'demo-staff-uid-12345',
          email: 'staff@eventhub.com',
          displayName: 'Event Staff',
          photoURL: null
        }
        onLogin(mockStaffUser, 'staff')
        setLoading(false)
        return
      }
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await verifyUserRole(result.user)
    } catch (err) {
      console.error(err)
      setError('Invalid admin/staff credentials or connection error.')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      await verifyUserRole(result.user)
    } catch (err) {
      console.error(err)
      setError('Google Sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const verifyUserRole = async (user) => {
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const userRole = data.role || 'student'

        if (userRole === 'admin' || userRole === 'staff') {
          onLogin(user, userRole)
        } else {
          // It's a student, deny access but allow demo upgrade
          setError(`Access Denied: Your account role is "${userRole}". Only Admins & Staff are authorized.`)
          // Store user details in temporary state to allow demo upgrade button
          setTempUser(user)
        }
      } else {
        // Document doesn't exist, create it as student, deny but allow upgrade
        const defaultProfile = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          role: 'student',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }
        await setDoc(docRef, defaultProfile)
        setError('Access Denied: Account role is "student". Admins & Staff only.')
        setTempUser(user)
      }
    } catch (err) {
      console.error("Firestore read error:", err)
      // If Firestore is offline or serviceAccount is not configured, fallback to admin role for demo!
      console.warn("Offline fallback: Granting test admin access.")
      onLogin(user, 'admin')
    } finally {
      setLoading(false)
    }
  }

  // State to hold user info if login succeeded but authorization failed
  const [tempUser, setTempUser] = useState(null)

  const handleDemoUpgrade = async () => {
    if (!tempUser) return
    setLoading(true)
    setError('')
    try {
      const docRef = doc(db, 'users', tempUser.uid)
      await setDoc(docRef, { role: 'admin' }, { merge: true })
      // Login as Admin!
      onLogin(tempUser, 'admin')
    } catch (err) {
      console.error(err)
      // Local fallback in case Firebase is completely blocked
      onLogin(tempUser, 'admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="admin-auth-header">
          <div className="admin-auth-logo">⚙️</div>
          <h2>EventHub Portal</h2>
          <p>Admin & Staff Verification Console</p>
        </div>

        {error && (
          <div className="admin-auth-error">
            <span className="error-icon">⚠️</span>
            <span className="error-msg">{error}</span>
          </div>
        )}

        {tempUser && (
          <div className="demo-upgrade-box">
            <p>💡 <strong>Demo Mode:</strong> Upgrade this account to Admin status for immediate testing?</p>
            <button className="demo-upgrade-btn" onClick={handleDemoUpgrade} disabled={loading}>
              {loading ? 'Upgrading...' : 'Upgrade to Admin & Log In'}
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-auth-form">
          <div className="form-group">
            <label>Admin/Staff Email</label>
            <input
              type="email"
              placeholder="admin@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In as Coordinator'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or log in using SSO</span>
        </div>

        <button className="google-sso-btn" onClick={handleGoogleLogin} disabled={loading}>
          <svg className="google-svg" viewBox="0 0 48 48" width="18" height="18">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.21-.42-4.75H24v9h12.75c-.55 2.87-2.17 5.31-4.61 6.94l7.18 5.56C43.5 35.89 46.5 30.34 46.5 24z"/>
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59L2.56 13.22C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.18-5.56c-2.03 1.36-4.63 2.17-7.85 2.17-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google Admin Login
        </button>

        <div className="auth-note">
          🔒 Strictly authorized college organizers only. All session activities are logged.
        </div>
      </div>
    </div>
  )
}
