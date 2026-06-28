import React from 'react';
import { Field, Input, Textarea, SectionCard } from './shared.jsx';

const charCount = (str, max) => {
  const len = (str || '').length;
  const color = len > max ? '#e53e3e' : len > max * 0.85 ? '#d97706' : '#22c55e';
  return (
    <span style={{ fontSize: 11, color, fontWeight: 600 }}>
      {len}/{max}
    </span>
  );
};

const SEOEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div>
      <SectionCard title="Page Meta Tags" icon="🔍">
        <Field
          label={<span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SEO Title</span>{charCount(data.title, 60)}
          </span>}
          hint="Appears in the browser tab and Google results. Aim for 50–60 characters."
        >
          <Input
            value={data.title}
            onChange={(v) => update('title', v)}
            placeholder="Hotel Yashdeep – Fine Dining & Events"
          />
        </Field>

        <Field
          label={<span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Meta Description</span>{charCount(data.description, 160)}
          </span>}
          hint="A concise summary shown in search results. Keep it under 160 characters."
        >
          <Textarea
            value={data.description}
            onChange={(v) => update('description', v)}
            placeholder="Experience exquisite Indian cuisine and impeccable hospitality…"
            rows={3}
          />
        </Field>

        <Field label="Keywords" hint="Comma-separated. Used by some search engines.">
          <Input
            value={data.keywords}
            onChange={(v) => update('keywords', v)}
            placeholder="hotel yashdeep, fine dining virar, indian restaurant"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Open Graph (Social Sharing)" icon="📤">
        <Field label="OG Image URL" hint="Image shown when sharing the site on WhatsApp, Facebook, Twitter. 1200×630px recommended.">
          <Input
            value={data.ogImage}
            onChange={(v) => update('ogImage', v)}
            placeholder="https://…/og-image.jpg"
            type="url"
          />
        </Field>
        {data.ogImage && (
          <div style={{
            marginTop: 10, borderRadius: 8, overflow: 'hidden',
            border: '1px solid #e2d8cc',
          }}>
            <img
              src={data.ogImage}
              alt="OG preview"
              style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title="SERP Preview" icon="🖥">
        <div style={{
          background: '#f8f9fa', borderRadius: 8, padding: '16px 18px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ fontSize: 11, color: '#1a73e8', marginBottom: 2 }}>
            hotelyashdeep.com
          </div>
          <div style={{ fontSize: 18, color: '#1a0dab', fontWeight: 400, marginBottom: 4, lineHeight: 1.3 }}>
            {data.title || <span style={{ color: '#9aa0a6' }}>SEO title will appear here</span>}
          </div>
          <div style={{ fontSize: 13, color: '#4d5156', lineHeight: 1.5 }}>
            {data.description || <span style={{ color: '#9aa0a6' }}>Meta description will appear here…</span>}
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default SEOEditor;