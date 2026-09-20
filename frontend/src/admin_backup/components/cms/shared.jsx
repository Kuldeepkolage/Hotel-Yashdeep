import React from 'react';

export const fieldStyles = {
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#8b7355',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 6,
    border: '1px solid #e2d8cc',
    background: '#fff',
    fontSize: 14,
    color: '#2c1a0e',
    outline: 'none',
    transition: 'border 0.15s',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 6,
    border: '1px solid #e2d8cc',
    background: '#fff',
    fontSize: 14,
    color: '#2c1a0e',
    outline: 'none',
    resize: 'vertical',
    minHeight: 90,
    lineHeight: 1.6,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  group: {
    marginBottom: 18,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  card: {
    background: '#fff',
    border: '1px solid #ede6da',
    borderRadius: 10,
    padding: '20px 22px',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#4a2e14',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottom: '1px solid #f0e8de',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  hint: {
    fontSize: 11,
    color: '#a89070',
    marginTop: 4,
  },
};

export const Field = ({ label, hint, children, style }) => (
  <div style={{ ...fieldStyles.group, ...style }}>
    {label && <label style={fieldStyles.label}>{label}</label>}
    {children}
    {hint && <p style={fieldStyles.hint}>{hint}</p>}
  </div>
);

export const Input = ({ value, onChange, placeholder, type = 'text', style }) => (
  <input
    type={type}
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    style={{ ...fieldStyles.input, ...style }}
    onFocus={(e) => (e.target.style.borderColor = '#8b5e3c')}
    onBlur={(e) => (e.target.style.borderColor = '#e2d8cc')}
  />
);

export const Textarea = ({ value, onChange, placeholder, rows = 4, style }) => (
  <textarea
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    style={{ ...fieldStyles.textarea, minHeight: rows * 22 + 18, ...style }}
    onFocus={(e) => (e.target.style.borderColor = '#8b5e3c')}
    onBlur={(e) => (e.target.style.borderColor = '#e2d8cc')}
  />
);

export const SectionCard = ({ title, icon, children }) => (
  <div style={fieldStyles.card}>
    {title && (
      <div style={fieldStyles.sectionTitle}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
    )}
    {children}
  </div>
);

export const Toggle = ({ label, checked, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
    <span style={{ fontSize: 14, color: '#3a2210' }}>{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: checked ? '#8b5e3c' : '#d4c8b8',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3,
        left: checked ? 20 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  </div>
);