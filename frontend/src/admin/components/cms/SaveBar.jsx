import React from 'react';

const SaveBar = ({ isDirty, isSaving, onSave, onReset, lastSaved }) => {
  if (!isDirty && !lastSaved) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1108] border-t border-white/10 px-4 sm:px-8 py-3 sm:py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-2xl">
      <div className="flex items-center gap-2.5 justify-center sm:justify-start">
        {isDirty ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shrink-0 animate-pulse" />
            <span className="text-[#e5d6c0] text-xs sm:text-sm font-medium">
              You have unsaved changes
            </span>
          </>
        ) : lastSaved ? (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span className="text-[#a8997d] text-xs sm:text-sm">
              Saved {lastSaved}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5 justify-end">
        <button
          onClick={onReset}
          disabled={isSaving || !isDirty}
          className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-white/15 bg-transparent text-[#c9b99a] text-xs sm:text-sm font-medium hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
        >
          Reset
        </button>
        <button
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-soft disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              Saving…
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default SaveBar;