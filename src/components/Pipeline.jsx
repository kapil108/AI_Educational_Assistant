const PIPE = [
  { id: "api", label: "API Init" },
  { id: "gen", label: "Intelligence" },
  { id: "img", label: "Visualization" },
  { id: "res", label: "Curating" },
  { id: "fmt", label: "Formatting" },
];

export function Pipeline({ pipeState, loading, statusMsg }) {
  if (!loading && Object.keys(pipeState).length === 0) return null;

  const pCol = s => s === "active" ? "var(--accent-primary)" : s === "done" ? "var(--accent-success)" : s === "err" ? "var(--accent-danger)" : "var(--text-muted)";
  const pBrd = s => s === "active" ? "var(--accent-primary)" : s === "done" ? "var(--accent-success)" : s === "err" ? "var(--accent-danger)" : "var(--border-light)";
  const pBg = s => s === "active" ? "rgba(99, 102, 241, 0.1)" : s === "done" ? "rgba(16, 185, 129, 0.1)" : "var(--bg-card)";

  return (
    <div style={{ padding: "24px 16px", borderBottom: "1px solid var(--border-light)", background: "var(--bg-base)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, overflowX: "auto", maxWidth: 800, margin: "0 auto 16px" }}>
        {PIPE.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ 
              background: pBg(pipeState[s.id]), 
              border: `1px solid ${pBrd(pipeState[s.id])}`, 
              borderRadius: 50, padding: "6px 14px", fontSize: 12, 
              color: pCol(pipeState[s.id]), whiteSpace: "nowrap", 
              transition: "all .3s", fontWeight: 600,
              boxShadow: pipeState[s.id] === "active" ? "var(--shadow-glow)" : "none"
            }}>
              {s.label}
            </div>
            {i < PIPE.length - 1 && <span style={{ color: "var(--border-light)", fontSize: 14 }}>→</span>}
          </div>
        ))}
      </div>
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", fontSize: 14, color: "var(--accent-primary)", fontWeight: 500 }}>
          <span className="animate-pulse">●</span> {statusMsg}
        </div>
      )}
      <style>{`
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}</style>
    </div>
  );
}
