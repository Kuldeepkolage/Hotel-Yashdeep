import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cmsService, DEFAULT_CMS_CONTENT } from '../services/cms.service.js';
import HeroEditor from '../components/cms/HeroEditor.jsx';
import AboutEditor from '../components/cms/AboutEditor.jsx';
import ContactEditor from '../components/cms/ContactEditor.jsx';
import OpeningHoursEditor from '../components/cms/OpeningHoursEditor.jsx';
import SocialLinksEditor from '../components/cms/SocialLinksEditor.jsx';
import SEOEditor from '../components/cms/SEOEditor.jsx';
import FooterEditor from '../components/cms/FooterEditor.jsx';
import SaveBar from '../components/cms/SaveBar.jsx';
import AdminPageHeader from '../components/common/AdminPageHeader.jsx';

// ─── Deep clone ──────────────────────────────────────────────────────────────
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// ─── Tab config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: 'hero',    label: 'Hero',          icon: '✦', description: 'Homepage banner content & calls to action' },
  { id: 'about',   label: 'About',         icon: '📖', description: 'Our heritage & restaurant story section' },
  { id: 'contact', label: 'Contact',       icon: '📞', description: 'Official phone, email & street address' },
  { id: 'hours',   label: 'Hours',         icon: '🕐', description: 'Weekly operational timings schedule' },
  { id: 'social',  label: 'Social',        icon: '🔗', description: 'Connected social media profile links' },
  { id: 'seo',     label: 'SEO',           icon: '🔍', description: 'Google search preview & meta tags' },
  { id: 'footer',  label: 'Footer',        icon: '☰',  description: 'Footer copyright & quick links' },
];

// ─── Toast component ─────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-start gap-3 rounded-xl border p-4 shadow-luxe bg-white w-[340px] max-w-[90vw]">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          type === "error" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
        }`}
      >
        {type === "error" ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
      </div>
      <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug text-dark">{message}</p>
      <button onClick={onClose} className="text-muted hover:text-dark text-sm">×</button>
    </div>
  );
};

// ─── Preview Panel ────────────────────────────────────────────────────────────
const PreviewPanel = ({ content }) => {
  const hero = content.hero || {};
  const contact = content.contact || {};
  const addr = contact.address || {};
  const social = content.socialLinks || {};
  const footer = content.footer || {};

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-4 text-xs sm:text-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Eye size={16} className="text-primary" />
        <span className="font-semibold text-dark text-sm">Live Preview Card</span>
      </div>

      {/* Hero preview */}
      <div
        className="relative overflow-hidden rounded-xl p-5 text-white"
        style={{
          backgroundColor: '#2c1a0e',
          backgroundImage: hero.backgroundImage
            ? `linear-gradient(rgba(0,0,0,${hero.overlayOpacity ?? 0.5}),rgba(0,0,0,${hero.overlayOpacity ?? 0.5})),url(${hero.backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <span className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Hero Preview</span>
        <h4 className="mt-2 font-display text-lg font-bold leading-tight">{hero.headline || '—'}</h4>
        <p className="mt-1 text-xs text-white/80 line-clamp-2">{hero.subheadline || ''}</p>
        {hero.ctaText && (
          <span className="mt-3 inline-block px-3 py-1 rounded bg-secondary text-dark text-xs font-semibold">
            {hero.ctaText}
          </span>
        )}
      </div>

      {/* Contact quick view */}
      <div className="rounded-xl bg-background p-3.5 border border-border space-y-1.5 text-xs text-dark/80">
        <p className="font-semibold text-[11px] uppercase tracking-wider text-muted">Contact Info</p>
        {contact.phone && <p>📞 {contact.phone}</p>}
        {contact.email && <p>✉ {contact.email}</p>}
        {addr.line1 && <p>📍 {[addr.line1, addr.city].filter(Boolean).join(', ')}</p>}
      </div>

      {/* Social links */}
      {Object.values(social).some(Boolean) && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {['instagram','facebook','twitter','youtube','whatsapp']
            .filter((k) => social[k])
            .map((k) => (
              <span key={k} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium capitalize">
                {k}
              </span>
            ))}
        </div>
      )}

      {/* Footer preview */}
      <div className="rounded-xl bg-dark p-3.5 text-background/80 text-xs">
        <p className="italic text-[11px] text-secondary">{footer.tagline || '—'}</p>
        <p className="mt-1 text-[10px] text-background/60">
          © {new Date().getFullYear()} {footer.copyrightName || 'Hotel Yashdeep'}
        </p>
      </div>
    </div>
  );
};

// ─── Main CMS Page ────────────────────────────────────────────────────────────
export default function CMS() {
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
        // Defaults fallback
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
      showToast('Changes saved and published live.');
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
      <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-border bg-white shadow-soft">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted font-medium">Loading website content…</p>
      </div>
    );
  }

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <div className="space-y-6 sm:space-y-8" data-testid="admin-cms">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Page Header */}
      <AdminPageHeader
        title="Website CMS"
        subtitle="Manage live landing page copy, storytelling, contact details, business hours, and SEO metadata."
        icon={FileText}
        badge={isDirty ? "Unsaved Changes" : "Published"}
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-medium transition-all ${
                showPreview
                  ? "bg-dark text-white border-dark"
                  : "border-border bg-white text-dark/70 hover:border-primary/50"
              }`}
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Save size={15} />
              {isSaving ? "Saving…" : "Save Live"}
            </button>
          </div>
        }
      />

      {/* Tabs navigation & Editor Layout */}
      <div className={`grid gap-6 items-start ${showPreview ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1"}`}>
        <div className={showPreview ? "lg:col-span-2 space-y-5" : "space-y-5"}>
          {/* Tab buttons */}
          <div className="rounded-2xl border border-border bg-white p-2 shadow-soft overflow-x-auto">
            <div className="flex gap-1.5 min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow-soft"
                      : "text-dark/70 hover:bg-black/5 hover:text-dark"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Description Banner */}
          {activeTabData && (
            <div className="rounded-xl border border-border bg-white px-4 py-2.5 text-xs text-muted font-medium flex items-center gap-2 shadow-2xs">
              <span className="text-primary font-bold">{activeTabData.icon}</span>
              <span>{activeTabData.description}</span>
            </div>
          )}

          {/* Active Tab Editor Form */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-7 shadow-soft">
            {renderEditor()}
          </div>
        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <PreviewPanel content={content} />
          </div>
        )}
      </div>

      {/* Save Bar */}
      <SaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onReset={handleReset}
        lastSaved={lastSaved}
      />
    </div>
  );
}