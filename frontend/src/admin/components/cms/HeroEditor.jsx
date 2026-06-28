import React from 'react';
import { Field, Input, Textarea, SectionCard, Toggle, fieldStyles } from './shared.jsx';

const HeroEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div>
      <SectionCard title="Headline & Copy" icon="✦">
        <Field label="Main Headline" hint="The first line visitors see — keep it under 60 characters.">
          <Input
            value={data.headline}
            onChange={(v) => update('headline', v)}
            placeholder="Fine Dining, Timeless Moments"
          />
        </Field>
        <Field label="Sub-headline" hint="A short supporting line below the headline.">
          <Textarea
            value={data.subheadline}
            onChange={(v) => update('subheadline', v)}
            placeholder="Experience the art of Indian cuisine…"
            rows={3}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Call to Action" icon="→">
        <div style={fieldStyles.row}>
          <Field label="Button Text">
            <Input
              value={data.ctaText}
              onChange={(v) => update('ctaText', v)}
              placeholder="Reserve a Table"
            />
          </Field>
          <Field label="Button Link">
            <Input
              value={data.ctaLink}
              onChange={(v) => update('ctaLink', v)}
              placeholder="/reservations"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Background" icon="🖼">
        <Field label="Background Image URL" hint="Use a high-resolution image (1920×1080 recommended).">
          <Input
            value={data.backgroundImage}
            onChange={(v) => update('backgroundImage', v)}
            placeholder="https://…/hero.jpg"
          />
        </Field>
        {data.backgroundImage && (
          <div style={{
            marginTop: 10, borderRadius: 8, overflow: 'hidden',
            height: 140, background: '#f0e8de',
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        )}
        <Field label={`Overlay Opacity: ${Math.round((data.overlayOpacity || 0.5) * 100)}%`} style={{ marginTop: 14 }}
          hint="Controls the dark overlay over the background image.">
          <input
            type="range" min={0} max={1} step={0.05}
            value={data.overlayOpacity ?? 0.5}
            onChange={(e) => update('overlayOpacity', parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#8b5e3c' }}
          />
        </Field>
      </SectionCard>
    </div>
  );
};

export default HeroEditor;