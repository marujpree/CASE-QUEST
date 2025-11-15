import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './Calendar.css';

function buildGoogleTemplateUrl({ title, details, location, startISO, endISO }) {
  const fmt = (iso) => {
    const d = new Date(iso);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'Event',
    details: details || '',
    location: location || '',
    dates: `${fmt(startISO)}/${fmt(endISO || startISO)}`
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function Calendar({ userId }) {
  const [tab, setTab] = useState('upload');
  const [events, setEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({ title: '', date: '', start: '', end: '', location: '', description: '' });

  const load = async () => {
    const res = await api.get(`/events/user/${userId}`);
    setEvents(res.data);
  };

  useEffect(() => { load(); }, [userId]);

  const uploadPdf = async () => {
    if (!file) return;
    setStatus('Importing...');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('userId', userId);
    try {
      const res = await api.post('/events/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus(res.data.message);
      setFile(null);
      load();
    } catch (e) {
      setStatus(`Error: ${e.response?.data?.error || e.message}`);
    }
  };

  const createManual = async () => {
    if (!form.title || !form.date) { setStatus('Title and Date required'); return; }
    const startISO = new Date(`${form.date} ${form.start || '09:00'}`).toISOString();
    const endISO = form.end ? new Date(`${form.date} ${form.end}`).toISOString() : null;
    try {
      await api.post('/events', { userId, title: form.title, description: form.description, location: form.location, startTime: startISO, endTime: endISO, allDay: !form.start && !form.end });
      setStatus('Event created');
      setForm({ title: '', date: '', start: '', end: '', location: '', description: '' });
      load();
    } catch (e) {
      setStatus(`Error: ${e.response?.data?.error || e.message}`);
    }
  };

  const exportIcs = () => {
    window.location.href = `/api/events/user/${userId}/ics`;
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2>Calendar</h2>
        <button className="btn-primary" onClick={exportIcs}>Export .ics</button>
      </div>

      <div className="calendar-tabs">
        <button className={`tab-btn ${tab==='upload'?'active':''}`} onClick={() => setTab('upload')}>Upload PDF</button>
        <button className={`tab-btn ${tab==='manual'?'active':''}`} onClick={() => setTab('manual')}>Manual Entry</button>
        <button className={`tab-btn ${tab==='list'?'active':''}`} onClick={() => setTab('list')}>Events</button>
      </div>

      {tab === 'upload' && (
        <div className="section">
          <h3>Upload syllabus or schedule PDF</h3>
          <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
          <div style={{ marginTop: 8 }}>
            <button className="btn-primary" onClick={uploadPdf} disabled={!file}>Import Events</button>
          </div>
          {status && <p className="hint">{status}</p>}
        </div>
      )}

      {tab === 'manual' && (
        <div className="section">
          <h3>Add event manually</h3>
          <div className="form-row">
            <input className="form-input" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className="form-input" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <input className="form-input" type="time" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} />
            <input className="form-input" type="time" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} />
          </div>
          <div className="form-row">
            <input className="form-input" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="form-row">
            <textarea className="form-textarea" placeholder="Notes" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <button className="btn-primary" onClick={createManual}>Create Event</button>
          {status && <p className="hint">{status}</p>}
        </div>
      )}

      {tab === 'list' && (
        <div className="section">
          <h3>Your events</h3>
          <div className="events-list">
            {events.map(ev => (
              <div className="event-card" key={ev.id}>
                <strong>{ev.title}</strong>
                <div>{new Date(ev.start_time).toLocaleString()} {ev.end_time ? ' - ' + new Date(ev.end_time).toLocaleTimeString() : ''}</div>
                {ev.location && <div>{ev.location}</div>}
                {ev.description && <div className="hint">{ev.description}</div>}
                <div className="event-actions">
                  <a className="btn-primary" href={`/api/events/${ev.id}/ics`}>Download .ics</a>
                  {ev.start_time && (
                    <a className="btn-primary" href={buildGoogleTemplateUrl({ title: ev.title, details: ev.description, location: ev.location, startISO: ev.start_time, endISO: ev.end_time })} target="_blank" rel="noreferrer">Add to Google (no auth)</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
