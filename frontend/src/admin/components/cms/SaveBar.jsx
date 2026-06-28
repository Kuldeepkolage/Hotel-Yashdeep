import React from 'react';

const SaveBar = ({ isDirty, isSaving, onSave, onReset, lastSaved }) => {
  if (!isDirty && !lastSaved) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#1c1108',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isDirty ? (
          <>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#f59e0b', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ color: '#e5d6c0', fontSize: 14 }}>
              You have unsaved changes
            </span>
          </>
        ) : lastSaved ? (
          <>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#22c55e', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{ color: '#a8997d', fontSize: 14 }}>
              Saved {lastSaved}
            </span>
          </>
        ) : null}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onReset}
          disabled={isSaving || !isDirty}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: '#c9b99a',
            fontSize: 13,
            fontWeight: 500,
            cursor: isDirty ? 'pointer' : 'not-allowed',
            opacity: isDirty ? 1 : 0.4,
            transition: 'all 0.15s',
          }}
        >
          Reset
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          style={{
            padding: '8px 22px',
            borderRadius: 6,
            border: 'none',
            background: isDirty ? '#8b5e3c' : '#5a3d28',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: isDirty ? 'pointer' : 'not-allowed',
            opacity: isDirty ? 1 : 0.5,
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {isSaving ? (
            <>
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                display: 'inline-block', animation: 'spin 0.7s linear infinite',
              }} />
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default SaveBar;