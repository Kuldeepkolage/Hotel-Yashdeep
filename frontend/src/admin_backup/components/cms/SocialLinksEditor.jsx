import React from 'react';
import { Field, Input, SectionCard } from './shared.jsx';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: '📸', placeholder: 'https://instagram.com/hotelyashdeep' },
  { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/hotelyashdeep' },
  { key: 'twitter', label: 'X / Twitter', icon: '🐦', placeholder: 'https://twitter.com/hotelyashdeep' },
  { key: 'youtube', label: 'YouTube', icon: '▶', placeholder: 'https://youtube.com/@hotelyashdeep' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', placeholder: 'https://wa.me/919876543210' },
];

const SocialLinksEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div>
      <SectionCard title="Social Media Links" icon="🔗">
        <p style={{ fontSize: 12, color: '#9a7d5a', marginBottom: 16 }}>
          Leave blank to hide a platform from the website footer and contact page.
        </p>
        {PLATFORMS.map(({ key, label, icon, placeholder }) => (
          <Field key={key} label={`${icon}  ${label}`}>
            <Input
              value={data[key]}
              onChange={(v) => update(key, v)}
              placeholder={placeholder}
              type="url"
            />
          </Field>
        ))}
      </SectionCard>

      <SectionCard title="Active Links Preview" icon="👁">
        {PLATFORMS.filter((p) => data[p.key]).length === 0 ? (
          <p style={{ fontSize: 13, color: '#b09070', fontStyle: 'italic' }}>
            No social links added yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PLATFORMS.filter((p) => data[p.key]).map(({ key, label, icon }) => (
              <a
                key={key}
                href={data[key]}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 20,
                  background: '#f4ede3', border: '1px solid #e0d0be',
                  color: '#5a3820', fontSize: 13, textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                <span>{icon}</span>{label}
              </a>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default SocialLinksEditor;