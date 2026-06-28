import React from 'react';
import { Field, Input, SectionCard, Toggle, fieldStyles } from './shared.jsx';

const FooterEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });

  const updateLink = (index, key, val) => {
    const links = [...(data.quickLinks || [])];
    links[index] = { ...links[index], [key]: val };
    update('quickLinks', links);
  };

  const addLink = () => {
    update('quickLinks', [...(data.quickLinks || []), { label: '', href: '' }]);
  };

  const removeLink = (index) => {
    update('quickLinks', (data.quickLinks || []).filter((_, i) => i !== index));
  };

  return (
    <div>
      <SectionCard title="Footer Branding" icon="🏷">
        <Field label="Tagline" hint="A short brand line displayed in the footer.">
          <Input
            value={data.tagline}
            onChange={(v) => update('tagline', v)}
            placeholder="Crafted with love, served with pride."
          />
        </Field>
        <Field label="Copyright Name" hint="Appears in '© 2025 [Name]'">
          <Input
            value={data.copyrightName}
            onChange={(v) => update('copyrightName', v)}
            placeholder="Hotel Yashdeep"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Footer Sections" icon="☰">
        <Toggle
          label="Show Social Links in Footer"
          checked={!!data.showSocialLinks}
          onChange={(v) => update('showSocialLinks', v)}
        />
        <Toggle
          label="Show Opening Hours in Footer"
          checked={!!data.showOpeningHours}
          onChange={(v) => update('showOpeningHours', v)}
        />
      </SectionCard>

      <SectionCard title="Quick Links" icon="🔗">
        <p style={{ fontSize: 12, color: '#9a7d5a', marginBottom: 12 }}>
          Navigation links shown in the footer.
        </p>
        {(data.quickLinks || []).length === 0 && (
          <p style={{ fontSize: 13, color: '#b09070', fontStyle: 'italic', marginBottom: 12 }}>
            No quick links added.
          </p>
        )}
        {(data.quickLinks || []).map((link, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
            <input
              value={link.label}
              onChange={(e) => updateLink(i, 'label', e.target.value)}
              placeholder="Label (e.g. Menu)"
              style={{
                padding: '8px 10px', borderRadius: 6, border: '1px solid #e2d8cc',
                fontSize: 13, color: '#2c1a0e', background: '#fff', outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8b5e3c')}
              onBlur={(e) => (e.target.style.borderColor = '#e2d8cc')}
            />
            <input
              value={link.href}
              onChange={(e) => updateLink(i, 'href', e.target.value)}
              placeholder="/menu"
              style={{
                padding: '8px 10px', borderRadius: 6, border: '1px solid #e2d8cc',
                fontSize: 13, color: '#2c1a0e', background: '#fff', outline: 'none',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8b5e3c')}
              onBlur={(e) => (e.target.style.borderColor = '#e2d8cc')}
            />
            <button onClick={() => removeLink(i)} style={{
              padding: '8px 10px', borderRadius: 6, border: '1px solid #e2d8cc',
              background: '#fff7f3', color: '#c0392b', cursor: 'pointer', fontSize: 14,
            }}>×</button>
          </div>
        ))}
        <button onClick={addLink} style={{
          marginTop: 4, padding: '8px 16px', borderRadius: 6,
          border: '1px dashed #c4a882', background: '#faf7f3',
          color: '#7a5c38', fontSize: 13, cursor: 'pointer', fontWeight: 500,
        }}>
          + Add Link
        </button>
      </SectionCard>

      <SectionCard title="Footer Preview" icon="👁">
        <div style={{
          background: '#1c1108', borderRadius: 8, padding: '20px 22px',
          color: '#c9b99a',
        }}>
          <div style={{ fontSize: 14, marginBottom: 6, fontStyle: 'italic', color: '#a0876a' }}>
            {data.tagline || 'Tagline here'}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
            {(data.quickLinks || []).map((l, i) => (
              <span key={i} style={{ fontSize: 12, color: '#e8d5b7', textDecoration: 'underline', cursor: 'pointer' }}>
                {l.label || '—'}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: '#6b5038', borderTop: '1px solid #2e1e0e', paddingTop: 10, marginTop: 4 }}>
            © {new Date().getFullYear()} {data.copyrightName || 'Hotel Yashdeep'} · All rights reserved
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default FooterEditor;