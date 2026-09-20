import React, { useState, useEffect, useCallback } from 'react';
import { cmsService, DEFAULT_CMS_CONTENT } from '../services/cms.service.js';
import HeroEditor from '../components/cms/HeroEditor.jsx';
import AboutEditor from '../components/cms/AboutEditor.jsx';
import ContactEditor from '../components/cms/ContactEditor.jsx';
import OpeningHoursEditor from '../components/cms/OpeningHoursEditor.jsx';
import SocialLinksEditor from '../components/cms/SocialLinksEditor.jsx';
import SEOEditor from '../components/cms/SEOEditor.jsx';
import FooterEditor from '../components/cms/FooterEditor.jsx';
import SaveBar from '../components/cms/SaveBar.jsx';

// ─── Deep clone ──────────────────────────────────────────────────────────────
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ─── Tab config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',    label: 'Hero',          icon: '✦', description: 'Homepage banner content' },
  { id: 'about',   label: 'About',         icon: '📖', description: 'Our story section' },
  { id: 'contact', label: 'Contact',       icon: '📞', description: 'Phone, email & address' },
  { id: 'hours',   label: 'Hours',         icon: '🕐', description: 'Opening hours table' },
  { id: 'social',  label: 'Social',        icon: '🔗', description: 'Social media links' },
  { id: 'seo',     label: 'SEO',           icon: '🔍', description: 'Search engine metadata' },
  { id: 'footer',  label: 'Footer',        icon: '☰',  description: 'Footer content & links' },
];

// ─── Toast component ─────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#1e3a5f';

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 1000,
      background: bg, color: '#fff', padding: '12px 20px',
      borderRadius: 8, fontSize: 14, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideIn 0.2s ease',
      maxWidth: 360,
    }}>
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      {message}
      <button onClick={onClose} style={{
        marginLeft: 8, background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
      }}>×</button>
    </div>
  );
};

