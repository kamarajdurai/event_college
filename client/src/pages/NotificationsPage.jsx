import React from 'react';
import './Notifications.css';

export default function NotificationsPage({ 
  announcements, 
  readIds, 
  onMarkAllAsRead, 
  onMarkSingleAsRead 
}) {
  
  const getSeverityIcon = (level) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'info':
      default: return '📢';
    }
  };

  const getRelativeTime = (isoString) => {
    try {
      const past = new Date(isoString);
      const now = new Date();
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return past.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'TBD';
    }
  };

  return (
    <div className="ep-page notifications-page">
      <div className="notifications-header">
        <div>
          <h1 className="notifications-title">Announcements & Updates</h1>
          <p className="notifications-subtitle">Stay updated with real-time news and schedule modifications from the coordinators.</p>
        </div>
        {announcements.length > 0 && (
          <button className="btn-mark-all" onClick={onMarkAllAsRead}>
            ✓ Mark All As Read
          </button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="notifications-empty">
          <div className="empty-graphic">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h3>All Caught Up!</h3>
          <p>No new announcements for your registered events at this time.</p>
        </div>
      ) : (
        <div className="notifications-timeline">
          {announcements.map((ann) => {
            const isUnread = !readIds.includes(ann.id);
            return (
              <div 
                key={ann.id} 
                className={`notif-card severity-${ann.alertLevel} ${isUnread ? 'unread' : ''}`}
                onClick={() => isUnread && onMarkSingleAsRead(ann.id)}
                style={{ cursor: isUnread ? 'pointer' : 'default' }}
              >
                <div className="notif-card-side">
                  <div className="notif-icon-circle">
                    {getSeverityIcon(ann.alertLevel)}
                  </div>
                </div>

                <div className="notif-card-main">
                  <div className="notif-card-header">
                    <div className="notif-title-row">
                      {isUnread && <span className="unread-pulse-dot" title="Unread Alert"></span>}
                      <h3>{ann.title}</h3>
                    </div>
                    <span className="notif-time">{getRelativeTime(ann.timestamp)}</span>
                  </div>

                  <p className="notif-body">{ann.body}</p>

                  <div className="notif-card-footer">
                    <div className="footer-tags">
                      <span className={`target-badge ${ann.targetType === 'all' ? 'badge-all' : 'badge-event'}`}>
                        {ann.targetType === 'all' ? '📢 All Students' : `🎟️ Event: ${ann.targetEventName || ann.targetEventId}`}
                      </span>
                      {ann.sender && <span className="sender-badge">👤 {ann.sender}</span>}
                    </div>
                    {isUnread && (
                      <span className="mark-read-hint">Click card to mark as read</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
