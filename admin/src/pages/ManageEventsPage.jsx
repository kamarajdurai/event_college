import { useState, useEffect } from 'react';
import './ManageEvents.css';
import { API_BASE_URL } from '../config';

export default function ManageEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null); // null, 'tech', 'nontech', 'cultural'
  const [editingEvent, setEditingEvent] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('');
  const [categoryGroup, setCategoryGroup] = useState('tech');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('MAY');
  const [venue, setVenue] = useState('');
  const [time, setTime] = useState('');
  const [img, setImg] = useState('');
  const [emoji, setEmoji] = useState('📅');
  const [gradient, setGradient] = useState('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');

  // Gallery Management States
  const [managingGalleryEvent, setManagingGalleryEvent] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoImage, setNewPhotoImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (managingGalleryEvent) {
      fetchGalleryPhotos(managingGalleryEvent.id);
    }
  }, [managingGalleryEvent]);

  const fetchGalleryPhotos = async (eventId) => {
    setGalleryLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events/${eventId}/photos`);
      const data = await res.json();
      if (data.success) {
        setGalleryPhotos(data.photos || []);
      }
    } catch (err) {
      console.error("Error loading gallery photos:", err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleOpenGalleryModal = (evt) => {
    setManagingGalleryEvent(evt);
    setNewPhotoCaption('');
    setNewPhotoImage(null);
  };

  const handlePhotoUploadChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        
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
        setNewPhotoImage(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhotoSubmit = async (e) => {
    e.preventDefault();
    if (!newPhotoImage) {
      alert("Please choose a photo first.");
      return;
    }
    setUploadingPhoto(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events/${managingGalleryEvent.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: newPhotoImage,
          caption: newPhotoCaption
        })
      });
      const data = await res.json();
      if (data.success) {
        setGalleryPhotos(prev => [data.photo, ...prev]);
        setNewPhotoImage(null);
        setNewPhotoCaption('');
        const fileInput = document.getElementById('gallery-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        alert(data.message || "Failed to upload photo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/events/${managingGalleryEvent.id}/photos/${photoId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setGalleryPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        alert(data.message || "Failed to delete photo.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting photo.");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = (defaultGroup = 'tech') => {
    setEditingEvent(null);
    setTitle('');
    setDesc('');
    setCategory(defaultGroup === 'tech' ? 'Hackathon' : defaultGroup === 'nontech' ? 'Competition' : 'Music');
    setCategoryGroup(defaultGroup);
    setDay('12');
    setMonth('JUN');
    setVenue('Seminar Hall');
    setTime('10:00 AM – 04:00 PM');
    setImg(defaultGroup === 'tech' ? '/tech_event.png' : defaultGroup === 'nontech' ? '/quiz_card.png' : '/cultural_event.png');
    setEmoji(defaultGroup === 'tech' ? '🖥️' : defaultGroup === 'nontech' ? '🎤' : '🎭');
    setGradient('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
    setShowFormModal(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDesc(evt.desc);
    setCategory(evt.category);
    setCategoryGroup(evt.categoryGroup || 'tech');
    setDay(evt.day || '01');
    setMonth(evt.month || 'MAY');
    setVenue(evt.venue || 'TBD');
    setTime(evt.time || 'TBD');
    setImg(evt.img || '');
    setEmoji(evt.emoji || '📅');
    setGradient(evt.gradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
    setShowFormModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      desc,
      category,
      categoryGroup,
      day,
      month,
      venue,
      time,
      img: img || null,
      gradient: gradient || null,
      emoji: emoji || null
    };

    try {
      let res, data;
      if (editingEvent) {
        res = await fetch(`${API_BASE_URL}/events/${editingEvent.categoryGroup}/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_BASE_URL}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      data = await res.json();
      if (data.success) {
        setMessage(editingEvent ? '✨ Event updated successfully!' : '🎉 New event created successfully!');
        setShowFormModal(false);
        fetchEvents();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Check server console.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this event? This will invalidate registrations.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/events/${selectedGroup}/${eventId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setMessage('🗑️ Event removed successfully.');
        fetchEvents();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    }
  };

  const techEvents = events.filter(e => e.categoryGroup === 'tech');
  const nonTechEvents = events.filter(e => e.categoryGroup === 'nontech');
  const culturalEvents = events.filter(e => e.categoryGroup === 'cultural');

  const getFilteredEvents = () => {
    if (selectedGroup === 'tech') return techEvents;
    if (selectedGroup === 'nontech') return nonTechEvents;
    if (selectedGroup === 'cultural') return culturalEvents;
    return [];
  };

  const getGroupName = () => {
    if (selectedGroup === 'tech') return 'Tech Events';
    if (selectedGroup === 'nontech') return 'Non-Tech Events';
    if (selectedGroup === 'cultural') return 'Cultural Events';
    return '';
  };

  const getGroupIcon = () => {
    if (selectedGroup === 'tech') return '🖥️';
    if (selectedGroup === 'nontech') return '🎤';
    if (selectedGroup === 'cultural') return '🎭';
    return '';
  };

  return (
    <div className="manage-events-page">
      {message && (
        <div className="status-notification-banner">
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="events-loading">Fetching event catalogue...</div>
      ) : selectedGroup === null ? (
        /* LEVEL 1: CATEGORY SELECTION GRID */
        <div className="categories-selection-view">
          <div className="view-header">
            <h1>Event Categories</h1>
            <p>Select a category grid to view details and manage event CRUD operations.</p>
          </div>

          <div className="category-portal-grid">
            
            {/* TECH PORTAL CARD */}
            <div className="portal-card p-tech" onClick={() => setSelectedGroup('tech')}>
              <div className="portal-card-glow"></div>
              <div className="portal-icon-box">🖥️</div>
              <h2>Tech Events</h2>
              <p>Hackathons, Workshops, Seminars, and DevOps challenges.</p>
              <div className="portal-count">{techEvents.length} Events registered</div>
              <button className="portal-action-btn">
                Access Operations →
              </button>
            </div>

            {/* NON-TECH PORTAL CARD */}
            <div className="portal-card p-nontech" onClick={() => setSelectedGroup('nontech')}>
              <div className="portal-card-glow"></div>
              <div className="portal-icon-box">🎤</div>
              <h2>Non-Tech Events</h2>
              <p>Debates, Quizzes, Stock Markets, and Business Pitches.</p>
              <div className="portal-count">{nonTechEvents.length} Events registered</div>
              <button className="portal-action-btn">
                Access Operations →
              </button>
            </div>

            {/* CULTURAL PORTAL CARD */}
            <div className="portal-card p-cultural" onClick={() => setSelectedGroup('cultural')}>
              <div className="portal-card-glow"></div>
              <div className="portal-icon-box">🎭</div>
              <h2>Cultural Events</h2>
              <p>DJs, Street Dance, Cosplays, Comedy, and Fashion Shows.</p>
              <div className="portal-count">{culturalEvents.length} Events registered</div>
              <button className="portal-action-btn">
                Access Operations →
              </button>
            </div>

          </div>
        </div>
      ) : (
        /* LEVEL 2: DETAILED CRUD PANEL */
        <div className="crud-details-view">
          <div className="crud-header">
            <button className="btn-back-portal" onClick={() => setSelectedGroup(null)}>
              ← Back to Categories
            </button>
            
            <div className="header-title-row">
              <div className="title-left">
                <span className="title-icon">{getGroupIcon()}</span>
                <div>
                  <h1>{getGroupName()}</h1>
                  <p>Database management for {getGroupName().toLowerCase()}.</p>
                </div>
              </div>
              
              <button className="add-event-btn-main" onClick={() => handleOpenCreateModal(selectedGroup)}>
                ➕ Add {selectedGroup === 'tech' ? 'Tech' : selectedGroup === 'nontech' ? 'Non-Tech' : 'Cultural'} Event
              </button>
            </div>
          </div>

          <div className="events-table-card">
            <div className="table-header-row">
              <h2>Active Listings ({getFilteredEvents().length})</h2>
            </div>
            
            <div className="events-table-wrap">
              {getFilteredEvents().length === 0 ? (
                <div className="empty-category-notice">
                  <span className="notice-icon">📅</span>
                  <h3>No events catalogued in this division yet.</h3>
                  <button className="btn-save" onClick={() => handleOpenCreateModal(selectedGroup)}>
                    Create First Event
                  </button>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Event Details</th>
                      <th>Tag</th>
                      <th>Schedule</th>
                      <th>Venue</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredEvents().map(evt => (
                      <tr key={evt.id}>
                        <td>
                          <div className="event-info-cell">
                            {evt.img ? (
                              <img src={evt.img} alt={evt.title} className="table-event-img" />
                            ) : (
                              <div className="table-event-fallback" style={{ background: evt.gradient || '#6366f1' }}>
                                {evt.emoji || '🎭'}
                              </div>
                            )}
                            <div className="event-info-texts">
                              <strong>{evt.title}</strong>
                              <span>{evt.desc ? evt.desc.substring(0, 70) + '...' : 'No description.'}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="class-badge">{evt.category}</span>
                        </td>
                        <td>
                          <div className="schedule-cell">
                            <strong>{evt.day} {evt.month} 2025</strong>
                            <span>{evt.time}</span>
                          </div>
                        </td>
                        <td>
                          <span className="venue-cell">📍 {evt.venue}</span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="btn-gallery-manage" onClick={() => handleOpenGalleryModal(evt)} title="Manage Gallery">
                              📸 Gallery
                            </button>
                            <button className="btn-edit" onClick={() => handleOpenEditModal(evt)} title="Edit Event">
                              ✏️ Edit
                            </button>
                            <button className="btn-delete" onClick={() => handleDeleteEvent(evt.id)} title="Delete Event">
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL OVERLAY */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event Details' : 'Initialize New Event'}</h2>
              <button className="modal-close-btn" onClick={() => setShowFormModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSaveEvent} className="event-form">
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Event Title</label>
                  <input
                    type="text"
                    placeholder="e.g. AI-ML Hackathon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Category Group</label>
                  <select value={categoryGroup} onChange={(e) => setCategoryGroup(e.target.value)}>
                    <option value="tech">Tech (🖥️)</option>
                    <option value="nontech">Non-Tech (🎤)</option>
                    <option value="cultural">Cultural (🎭)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Provide an overview of the event, guidelines, or details..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Type (Tag)</label>
                  <input
                    type="text"
                    placeholder="e.g. Hackathon, Workshop, Dance"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Day (DD)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Month (MMM)</label>
                  <input
                    type="text"
                    placeholder="e.g. JUN"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab 3, Block C"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Timing (Time Slot)</label>
                  <input
                    type="text"
                    placeholder="e.g. 09:30 AM – 04:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Cover Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. /tech_event.png"
                  value={img}
                  onChange={(e) => setImg(e.target.value)}
                />
              </div>

              <div className="form-row border-top-form">
                <div className="form-group flex-1">
                  <label>Fallback Emoji (No Image)</label>
                  <input
                    type="text"
                    placeholder="e.g. 🤖"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                  />
                </div>
                <div className="form-group flex-2">
                  <label>Fallback Gradient CSS (No Image)</label>
                  <input
                    type="text"
                    placeholder="linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
                    value={gradient}
                    onChange={(e) => setGradient(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowFormModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingEvent ? 'Save Changes' : 'Initialize Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY MANAGEMENT MODAL */}
      {managingGalleryEvent && (
        <div className="modal-overlay" onClick={() => setManagingGalleryEvent(null)}>
          <div className="modal-content gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📸 Gallery Manager</h2>
              <button className="modal-close-btn" onClick={() => setManagingGalleryEvent(null)}>×</button>
            </div>
            
            <div className="gallery-manager-body">
              <div className="gallery-event-title-badge">
                <strong>Event:</strong> {managingGalleryEvent.title}
              </div>

              {/* Upload Photo Section */}
              <form onSubmit={handleUploadPhotoSubmit} className="gallery-upload-form">
                <h3>Upload New Photo</h3>
                <div className="gallery-upload-fields">
                  <div className="form-group">
                    <label>Choose Image</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="gallery-file-input"
                      onChange={handlePhotoUploadChange}
                      required={!newPhotoImage}
                    />
                    {newPhotoImage && (
                      <div className="gallery-upload-preview">
                        <img src={newPhotoImage} alt="Preview" />
                        <button type="button" className="btn-remove-preview" onClick={() => setNewPhotoImage(null)}>✕</button>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Caption / Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Winner receiving the prize" 
                      value={newPhotoCaption}
                      onChange={(e) => setNewPhotoCaption(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-save btn-upload-photo" disabled={uploadingPhoto || !newPhotoImage}>
                    {uploadingPhoto ? "Uploading..." : "Upload to Gallery"}
                  </button>
                </div>
              </form>

              {/* Grid of Existing Photos */}
              <div className="gallery-manager-grid-section">
                <h3>Current Gallery ({galleryPhotos.length} photos)</h3>
                {galleryLoading ? (
                  <div className="gallery-manager-loading">Loading photos...</div>
                ) : galleryPhotos.length === 0 ? (
                  <div className="gallery-manager-empty">No photos in gallery yet. Upload some above!</div>
                ) : (
                  <div className="gallery-manager-grid">
                    {galleryPhotos.map(photo => (
                      <div key={photo.id} className="gallery-manager-item">
                        <img src={photo.image} alt={photo.caption} />
                        <div className="gallery-manager-item-overlay">
                          <span className="gallery-manager-item-caption" title={photo.caption}>{photo.caption || "No Caption"}</span>
                          <button 
                            type="button" 
                            className="btn-delete-photo" 
                            onClick={() => handleDeletePhoto(photo.id)}
                            title="Delete Photo"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
