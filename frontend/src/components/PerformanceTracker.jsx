import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';

// ─── Google Fonts ──────────────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;500;600&display=swap';
document.head.appendChild(fontLink);

// ─── Global Styles ─────────────────────────────────────────────────────────────
const styleTag = document.createElement('style');
styleTag.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #F5F5F2; font-family: 'Open Sans', sans-serif; }
  :root {
    --primary: #1A3A5C;
    --primary-light: #2B5C8A;
    --accent: #E84C4C;
    --accent2: #F5A623;
    --bg: #F5F5F2;
    --card: #FFFFFF;
    --border: #E8E8E4;
    --text: #1C1C1C;
    --muted: #7A7A7A;
    --done: #22A05B;
    --inprog: #2B7DD4;
    --blocked: #E84C4C;
    --notstart: #9B9B9B;
    --high: #E84C4C;
    --med: #F5A623;
    --low: #9B9B9B;
    --pie-p: #1A3A5C;
    --pie-i: #9B59B6;
    --pie-e: #27AE60;
  }
  h1,h2,h3,h4,h5,h6 { font-family: 'Montserrat', sans-serif; }
  .scroll-hide::-webkit-scrollbar { display: none; }
  .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
  .fade-in { animation: fadeIn 0.28s ease forwards; }
  .slide-in { animation: slideIn 0.22s ease forwards; }
  input, select, textarea { font-family: 'Open Sans', sans-serif; }
  input:focus, select:focus, textarea:focus { outline: 2px solid var(--primary-light); outline-offset: 0; }
  button { cursor: pointer; font-family: 'Open Sans', sans-serif; }
  .row-hover:hover { background: #F0F4F8 !important; }
  .tab-btn { transition: all 0.18s ease; }
  .tab-btn:hover { opacity: 0.85; }
  .pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; white-space: nowrap; }
  .card { background: var(--card); border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
  .progress-bar-bg { background: #EAF0F7; border-radius: 99px; overflow: hidden; }
  .progress-bar-fill { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(20,30,45,0.45); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
  .modal-box { background: white; border-radius: 16px; max-width: 740px; width: 95vw; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.22); }
  .section-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .brag-card { background: #0F1E32; border-radius: 12px; padding: 24px; position: relative; overflow: hidden; }
  .brag-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--accent2), var(--accent)); }
  select option { font-family: 'Open Sans', sans-serif; }
  .checkbox-custom { width: 17px; height: 17px; border: 2px solid var(--border); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
  .checkbox-custom.checked { background: var(--done); border-color: var(--done); }
`;
if (!document.head.querySelector('style[data-tracker="true"]')) {
  styleTag.setAttribute('data-tracker', 'true');
  document.head.appendChild(styleTag);
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUSES = ['Not Started', 'In Progress', 'Blocked', 'Done'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const PIE = ['Performance', 'Image', 'Exposure'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const REVIEWS = ['Mid-Year', 'Annual', 'Both'];
const VISIBILITY = ['Manager Only', 'Director', 'VP', 'Exec/C-Suite', 'Cross-functional'];
const SKILLS_LIST = ['Strategy', 'Communication', 'Leadership', 'Analytics', 'Project Management', 'Relationship Building', 'Innovation', 'Operations'];

const statusColor = { 'Done': '#D4F5E4', 'In Progress': '#DCF0FF', 'Blocked': '#FFE0E0', 'Not Started': '#EFEFEF' };
const statusText = { 'Done': '#0A7A40', 'In Progress': '#0A5FAA', 'Blocked': '#C0392B', 'Not Started': '#7A7A7A' };
const priorityColor = { 'High': '#FFE0E0', 'Medium': '#FFF3DC', 'Low': '#EFEFEF' };
const priorityText = { 'High': '#C0392B', 'Medium': '#B7770D', 'Low': '#7A7A7A' };
const pieColor = { 'Performance': '#E8F0FA', 'Image': '#F3E8FD', 'Exposure': '#E8FAF0' };
const pieText = { 'Performance': '#1A3A5C', 'Image': '#6C2FA0', 'Exposure': '#1A7A42' };

// ─── Helper Components ─────────────────────────────────────────────────────────
const Checkbox = ({ checked, onChange }) => (
  <div className="checkbox-custom" style={{ background: checked ? 'var(--done)' : 'white', borderColor: checked ? 'var(--done)' : 'var(--border)' }} onClick={onChange}>
    {checked && <span style={{ color: 'white', fontSize: '12px' }}>✓</span>}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className="pill" style={{ background: statusColor[status] || '#EEE', color: statusText[status] || '#666' }}>
    {status}
  </span>
);

const PriorityBadge = ({ priority }) => (
  <span className="pill" style={{ background: priorityColor[priority] || '#EEE', color: priorityText[priority] || '#666' }}>
    {priority}
  </span>
);

const PieBadge = ({ pie }) => (
  <span className="pill" style={{ background: pieColor[pie] || '#EEE', color: pieText[pie] || '#666' }}>
    {pie}
  </span>
);

const QuarterBadge = ({ q }) => (
  <span className="pill" style={{ background: '#F0F4F8', color: '#1A3A5C', fontWeight: 700 }}>
    {q}
  </span>
);

const EmptyState = () => (
  <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--muted)' }}>
    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
    <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--text)', marginBottom: '6px' }}>
      No tasks yet
    </div>
    <div style={{ fontSize: '13px' }}>Add your first achievement to get started</div>
  </div>
);

const TextInput = ({ value, onChange, placeholder, multiline = false, rows = 3 }) => (
  multiline ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: "'Open Sans', sans-serif",
        resize: 'vertical',
      }}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: "'Open Sans', sans-serif",
      }}
    />
  )
);

// ─── Task Modal ─────────────────────────────────────────────────────────────────
const TaskModal = ({ task, onSave, onDelete, onClose }) => {
  const isEdit = !!task;
  const [form, setForm] = useState(task || {
    name: '', status: 'Not Started', priority: 'Medium', pie: 'Performance',
    quarter: 'Q1', description: '', objective: '', impact: '', evidence: '',
    feedback: '', skills: [], visibility: 'Manager Only', requestor: '', reviewPeriod: 'Mid-Year'
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleSkill = (skill) => {
    set('skills', form.skills?.includes(skill) ? form.skills.filter(s => s !== skill) : [...(form.skills || []), skill]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Basic Info */}
          <div>
            <div className="section-label">Task Name</div>
            <TextInput value={form.name} onChange={v => set('name', v)} placeholder="What did you accomplish?" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div className="section-label">Status</div>
              <select value={form.status} onChange={(e) => set('status', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <div className="section-label">Priority</div>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div className="section-label">PIE</div>
              <select value={form.pie} onChange={(e) => set('pie', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}>
                {PIE.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <div className="section-label">Quarter</div>
              <select value={form.quarter} onChange={(e) => set('quarter', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}>
                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="section-label">Description & Objective</div>
            <TextInput multiline value={form.description} onChange={v => set('description', v)} placeholder="What was the context? What did you set out to do?" rows={3} />
          </div>

          {/* Impact */}
          <div style={{ background: '#FFFBF2', borderRadius: 8, padding: '16px', marginBottom: 16, border: '2px solid #FFECC0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: '#B7770D', textTransform: 'uppercase' }}>⚡ Quantifiable Impact</div>
              <span style={{ fontSize: 10, background: '#FFF3DC', color: '#B7770D', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>MOST IMPORTANT</span>
            </div>
            <TextInput multiline value={form.impact} onChange={v => set('impact', v)} placeholder="Use REAL numbers. e.g. 'Reduced testing cycle from 3 weeks to 1 week, saving ~$8K in eng time.'" rows={3} />
          </div>

          {/* Evidence */}
          <div>
            <div className="section-label">Evidence / Link</div>
            <TextInput value={form.evidence} onChange={v => set('evidence', v)} placeholder="Confluence page, Jira ticket, doc link..." />
          </div>

          {/* Feedback */}
          <div>
            <div className="section-label">Feedback Received</div>
            <TextInput multiline value={form.feedback} onChange={v => set('feedback', v)} placeholder='"Great job on the sprint review." – Manager Name' rows={2} />
          </div>

          {/* Skills */}
          <div>
            <div className="section-label">Skills Demonstrated</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SKILLS_LIST.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 20,
                    border: form.skills?.includes(s) ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: form.skills?.includes(s) ? 'var(--primary)' : 'white',
                    color: form.skills?.includes(s) ? 'white' : 'var(--muted)',
                    fontSize: 12, fontWeight: 600, transition: 'all 0.15s'
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            {isEdit
              ? <button onClick={() => onDelete(task.id)} style={{ background: '#FFE0E0', color: '#C0392B', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 13 }}>
                  🗑 Delete Task
                </button>
              : <div />
            }
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ background: '#F0F0F0', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: 13, color: '#555', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { if (!form.name.trim()) return; onSave(form); }}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                {isEdit ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PerformanceTrackerApp({ tasks, onSaveTask, onDeleteTask, onLogout }) {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [modal, setModal] = useState(null);
  const TABS = ['Overview', 'All Tasks', 'By Quarter', 'Brag Doc'];

  const saveTask = async (taskData) => {
    await onSaveTask(taskData);
    setModal(null);
  };

  const deleteTask = async (id) => {
    if (confirm('Delete this task?')) {
      await onDeleteTask(id);
      setModal(null);
    }
  };

  const doneCount = tasks?.filter(t => t.status === 'Done').length || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Open Sans', sans-serif" }}>
      {/* Top Nav */}
      <div style={{ background: 'var(--primary)', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0' }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '18px' }}>📊</span>
          </div>
          <div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '0.3px' }}>Achievement Tracker</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{user?.name || 'Performance Review Dashboard'}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2 }}>
          {TABS.map((t, i) => (
            <button key={i} className="tab-btn"
              onClick={() => setTab(i)}
              style={{
                padding: '16px 18px', border: 'none', background: 'transparent',
                color: tab === i ? 'white' : 'rgba(255,255,255,0.5)',
                fontFamily: "Montserrat,sans-serif", fontWeight: tab === i ? 700 : 600, fontSize: 13,
                borderBottom: tab === i ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.18s'
              }}>
              {t}
              {i === 1 && <span style={{ marginLeft: 6, background: tab === 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{tasks?.length || 0}</span>}
              {i === 3 && doneCount > 0 && <span style={{ marginLeft: 6, background: 'var(--accent2)', color: '#5A3A00', borderRadius: 10, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{doneCount}</span>}
            </button>
          ))}
        </div>

        {/* Add button & Logout */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => setModal('add')}
            style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            + Add Task
          </button>
          <button onClick={onLogout}
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', borderRadius: 8, padding: '9px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 28px' }}>
        {tab === 0 && <OverviewTab tasks={tasks || []} onAdd={() => setModal('add')} />}
        {tab === 1 && <AllTasksTab tasks={tasks || []} onEdit={t => setModal(t)} onAdd={() => setModal('add')} />}
        {tab === 2 && <ByQuarterTab tasks={tasks || []} onEdit={t => setModal(t)} onAdd={() => setModal('add')} />}
        {tab === 3 && <BragDocTab tasks={tasks || []} />}
      </div>

      {/* Modal */}
      {modal && (
        <TaskModal
          task={modal === 'add' ? null : modal}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ─── Overview Tab ──────────────────────────────────────────────────────────────
const OverviewTab = ({ tasks, onAdd }) => {
  const done = tasks.filter(t => t.status === 'Done');
  const inProg = tasks.filter(t => t.status === 'In Progress');
  const blocked = tasks.filter(t => t.status === 'Blocked');
  const highDone = done.filter(t => t.priority === 'High');
  const withProof = done.filter(t => t.impact?.trim());
  const missingImpact = done.filter(t => !t.impact?.trim());

  const pieBreakdown = PIE.map(pie => ({
    key: pie,
    label: pie,
    color: pieColor[pie],
    count: tasks.filter(t => t.pie === pie).length,
    doneCount: done.filter(t => t.pie === pie).length,
  }));

  const qBreakdown = QUARTERS.map(q => ({
    q,
    total: tasks.filter(t => t.quarter === q).length,
    done: done.filter(t => t.quarter === q).length,
    inprog: inProg.filter(t => t.quarter === q).length,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {missingImpact.length > 0 && (
        <div style={{ background: '#FFF3DC', border: '2px solid #F5A623', borderRadius: 10, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }} className="fade-in">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: '#B7770D' }}>
              {missingImpact.length} completed task{missingImpact.length > 1 ? 's' : ''} missing an impact statement
            </div>
            <div style={{ fontSize: 12, color: '#8A5E00', marginTop: 2 }}>
              Add quantifiable impact to strengthen your review
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 12 }}>
        <StatCard label="Total Tasks" value={tasks.length} icon="📋" />
        <StatCard label="Completed" value={done.length} icon="✅" />
        <StatCard label="In Progress" value={inProg.length} icon="🔄" />
        <StatCard label="High Priority Done" value={highDone.length} accent icon="🎯" />
        <StatCard label="With Proof" value={withProof.length} sub={done.length > 0 ? `${Math.round((withProof.length / done.length) * 100)}% of completed` : '0% of completed'} icon="📊" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 15, color: 'var(--primary)', marginBottom: 4 }}>PIE Framework</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>Performance · Image · Exposure</div>
          {pieBreakdown.map(p => (
            <div key={p.key} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{p.doneCount}/{p.count} done</span>
              </div>
              <div className="progress-bar-bg" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${(p.count / Math.max(tasks.length, 1)) * 100}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 15, color: 'var(--primary)', marginBottom: 16 }}>Quarterly Progress</div>
          {qBreakdown.map(q => (
            <div key={q.q} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--primary)' }}>{q.q}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{q.total} tasks</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {q.done > 0 && <span className="pill" style={{ background: statusColor['Done'], color: statusText['Done'] }}>{q.done} done</span>}
                  {q.inprog > 0 && <span className="pill" style={{ background: statusColor['In Progress'], color: statusText['In Progress'] }}>{q.inprog} active</span>}
                </div>
              </div>
              <div className="progress-bar-bg" style={{ height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${(q.done / Math.max(q.total, 1)) * 100}%`, background: 'var(--done)' }} />
              </div>
            </div>
          ))}
          <button onClick={onAdd} style={{ width: '100%', marginTop: 8, background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            + Add Achievement
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Helper components ─────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent, sub }) => (
  <div className="card" style={{ padding: '20px', borderTop: accent ? '3px solid var(--accent)' : 'none', background: accent ? '#FFF5F5' : 'white' }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
  </div>
);

// ─── All Tasks Tab ────────────────────────────────────────────────────────────
const AllTasksTab = ({ tasks, onEdit, onAdd }) => {
  const [filters, setFilters] = useState({ status: 'All', search: '' });
  const filtered = useMemo(() => tasks.filter(t => {
    if (filters.status !== 'All' && t.status !== filters.status) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!t.name?.toLowerCase().includes(s) && !t.description?.toLowerCase().includes(s)) return false;
    }
    return true;
  }), [tasks, filters]);

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          style={{ flex: 1, padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
        />
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} style={{ padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}>
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={onAdd} style={{ background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
          + Add
        </button>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--primary)' }}>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Task</th>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Priority</th>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>PIE</th>
                <th style={{ padding: '11px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>Quarter</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5}><EmptyState /></td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="row-hover" onClick={() => onEdit(t)} style={{ cursor: 'pointer', borderBottom: '1px solid #F0F0EC' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, fontSize: 13, color: 'var(--text)', maxWidth: 280 }}>{t.name}</td>
                    <td style={{ padding: '11px 14px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '11px 14px' }}><PriorityBadge priority={t.priority} /></td>
                    <td style={{ padding: '11px 14px' }}><PieBadge pie={t.pie} /></td>
                    <td style={{ padding: '11px 14px' }}><QuarterBadge q={t.quarter} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── By Quarter Tab ────────────────────────────────────────────────────────────
const ByQuarterTab = ({ tasks, onEdit, onAdd }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {QUARTERS.map(q => {
      const qTasks = tasks.filter(t => t.quarter === q);
      const done = qTasks.filter(t => t.status === 'Done').length;
      return (
        <div key={q} className="card slide-in" style={{ overflow: 'hidden' }}>
          <div style={{ background: 'var(--primary)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 16, color: 'white' }}>{q}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{qTasks.length} tasks · {done} completed</span>
            </div>
          </div>
          {qTasks.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {qTasks.map((t) => (
                    <tr key={t.id} className="row-hover" onClick={() => onEdit(t)} style={{ cursor: 'pointer', borderBottom: '1px solid #F0F0EC' }}>
                      <td style={{ padding: '11px 14px', fontWeight: 600, fontSize: 13 }}>{t.name}</td>
                      <td style={{ padding: '11px 14px' }}><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No tasks in {q} yet</div>
          )}
        </div>
      );
    })}
  </div>
);

// ─── Brag Doc Tab ──────────────────────────────────────────────────────────────
const BragDocTab = ({ tasks }) => {
  const done = tasks.filter(t => t.status === 'Done');
  const missingImpact = done.filter(t => !t.impact?.trim());

  if (done.length === 0) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
      <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>Your brag doc is ready</div>
      <div style={{ color: 'var(--muted)', marginTop: 8 }}>Mark tasks as Done to build your performance review document.</div>
    </div>
  );

  return (
    <div>
      <div style={{ background: 'var(--primary)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 18, color: 'white' }}>Brag Doc — Performance Review Ready</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{done.length} completed · {done.filter(t => t.impact).length} with impact metrics</div>
        </div>
        <div style={{ fontSize: 32 }}>🏆</div>
      </div>

      {missingImpact.length > 0 && (
        <div style={{ background: '#FFF3DC', border: '2px solid #F5A623', borderRadius: 10, padding: '12px 18px', marginBottom: 20 }}>
          <strong>{missingImpact.length} task{missingImpact.length > 1 ? 's' : ''} missing impact statement</strong>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
        {done.map((t) => (
          <div key={t.id} className="brag-card fade-in">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 14, color: 'white', lineHeight: 1.3 }}>{t.name}</div>
                {t.description && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{t.description}</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                <PieBadge pie={t.pie} />
                <QuarterBadge q={t.quarter} />
              </div>
            </div>

            {t.impact ? (
              <div style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#F5A623', letterSpacing: '0.8px', marginBottom: 4 }}>⚡ IMPACT</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>{t.impact}</div>
              </div>
            ) : (
              <div style={{ background: 'rgba(232,76,76,0.1)', border: '1px dashed rgba(232,76,76,0.4)', borderRadius: 8, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <div style={{ fontSize: 11, color: 'rgba(232,76,76,0.8)' }}>Add impact statement</div>
              </div>
            )}

            {t.feedback && (
              <div style={{ background: 'rgba(43,125,212,0.1)', border: '1px solid rgba(43,125,212,0.3)', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#2B7DD4', letterSpacing: '0.8px', marginBottom: 4 }}>💬 FEEDBACK</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>{t.feedback}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
