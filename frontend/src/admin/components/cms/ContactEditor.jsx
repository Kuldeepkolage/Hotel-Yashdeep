import React from 'react';
import { Field, Input, SectionCard, fieldStyles } from './shared.jsx';

const ContactEditor = ({ data, onChange }) => {
  const update = (key, val) => onChange({ ...data, [key]: val });
  const updateAddress = (key, val) =>
    onChange({ ...data, address: { ...(data.address || {}), [key]: val } });

  const addr = data.address || {};

  return (
    <div>
      <SectionCard title="Phone & Email" icon="📞">
        <Field label="Primary Phone Number" hint="Include country code, e.g. +91 98765 43210">
          <Input
            value={data.phone}
            onChange={(v) => update('phone', v)}
            placeholder="+91 98765 43210"
            type="tel"
          />
        </Field>
        <Field label="Reservations Email">
          <Input
            value={data.email}
            onChange={(v) => update('email', v)}
            placeholder="reservations@hotelyashdeep.com"
            type="email"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Address" icon="📍">
        <Field label="Address Line 1">
          <Input
            value={addr.line1}
            onChange={(v) => updateAddress('line1', v)}
            placeholder="12, Heritage Road"
          />
        </Field>
        <Field label="Address Line 2 (optional)">
          <Input
            value={addr.line2}
            onChange={(v) => updateAddress('line2', v)}
            placeholder="Virar West"
          />
        </Field>
        <div style={fieldStyles.row}>
          <Field label="City">
            <Input
              value={addr.city}
              onChange={(v) => updateAddress('city', v)}
              placeholder="Virar"
            />
          </Field>
          <Field label="State">
            <Input
              value={addr.state}
              onChange={(v) => updateAddress('state', v)}
              placeholder="Maharashtra"
            />
          </Field>
        </div>
        <Field label="PIN Code">
          <Input
            value={addr.pincode}
            onChange={(v) => updateAddress('pincode', v)}
            placeholder="401303"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Address Preview" icon="🗺">
        <div style={{
          background: '#f8f4ef', borderRadius: 8, padding: '14px 16px',
          fontSize: 14, color: '#3a2210', lineHeight: 1.8,
        }}>
          {[addr.line1, addr.line2, [addr.city, addr.state].filter(Boolean).join(', '), addr.pincode]
            .filter(Boolean)
            .map((line, i) => <div key={i}>{line}</div>)}
          {!addr.line1 && <span style={{ color: '#b09070', fontStyle: 'italic' }}>No address entered yet</span>}
        </div>
      </SectionCard>
    </div>
  );
};

export default ContactEditor;