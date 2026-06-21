import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { API_BASE_URL } from '../config';
import AvatarInitial from '../components/AvatarInitial';
import './ProfilePage.css';

// SVG Icons
const Icons = {
  mail: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  phone: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  map: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  calendar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  cake: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"></path><path d="M2 21h20"></path><path d="M7 8v2"></path><path d="M12 8v2"></path><path d="M17 8v2"></path><path d="M7 4h.01"></path><path d="M12 4h.01"></path><path d="M17 4h.01"></path></svg>,
  graduation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>,
  building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>,
  code: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  music: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>,
  presentation: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h20"></path><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path><path d="M10 22h4"></path><path d="M12 16v6"></path></svg>,
  question: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  trophy: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>,
  star: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  medal: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>,
  chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  edit: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
};

export default function ProfilePage({ user }) {
  const [activeTab, setActiveTab] = useState('about');
  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileAndRegistrations = async () => {
      if (user && user.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          let profileEmail = user.email;
          if (docSnap.exists()) {
            const docData = docSnap.data();
            setFetchedData(docData);
            if (docData.email) profileEmail = docData.email;
          } else {
            console.log("No such document!");
          }

          if (profileEmail) {
            const res = await fetch(`${API_BASE_URL}/my-tickets?email=${encodeURIComponent(profileEmail)}`);
            const data = await res.json();
            if (res.ok && data.success) {
              setRegistrations(data.tickets);
            }
          }
        } catch (error) {
          console.error("Error fetching profile/registrations:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfileAndRegistrations();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#6366f1', fontWeight: 'bold' }}>Loading Profile...</div>;
  }

  const data = fetchedData || {};
  const profileData = {
    name: data.name || user?.displayName || 'User',
    role: data.role || 'Student',
    email: data.email || user?.email || '',
    phone: data.phone || 'Not provided',
    location: data.location || 'Not provided',
    joinedDate: data.joinedDate || 'Recently',
    dob: data.dob || 'Not provided',
    yearOfStudy: data.yearOfStudy || 'Not provided',
    department: data.department || 'Not provided',
    college: data.college || 'Not provided',
    interests: data.interests && data.interests.length > 0 ? data.interests : ['No interests added']
  };

  const getAmountForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'hackathon': return '₹150';
      case 'workshop': return '₹100';
      case 'seminar': return '₹50';
      case 'competition': return '₹100';
      case 'debate': return '₹80';
      case 'music': return '₹120';
      case 'dance': return '₹120';
      case 'fashion': return '₹150';
      case 'theatre': return '₹100';
      case 'art': return '₹80';
      case 'fest': return '₹150';
      default: return '₹80';
    }
  };

  const recentRegistrations = registrations.map((reg, idx) => {
    const displayDate = reg.eventDate ? reg.eventDate.split(',')[0] : 'TBD';
    let statusText = 'Registered';
    if (reg.status === 'used') statusText = 'Attended';
    if (reg.status === 'cancelled') statusText = 'Cancelled';

    return {
      id: reg.ticketId || idx,
      name: reg.eventName,
      category: reg.eventCategory || 'General',
      date: displayDate,
      status: statusText,
      amount: getAmountForCategory(reg.eventCategory)
    };
  });

  const history = registrations.map((reg, idx) => {
    const displayDate = reg.eventDate ? reg.eventDate.split(',')[0] : 'TBD';
    let statusText = 'Registered';
    if (reg.status === 'used') statusText = 'Attended';
    if (reg.status === 'cancelled') statusText = 'Cancelled';

    let icon = 'question';
    let iconColor = 'blue';
    const cat = reg.eventCategory?.toLowerCase() || '';
    if (cat.includes('hack') || cat.includes('code') || cat.includes('work') || cat.includes('dev')) {
      icon = 'code';
      iconColor = 'purple';
    } else if (cat.includes('music') || cat.includes('dance') || cat.includes('band') || cat.includes('neon') || cat.includes('fashion') || cat.includes('theatre') || cat.includes('art') || cat.includes('fest')) {
      icon = 'music';
      iconColor = 'pink';
    } else if (cat.includes('seminar') || cat.includes('pitch') || cat.includes('talk') || cat.includes('presentation') || cat.includes('debate')) {
      icon = 'presentation';
      iconColor = 'orange';
    }

    return {
      id: reg.ticketId || idx,
      name: reg.eventName,
      type: `${reg.eventCategory || 'General'} Event`,
      status: statusText,
      date: displayDate,
      amount: getAmountForCategory(reg.eventCategory),
      icon,
      iconColor
    };
  });

  const totalSpent = registrations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + parseInt(getAmountForCategory(r.eventCategory).replace('₹', ''), 10), 0);

  const attendedCount = registrations.filter(r => r.status === 'used').length;

  const pointsEarned = registrations
    .filter(r => r.status !== 'cancelled')
    .reduce((sum, r) => sum + (r.status === 'used' ? 50 : 20), 0);

  let achievementsCount = 0;
  if (attendedCount >= 1) achievementsCount += 1;
  if (attendedCount >= 3) achievementsCount += 1;
  if (attendedCount >= 5) achievementsCount += 1;
  if (registrations.length > 0 && achievementsCount === 0) achievementsCount = 1;

  const participationRate = registrations.length > 0 
    ? Math.round(((attendedCount + registrations.filter(r => r.status === 'confirmed').length * 0.5) / registrations.length) * 100) 
    : 0;

  const handleEditClick = () => {
    setEditData({
      name: profileData.name !== 'User' ? profileData.name : '',
      dob: profileData.dob !== 'Not provided' ? profileData.dob : '',
      yearOfStudy: profileData.yearOfStudy !== 'Not provided' ? profileData.yearOfStudy : '',
      department: profileData.department !== 'Not provided' ? profileData.department : '',
      college: profileData.college !== 'Not provided' ? profileData.college : '',
      phone: profileData.phone !== 'Not provided' ? profileData.phone : '',
      interests: profileData.interests[0] !== 'No interests added' ? profileData.interests.join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !user.uid) return;
    setSaving(true);
    try {
      const interestsArray = editData.interests.split(',').map(i => i.trim()).filter(i => i);
      const updatePayload = {
        name: editData.name,
        dob: editData.dob,
        yearOfStudy: editData.yearOfStudy,
        department: editData.department,
        college: editData.college,
        phone: editData.phone,
        interests: interestsArray
      };
      
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, updatePayload, { merge: true });
      
      setFetchedData(prev => ({ ...prev, ...updatePayload }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile. Please check permissions.");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="profile-container">
      
      {/* HEADER CARD */}
      <div className="profile-header-card">
        {/* Decorative Shapes */}
        <svg className="header-shape" width="300" height="300" viewBox="0 0 200 200" style={{top: '-50px', left: '-50px', transform: 'rotate(45deg)'}}>
          <polygon points="100,0 200,100 100,200 0,100" fill="currentColor" />
        </svg>
        <svg className="header-shape" width="150" height="150" viewBox="0 0 200 200" style={{bottom: '20px', left: '40%'}}>
          <circle cx="100" cy="100" r="100" fill="currentColor" />
        </svg>

        <div className="header-user-info">
          <div className="header-avatar-wrap">
            <AvatarInitial
              name={profileData.name}
              photoURL={user?.photoURL}
              size={100}
              className="header-avatar"
            />
            <div className="edit-avatar-btn">{Icons.edit}</div>
          </div>
          
          <div className="header-details">
            <h2>{profileData.name}</h2>
            <div className="role-badge">{profileData.role}</div>
            
            <div className="header-meta">
              <div className="header-meta-row">
                <span className="meta-item">{Icons.mail} {profileData.email}</span>
                <span className="meta-divider"></span>
                <span className="meta-item">{Icons.phone} {profileData.phone}</span>
              </div>
              <div className="header-meta-row">
                <span className="meta-item">{Icons.map} {profileData.location}</span>
              </div>
              <div className="header-meta-row">
                <span className="meta-item">{Icons.calendar} Joined on {profileData.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-id-card"></div>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        {['About Me', 'Activity', 'Achievements', 'Preferences', 'History'].map(tab => {
          const tabId = tab.toLowerCase().replace(' ', '');
          return (
            <button 
              key={tabId} 
              className={`tab-btn ${activeTab === tabId ? 'active' : ''}`}
              onClick={() => setActiveTab(tabId)}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* MAIN GRID */}
      <div className="profile-grid">
        
        {/* LEFT COLUMN */}
        <div className="left-col">
          
          <div className="profile-card personal-details-card">
            <div className="card-title">Personal Details</div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">{Icons.user}</span>
                <span className="detail-label">Full Name</span>
                {isEditing ? (
                  <input className="profile-edit-input" value={editData.name} onChange={e => handleInputChange('name', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.name}</span>
                )}
              </div>
              <div className="detail-item"></div> {/* Empty for alignment */}
              
              <div className="detail-item">
                <span className="detail-icon">{Icons.cake}</span>
                <span className="detail-label">Date of Birth</span>
                {isEditing ? (
                  <input className="profile-edit-input" placeholder="e.g. May 12, 2004" value={editData.dob} onChange={e => handleInputChange('dob', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.dob}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-icon">{Icons.graduation}</span>
                <span className="detail-label">Year of Study</span>
                {isEditing ? (
                  <input className="profile-edit-input" placeholder="e.g. 2nd Year" value={editData.yearOfStudy} onChange={e => handleInputChange('yearOfStudy', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.yearOfStudy}</span>
                )}
              </div>
              
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-icon">{Icons.building}</span>
                <span className="detail-label">Department</span>
                {isEditing ? (
                  <input className="profile-edit-input" style={{width: '100%'}} placeholder="e.g. Computer Science" value={editData.department} onChange={e => handleInputChange('department', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.department}</span>
                )}
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-icon">{Icons.building}</span>
                <span className="detail-label">College Name</span>
                {isEditing ? (
                  <input className="profile-edit-input" style={{width: '100%'}} placeholder="Enter college name" value={editData.college} onChange={e => handleInputChange('college', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.college}</span>
                )}
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">{Icons.mail}</span>
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{profileData.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">{Icons.phone}</span>
                <span className="detail-label">Phone Number</span>
                {isEditing ? (
                  <input className="profile-edit-input" placeholder="Phone Number" value={editData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                ) : (
                  <span className="detail-value">{profileData.phone}</span>
                )}
              </div>
            </div>

            <div className="interests-section">
              <div className="card-title" style={{fontSize: '16px', marginBottom: '12px'}}>Interests</div>
              {isEditing ? (
                <input 
                  className="profile-edit-input" 
                  value={editData.interests} 
                  onChange={e => handleInputChange('interests', e.target.value)}
                  placeholder="Comma separated interests..."
                  style={{width: '100%'}}
                />
              ) : (
                <div className="interests-tags">
                  {profileData.interests.map((interest, idx) => (
                    <span key={idx} className="interest-tag">{interest}</span>
                  ))}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="edit-actions">
                <button className="cancel-profile-btn" onClick={handleCancelEdit} disabled={saving}>Cancel</button>
                <button className="save-profile-btn" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button className="edit-profile-btn" onClick={handleEditClick}>Edit Profile</button>
            )}
          </div>

          <div className="profile-card recent-registrations-card">
            <div className="card-title">
              Recent Registrations
              <span className="view-all-link">View All</span>
            </div>
            <div className="registrations-table-wrap">
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '24px 8px', color: '#6b7280', fontSize: '14px' }}>
                        No registrations found. Explore events and register!
                      </td>
                    </tr>
                  ) : (
                    recentRegistrations.map(reg => (
                      <tr key={reg.id}>
                        <td className="event-name">{reg.name}</td>
                        <td>
                          <span className={`cat-badge cat-${reg.category.toLowerCase().replace('-','')}`}>
                            {reg.category}
                          </span>
                        </td>
                        <td>{reg.date}</td>
                        <td>
                          <span className={`status-badge status-${reg.status.substring(0,3).toLowerCase()}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="amount-text">{reg.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="right-col">
          
          <div className="profile-card registration-history-card">
            <div className="card-title">
              Registration History
              <span className="view-all-link">View All</span>
            </div>
            
            <div className="timeline-list">
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: '#6b7280', fontSize: '14px' }}>
                  No event history found.
                </div>
              ) : (
                history.map(item => (
                  <div key={item.id} className="timeline-item">
                    <div className={`timeline-icon icon-${item.iconColor}`}>
                      {Icons[item.icon]}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{item.name}</div>
                      <div className="timeline-subtitle">{item.type}</div>
                      <span className={`status-badge status-${item.status.substring(0,3).toLowerCase()}`}>{item.status}</span>
                    </div>
                    <div className="timeline-right">
                      <div className="timeline-date">{item.date}</div>
                      <div className="timeline-amount">{item.amount}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="total-amount-row">
              <span className="total-label">Total Amount Spent</span>
              <span className="total-value">₹{totalSpent}</span>
            </div>
          </div>

          {/* Performance Summary card removed */}

        </div>
      </div>

    </div>
  );
}