// ─── Preview Panel ────────────────────────────────────────────────────────────
const PreviewPanel = ({ content }) => {
  const hero = content.hero || {};
  const about = content.about || {};
  const contact = content.contact || {};
  const addr = contact.address || {};
  const social = content.socialLinks || {};
  const footer = content.footer || {};

  return (
    <div style={{ fontSize: 13, lineHeight: 1.6, color: '#2c1a0e' }}>
      {/* Hero preview */}
      <div style={{
        background: '#2c1a0e',
        backgroundImage: hero.backgroundImage ? `linear-gradient(rgba(0,0,0,${hero.overlayOpacity ?? 0.5}),rgba(0,0,0,${hero.overlayOpacity ?? 0.5})),url(${hero.backgroundImage})` : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center',
        borderRadius: 10, padding: '28px 22px', marginBottom: 12, color: '#fff',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', color: '#d4a96a', marginBottom: 6 }}>HERO SECTION</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{hero.headline || '—'}</div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>{hero.subheadline || ''}</div>
        {hero.ctaText && (
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: 4,
            background: '#8b5e3c', color: '#fff', fontSize: 12, fontWeight: 600,
          }}>{hero.ctaText}</span>
        )}
      </div>

      {/* Contact quick view */}
      <div style={{
        background: '#f8f4ef', borderRadius: 8, padding: '14px 16px', marginBottom: 12,
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#9a7d5a', fontWeight: 700, marginBottom: 8 }}>CONTACT</div>
        {contact.phone && <div>📞 {contact.phone}</div>}
        {contact.email && <div>✉ {contact.email}</div>}
        {addr.line1 && <div>📍 {[addr.line1, addr.city].filter(Boolean).join(', ')}</div>}
      </div>

      {/* Social links */}
      {Object.values(social).some(Boolean) && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {['instagram','facebook','twitter','youtube','whatsapp']
            .filter((k) => social[k])
            .map((k) => (
              <span key={k} style={{
                padding: '4px 10px', borderRadius: 12, background: '#f4ede3',
                border: '1px solid #e0d0be', fontSize: 11, color: '#5a3820',
              }}>{k}</span>
            ))}
        </div>
      )}

      {/* Footer preview */}
      <div style={{
        background: '#1c1108', borderRadius: 8, padding: '14px 16px', color: '#c9b99a',
      }}>
        <div style={{ fontSize: 11, fontStyle: 'italic', color: '#8a6d4a', marginBottom: 6 }}>
          {footer.tagline || '—'}
        </div>
        <div style={{ fontSize: 10, color: '#5a4028' }}>
          © {new Date().getFullYear()} {footer.copyrightName || 'Hotel Yashdeep'}
        </div>
      </div>
    </div>
  );
};

// ─── Main CMS Page ────────────────────────────────────────────────────────────
const CMS = () => {
  const [content, setContent] = useState(clone(DEFAULT_CMS_CONTENT));
  const [savedContent, setSavedContent] = useState(clone(DEFAULT_CMS_CONTENT));
  const [activeTab, setActiveTab] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const isDirty = JSON.stringify(content) !== JSON.stringify(savedContent);

  // Load CMS content
  useEffect(() => {
    const load = async () => {
      try {
        const data = await cmsService.getContent();
        const merged = { ...DEFAULT_CMS_CONTENT, ...data };
        setContent(clone(merged));
        setSavedContent(clone(merged));
      } catch {
        // Use defaults silently — API may not be connected yet
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await cmsService.saveContent(content);
      setSavedContent(clone(content));
      const now = new Date();
      setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`);
      showToast('Changes saved successfully');
    } catch (err) {
      showToast(err.message || 'Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Discard all unsaved changes?')) {
      setContent(clone(savedContent));
      showToast('Changes discarded', 'info');
    }
  };

  const updateSection = useCallback((section, val) => {
    setContent((prev) => ({ ...prev, [section]: val }));
  }, []);

  const renderEditor = () => {
    switch (activeTab) {
      case 'hero':    return <HeroEditor data={content.hero} onChange={(v) => updateSection('hero', v)} />;
      case 'about':   return <AboutEditor data={content.about} onChange={(v) => updateSection('about', v)} />;
      case 'contact': return <ContactEditor data={content.contact} onChange={(v) => updateSection('contact', v)} />;
      case 'hours':   return <OpeningHoursEditor data={content.openingHours} onChange={(v) => updateSection('openingHours', v)} />;
      case 'social':  return <SocialLinksEditor data={content.socialLinks} onChange={(v) => updateSection('socialLinks', v)} />;
      case 'seo':     return <SEOEditor data={content.seo} onChange={(v) => updateSection('seo', v)} />;
      case 'footer':  return <FooterEditor data={content.footer} onChange={(v) => updateSection('footer', v)} />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#8b7355' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: '3px solid #e2d8cc',
            borderTopColor: '#8b5e3c', borderRadius: '50%',
            animation: 'spin 0.7s linear infinite', margin: '0 auto 12px',
          }} />
          <div style={{ fontSize: 14 }}>Loading website content…</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0ea', paddingBottom: 80 }}>
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Page Header */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #ede6da',
        padding: '20px 28px', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2c1a0e' }}>
            Website CMS
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8b7355' }}>
            Edit your public website content — changes go live when you save.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isDirty && (
            <span style={{
              fontSize: 12, color: '#d97706', background: '#fffbeb',
              border: '1px solid #fde68a', borderRadius: 20, padding: '4px 12px',
              fontWeight: 600,
            }}>
              Unsaved changes
            </span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            style={{
              padding: '8px 16px', borderRadius: 6, border: '1px solid #d4c0a8',
              background: showPreview ? '#4a2e14' : '#fff', color: showPreview ? '#fff' : '#5a3820',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{showPreview ? '✕' : '👁'}</span>
            {showPreview ? 'Close Preview' : 'Preview'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: showPreview ? '1fr 320px' : '1fr',
        gap: 0,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 24px 0',
        alignItems: 'start',
      }}>
        {/* Main editor area */}
        <div>
          {/* Tab navigation */}
          <div style={{
            background: '#fff', borderRadius: 10, border: '1px solid #ede6da',
            marginBottom: 20, overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', overflowX: 'auto', borderBottom: '1px solid #ede6da',
              scrollbarWidth: 'none',
            }}>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 18px', border: 'none', background: 'none',
                    cursor: 'pointer', fontSize: 13, fontWeight: 600,
                    color: activeTab === tab.id ? '#8b5e3c' : '#7a6555',
                    borderBottom: activeTab === tab.id ? '2px solid #8b5e3c' : '2px solid transparent',
                    whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'color 0.15s',
                    flexShrink: 0,
                  }}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            {/* Section description */}
            {activeTabData && (
              <div style={{
                padding: '10px 18px', background: '#faf7f3',
                borderBottom: '1px solid #ede6da',
                fontSize: 12, color: '#9a7d5a',
              }}>
                {activeTabData.icon} {activeTabData.description}
              </div>
            )}
          </div>

          {/* Editor content */}
          <div style={{ paddingBottom: 8 }}>
            {renderEditor()}
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div style={{
            background: '#fff', border: '1px solid #ede6da', borderRadius: 10,
            padding: '20px', position: 'sticky', top: 24, marginLeft: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#9a7d5a', marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>👁</span> Live Preview
            </div>
            <PreviewPanel content={content} />
          </div>
        )}
      </div>

      {/* Save bar */}
      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
        lastSaved={lastSaved}
      />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { height: 4px; width: 4px; }
        ::-webkit-scrollbar-track { background: #f0e8de; }
        ::-webkit-scrollbar-thumb { background: #c4a882; border-radius: 4px; }
        @media (max-width: 640px) {
          .cms-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default CMS;