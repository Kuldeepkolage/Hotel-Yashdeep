import React from 'react';
import { Field, Input, Textarea, SectionCard, fieldStyles } from './shared.jsx';

const AboutEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });

  const updateHighlight = (index, val) => {
    const next = [...(data.highlights || [])];
    next[index] = val;
    update('highlights', next);
  };

  const addHighlight = () => {
    update('highlights', [...(data.highlights || []), '']);
  };

  const removeHighlight = (index) => {
    const next = (data.highlights || []).filter((_, i) => i !== index);
    update('highlights', next);
  };

  return (
    <div>
      <SectionCard title="About Content" icon="📖">
        <Field label="Section Title">
          <Input
            value={data.title}
            onChange={(v) => update('title', v)}
            placeholder="Our Story"
          />
        </Field>
        <Field label="Body Text" hint="2–4 sentences about the restaurant's history and character.">
          <Textarea
            value={data.body}
            onChange={(v) => update('body', v)}
            placeholder="Hotel Yashdeep has been a cornerstone…"
            rows={5}
          />
        </Field>
      </SectionCard>

      <SectionCard title="About Image" icon="🖼">
        <Field label="Image URL" hint="Square or portrait image works best (600×700px recommended).">
          <Input
            value={data.image}
            onChange={(v) => update('image', v)}
            placeholder="https://…/about.jpg"
          />
        </Field>
        {data.image && (
          <div style={{
            marginTop: 10, borderRadius: 8, overflow: 'hidden',
            height: 160, background: '#f0e8de',
            backgroundImage: `url(${data.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        )}
      </SectionCard>

      <SectionCard title="Highlight Badges" icon="✦">
        <p style={{ fontSize: 12, color: '#9a7d5a', marginBottom: 12 }}>
          Short facts displayed as badges (e.g. "Est. 2005", "Award-Winning").
        </p>
        {(data.highlights || []).map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              value={h}
              onChange={(e) => updateHighlight(i, e.target.value)}
              placeholder={`Highlight ${i + 1}`}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 6,
                border: '1px solid #e2d8cc', fontSize: 13, color: '#2c1a0e',
                background: '#fff', outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#8b5e3c')}
              onBlur={(e) => (e.target.style.borderColor = '#e2d8cc')}
            />
            <button
              onClick={() => removeHighlight(i)}
              style={{
                padding: '8px 12px', borderRadius: 6, border: '1px solid #e2d8cc',
                background: '#fff7f3', color: '#c0392b', fontSize: 14,
                cursor: 'pointer', flexShrink: 0,
              }}
            >×</button>
          </div>
        ))}
        <button
          onClick={addHighlight}
          style={{
            marginTop: 4, padding: '8px 16px', borderRadius: 6,
            border: '1px dashed #c4a882', background: '#faf7f3',
            color: '#7a5c38', fontSize: 13, cursor: 'pointer', fontWeight: 500,
          }}
        >
          + Add Highlight
        </button>
      </SectionCard>
    </div>
  );
};

export default AboutEditor;