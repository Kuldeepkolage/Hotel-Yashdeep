// File: src/admin/components/Loader.jsx
export default function Loader({ fullScreen = false, label = "Loading..." }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        <span className="text-xs uppercase tracking-widest2 text-muted">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );
}