import React from 'react';
import { SectionCard } from './shared.jsx';

const defaultRow = () => ({ day: '', lunch: '', dinner: '' });

const HoursRow = ({ row, index, onChange, onRemove }) => {
  const update = (key, val) => onChange(index, { ...row, [key]: val });
  const inp = {
    padding: '8px 10px', borderRadius: 6, border: '1px solid #e2d8cc',
    fontSize: 13, color: '#2c1a0e', background: '#fff', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  };
  const focus = (e) => (e.target.style.borderColor = '#8b5e3c');
  const blur = (e) => (e.target.style.borderColor = '#e2d8cc');

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto',
      gap: 8, marginBottom: 8, alignItems: 'center',
    }}>
      <input value={row.day} onChange={(e) => update('day', e.target.value)}
        placeholder="Monday – Friday" style={inp} onFocus={focus} onBlur={blur} />
      <input value={row.lunch} onChange={(e) => update('lunch', e.target.value)}
        placeholder="12:00 – 3:30 PM" style={inp} onFocus={focus} onBlur={blur} />
      <input value={row.dinner} onChange={(e) => update('dinner', e.target.value)}
        placeholder="7:00 – 11:00 PM" style={inp} onFocus={focus} onBlur={blur} />
      <button onClick={() => onRemove(index)} style={{
        padding: '8px 10px', borderRadius: 6, border: '1px solid #e2d8cc',
        background: '#fff7f3', color: '#c0392b', cursor: 'pointer', fontSize: 14,
      }}>×</button>
    </div>
  );
};

const OpeningHoursEditor = ({ data, onChange }) => {
  const hours = Array.isArray(data) ? data : [];

  const updateRow = (index, val) => {
    const next = [...hours];
    next[index] = val;
    onChange(next);
  };

  const removeRow = (index) => {
    onChange(hours.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...hours, defaultRow()]);
  };

  return (
    <div>
      <SectionCard title="Opening Hours" icon="🕐">
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr auto',
          gap: 8, marginBottom: 10,
        }}>
          {['Day / Period', 'Lunch Hours', 'Dinner Hours', ''].map((h, i) => (
            <div key={i} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#9a7d5a',
            }}>{h}</div>
          ))}
        </div>

        {hours.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '24px 0', color: '#b09070',
            fontSize: 13, fontStyle: 'italic',
          }}>
            No hours added yet. Add a row below.
          </div>
        )}

        {hours.map((row, i) => (
          <HoursRow key={i} row={row} index={i} onChange={updateRow} onRemove={removeRow} />
        ))}

        <button
          onClick={addRow}
          style={{
            marginTop: 8, padding: '8px 18px', borderRadius: 6,
            border: '1px dashed #c4a882', background: '#faf7f3',
            color: '#7a5c38', fontSize: 13, cursor: 'pointer', fontWeight: 500,
          }}
        >
          + Add Row
        </button>
      </SectionCard>

      {hours.length > 0 && (
        <SectionCard title="Preview" icon="👁">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ede6da' }}>
                {['Day', 'Lunch', 'Dinner'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '6px 10px 10px',
                    fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: '#9a7d5a', fontWeight: 700,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f3ece3' }}>
                  <td style={{ padding: '9px 10px', fontWeight: 600, color: '#2c1a0e' }}>{row.day || '—'}</td>
                  <td style={{ padding: '9px 10px', color: '#5a3d20' }}>{row.lunch || '—'}</td>
                  <td style={{ padding: '9px 10px', color: '#5a3d20' }}>{row.dinner || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  );
};

export default OpeningHoursEditor;