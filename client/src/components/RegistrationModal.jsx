import React, { useState, useEffect } from 'react';
import './RegistrationModal.css';
import { API_BASE_URL } from '../config';

const Icons = {
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  mail: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22"/><line x1="15" y1="22" x2="15" y2="22"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="12" y1="6" x2="12.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/>
    </svg>
  ),
  lock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  creditCard: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  gift: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  copy: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
};

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other'
];

export default function RegistrationModal({ event, user, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState(2);
  const [members, setMembers] = useState([
    { name: '', email: '', phone: '', department: '', college: '' },
    { name: '', email: '', phone: '', department: '', college: '' }
  ]);
  const [paymentOption, setPaymentOption] = useState('pay_now'); // pay_now | pay_later | free
  const [paymentMethod, setPaymentMethod] = useState('qr'); // qr | upi
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPaymentScreenshot(dataUrl);
        setError('');
      };
      img.onerror = () => {
        setError('Error loading image. Please try another screenshot.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Auto-fill member 1 details using current user info
  useEffect(() => {
    if (user) {
      setMembers(prev => {
        const updated = [...prev];
        if (updated[0]) {
          updated[0].name = updated[0].name || user.displayName || '';
          updated[0].email = updated[0].email || user.email || '';
          updated[0].college = updated[0].college || 'Knowledge institute of technology';
        }
        return updated;
      });
    }
  }, [user]);

  // Adjust members list size based on team size selection
  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    setTeamSize(size);
    setMembers(prev => {
      const updated = [...prev];
      while (updated.length < size) {
        updated.push({ name: '', email: '', phone: '', department: '', college: '' });
      }
      while (updated.length > size) {
        updated.pop();
      }
      return updated;
    });
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const addAnotherMember = () => {
    if (teamSize < 4) {
      handleTeamSizeChange(teamSize + 1);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText('eventclg@upi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      // Team details step
      return true;
    }
    if (step === 2) {
      // Member details step validation
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        if (!m.name.trim()) return `Member ${i + 1} Name is required.`;
        if (!m.email.trim()) return `Member ${i + 1} Email is required.`;
        if (!m.phone.trim() || m.phone.length < 10) return `Member ${i + 1} Phone Number must be at least 10 digits.`;
        if (!m.department) return `Member ${i + 1} Department must be selected.`;
        if (!m.college.trim()) return `Member ${i + 1} College Name is required.`;
      }
      return true;
    }
    if (step === 3) {
      // Payment step validation
      if (!paymentScreenshot) {
        return 'Please upload a screenshot of your payment.';
      }
      if (!transactionId.trim()) {
        return 'Please enter the UPI Transaction ID / UTR number for verification.';
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    const validationResult = validateStep();
    if (validationResult === true) {
      setStep(prev => prev + 1);
    } else {
      setError(validationResult);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      // Format details for DB registration structure
      const leader = members[0];
      const teamExtras = members.slice(1);

      const API_BASE = API_BASE_URL;
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          leader.name.trim(),
          email:         leader.email.trim(),
          phone:         leader.phone.trim(),
          college:       leader.college.trim(),
          department:    leader.department,
          teamSize:      teamSize,
          teamMembers:   teamExtras,
          eventId:       event.id,
          eventName:     event.title,
          eventCategory: event.category,
          categoryGroup: event.categoryGroup || 'tech',
          eventDate:     `${event.day || '25'} ${event.month || 'MAY'} 2025, ${event.time || '09:00 AM'}`,
          eventVenue:    event.venue,
          userId:        user?.uid || null,
          paymentOption,
          paymentMethod: paymentOption === 'pay_now' ? paymentMethod : null,
          transactionId: paymentOption === 'pay_now' ? transactionId.trim() : null,
          paymentScreenshot: paymentOption === 'pay_now' ? paymentScreenshot : null
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        return;
      }

      onSuccess(data.ticket);
      onClose();
    } catch (err) {
      setError('Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // QR Code Generation based on team size & registration fee (assume 100 INR per member)
  const registrationFee = teamSize * 100;
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    `upi://pay?pa=eventclg@upi&pn=Event%20Registration&am=${registrationFee}&cu=INR`
  )}`;

  return (
    <div className="rm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rm-modal-container">
        
        {/* Modal Close Button */}
        <button className="rm-close-btn" onClick={onClose} title="Close Modal">
          {Icons.close}
        </button>

        {/* ─── Header Banner ─── */}
        <div className="rm-header-banner">
          <div className="rm-header-content">
            <div className="rm-header-title-row">
              <div className="rm-header-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <div>
                <h1>Event Registration</h1>
                <p>Fill in the details below to register for the event.</p>
              </div>
            </div>
          </div>
          <div className="rm-header-illustration">
            <img src="/hero_illustration.png" alt="Registration Illustration" />
          </div>
        </div>

        {/* ─── Stepper Progress Bar ─── */}
        <div className="rm-stepper">
          {[
            { num: 1, label: 'Team Details' },
            { num: 2, label: 'Member Details' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Submit' }
          ].map(s => (
            <div key={s.num} className={`rm-step-item ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}>
              <div className="rm-step-node">
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="rm-step-label">{s.label}</span>
              {s.num < 4 && <div className="rm-step-line" />}
            </div>
          ))}
        </div>

        {/* ─── Step Content Container ─── */}
        <div className="rm-step-content">
          {error && <div className="rm-error-alert">⚠️ {error}</div>}

          {/* STEP 1: Team Details */}
          {step === 1 && (
            <div className="rm-form-section fade-in">
              <h3 className="rm-section-title">
                <span className="rm-title-icon">{Icons.user}</span>
                Team Size
              </h3>
              <div className="rm-form-group">
                <div className="rm-select-wrapper">
                  <select 
                    value={teamSize} 
                    onChange={(e) => handleTeamSizeChange(e.target.value)}
                    className="rm-select-element"
                  >
                    <option value="1">1 Member</option>
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                  </select>
                </div>
              </div>
              <div className="rm-instruction-card">
                <p>Select how many members are participating in your team. In the next step, you will be prompted to provide the full details for each participant.</p>
              </div>
            </div>
          )}

          {/* STEP 2: Member Details */}
          {step === 2 && (
            <div className="rm-form-section fade-in">
              <h3 className="rm-section-title">
                <span className="rm-title-icon">{Icons.user}</span>
                Member Details
              </h3>
              
              <div className="rm-members-scroll">
                {members.map((member, index) => (
                  <div key={index} className="rm-member-card">
                    <div className="rm-member-card-header">
                      <span className="rm-member-num">👤 Member {index + 1} {index === 0 && "(Leader)"}</span>
                    </div>

                    <div className="rm-inputs-grid">
                      {/* Name */}
                      <div className="rm-input-field">
                        <label>Full Name</label>
                        <div className="rm-input-wrapper">
                          <span className="rm-field-icon">{Icons.user}</span>
                          <input 
                            type="text" 
                            placeholder="Enter full name"
                            value={member.name}
                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="rm-input-field">
                        <label>Email Address</label>
                        <div className="rm-input-wrapper">
                          <span className="rm-field-icon">{Icons.mail}</span>
                          <input 
                            type="email" 
                            placeholder="Enter email address"
                            value={member.email}
                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="rm-input-field">
                        <label>Phone Number</label>
                        <div className="rm-input-wrapper">
                          <span className="rm-field-icon">{Icons.phone}</span>
                          <input 
                            type="tel" 
                            placeholder="Enter 10 digit phone number"
                            value={member.phone}
                            onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Department */}
                      <div className="rm-input-field">
                        <label>Department</label>
                        <div className="rm-input-wrapper">
                          <span className="rm-field-icon">{Icons.building}</span>
                          <select 
                            value={member.department}
                            onChange={(e) => handleMemberChange(index, 'department', e.target.value)}
                            required
                          >
                            <option value="">Select department</option>
                            {DEPARTMENTS.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* College */}
                      <div className="rm-input-field" style={{ gridColumn: '1 / -1' }}>
                        <label>College Name</label>
                        <div className="rm-input-wrapper">
                          <span className="rm-field-icon">{Icons.building}</span>
                          <input 
                            type="text" 
                            placeholder="Enter college name"
                            value={member.college}
                            onChange={(e) => handleMemberChange(index, 'college', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {teamSize < 4 && (
                <button className="rm-add-member-btn" onClick={addAnotherMember}>
                  <span>+</span> Add Another Member
                </button>
              )}
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="rm-form-section fade-in">
              <h3 className="rm-section-title">
                <span className="rm-title-icon">{Icons.creditCard}</span>
                Payment Method
              </h3>

              <div className="rm-payment-methods-wrap fade-in">
                <div className="rm-method-tabs">
                  <button 
                    className={`rm-method-tab ${paymentMethod === 'qr' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('qr')}
                  >
                    QR Code
                  </button>
                  <button 
                    className={`rm-method-tab ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    UPI Transfer
                  </button>
                </div>

                {paymentMethod === 'qr' ? (
                  <div className="rm-method-pane fade-in">
                    <div className="rm-qr-pane-layout">
                      <div className="rm-qr-code-box">
                        <img src={qrDataUrl} alt="Payment QR Code" />
                      </div>
                      <div className="rm-qr-info">
                        <h4>Scan & Pay</h4>
                        <p>Scan the QR code using any UPI app to make the payment of <strong>₹{registrationFee}</strong>.</p>
                        
                        <div className="rm-upi-brands">
                          <span className="rm-upi-badge gpay">GPay</span>
                          <span className="rm-upi-badge phonepe">PhonePe</span>
                          <span className="rm-upi-badge paytm">Paytm</span>
                          <span className="rm-upi-badge bhim">BHIM UPI</span>
                        </div>

                        <span className="rm-verify-note">After payment, click the button below to verify.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rm-method-pane fade-in">
                    <div className="rm-upi-transfer-layout">
                      <div className="rm-upi-details-card">
                        <div className="rm-upi-field-row">
                          <span className="rm-upi-lbl">UPI ID</span>
                          <span className="rm-upi-val">eventclg@upi</span>
                          <button className="rm-copy-upi-btn" onClick={copyUPI}>
                            {Icons.copy} {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                        <div className="rm-upi-field-row">
                          <span className="rm-upi-lbl">Total Amount</span>
                          <span className="rm-upi-val"><strong>₹{registrationFee}</strong></span>
                        </div>
                      </div>
                      <p className="rm-upi-instruct-text">Send the total amount above using any UPI app (like GPay, PhonePe, Paytm) to the specified UPI ID. Once transferred, enter the 12-digit transaction ID / UTR below.</p>
                    </div>
                  </div>
                )}

                {/* Transaction ID input */}
                <div className="rm-transaction-input-box">
                  <label>UPI Transaction ID / UTR *</label>
                  <div className="rm-input-wrapper">
                    <span className="rm-field-icon">{Icons.creditCard}</span>
                    <input 
                      type="text" 
                      placeholder="Enter 12-digit UPI transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      maxLength="16"
                      required
                    />
                  </div>
                </div>

                {/* Screenshot upload */}
                <div className="rm-screenshot-upload-box">
                  <label>Upload Payment Screenshot *</label>
                  {!paymentScreenshot ? (
                    <div className="rm-screenshot-dropzone">
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="screenshot-file-input"
                        onChange={handleScreenshotChange}
                        className="rm-file-input-hidden"
                      />
                      <label htmlFor="screenshot-file-input" className="rm-dropzone-label">
                        <div className="rm-dropzone-icon">📤</div>
                        <div className="rm-dropzone-text">
                          <strong>Click to upload screenshot</strong>
                        </div>
                        <div className="rm-dropzone-subtext">PNG, JPG, or JPEG formats</div>
                      </label>
                    </div>
                  ) : (
                    <div className="rm-screenshot-preview-container">
                      <div className="rm-screenshot-preview-wrapper">
                        <img src={paymentScreenshot} alt="Payment Proof Preview" className="rm-screenshot-preview" />
                        <button 
                          type="button" 
                          className="rm-remove-screenshot-btn" 
                          onClick={() => setPaymentScreenshot(null)}
                          title="Remove Screenshot"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="rm-screenshot-success-msg">✓ Screenshot loaded successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="rm-form-section fade-in">
              <h3 className="rm-section-title">
                <span className="rm-title-icon">{Icons.send}</span>
                Review Registration
              </h3>

              <div className="rm-review-card">
                <div className="rm-review-header">
                  <h4>{event.title}</h4>
                  <span className="rm-review-cat-badge">{event.category}</span>
                </div>
                
                <div className="rm-review-details-grid">
                  <div className="rm-review-detail-col">
                    <span className="rm-review-lbl">TEAM SIZE</span>
                    <span className="rm-review-val">{teamSize} {teamSize === 1 ? 'Member' : 'Members'}</span>
                  </div>
                  <div className="rm-review-detail-col">
                    <span className="rm-review-lbl">PAYMENT METHOD</span>
                    <span className="rm-review-val">
                      {paymentMethod === 'qr' ? 'QR Code Scan' : 'UPI Transfer'}
                    </span>
                  </div>
                  <div className="rm-review-detail-col" style={{ gridColumn: '1 / -1' }}>
                    <span className="rm-review-lbl">TRANSACTION ID / UTR</span>
                    <span className="rm-review-val code-font">{transactionId}</span>
                  </div>
                </div>

                <div className="rm-review-members-section">
                  <h5>Team Participants</h5>
                  <div className="rm-review-members-list">
                    {members.map((m, idx) => (
                      <div key={idx} className="rm-review-member-row">
                        <div className="rm-review-m-dot" />
                        <div className="rm-review-m-info">
                          <strong>{m.name}</strong> ({m.department})
                          <p>{m.email} • {m.phone}</p>
                          <p className="college-text">{m.college}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Modal Navigation Controls ─── */}
        <div className="rm-modal-footer">
          {step > 1 ? (
            <button className="rm-btn-secondary" onClick={handleBack} disabled={loading}>
              Back
            </button>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {step < 4 ? (
            <button className="rm-btn-primary" onClick={handleNext}>
              Next Step
            </button>
          ) : (
            <button className="rm-btn-primary rm-btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <div className="rm-spinner" />
              ) : (
                <>
                  Submit Registration {Icons.send}
                </>
              )}
            </button>
          )}
        </div>

        {/* Secure notice footer */}
        <div className="rm-secure-footer">
          {Icons.lock} Your information is secure and encrypted
        </div>

      </div>
    </div>
  );
}
