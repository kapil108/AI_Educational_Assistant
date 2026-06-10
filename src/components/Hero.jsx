import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const CHIPS = ["Photosynthesis", "Newton's Laws of Motion", "DNA Replication", "Recursion in CS", "The Water Cycle", "Ohm's Law"];

export function Hero({ query, setQuery, onGenerate, loading }) {
  return (
    <div style={{ 
      textAlign: "center", padding: "4rem 1rem 3rem", 
      background: "radial-gradient(circle at top, var(--bg-hover) 0%, var(--bg-base) 100%)",
      borderBottom: "1px solid var(--border-light)"
    }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(99, 102, 241, 0.1)", borderRadius: 50, border: "1px solid rgba(99, 102, 241, 0.2)", marginBottom: 24, color: "var(--accent-primary)", fontSize: 13, fontWeight: 600 }}>
        <Sparkles size={14} /> AI Educator
      </div>
      
      <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
        Learn anything, <br/><em style={{ color: "var(--accent-primary)", fontStyle: "normal", textShadow: "var(--shadow-glow)" }}>simply.</em>
      </h1>
      
      <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: 600, margin: "0 auto 32px" }}>
        Ask a question, and get a complete, beautifully structured article with custom SVG diagrams and curated resources.
      </p>

      <div className="input-focus-ring glass" style={{ 
        display: "flex", gap: 8, maxWidth: 650, margin: "0 auto", 
        borderRadius: 50, padding: "6px 6px 6px 24px", alignItems: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !loading && onGenerate()}
          placeholder="What is photosynthesis?"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 16, color: "var(--text-main)", minWidth: 0 }}
        />
        <button onClick={onGenerate} disabled={loading || !query.trim()} style={{
          background: "linear-gradient(135deg, var(--accent-primary), var(--accent-primary-hover))",
          color: "#ffffff", border: "none", borderRadius: 50,
          padding: "12px 28px", fontSize: 15, fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading || !query.trim() ? 0.6 : 1,
          display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
          boxShadow: "var(--shadow-glow)", transition: "all 0.3s"
        }}>
          {loading ? <><Loader2 size={18} className="animate-spin" /> Generating</> : "Generate"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 24 }}>
        {CHIPS.map(c => (
          <button key={c} onClick={() => setQuery(c)} style={{
            background: "var(--bg-card)", border: "1px solid var(--border-light)",
            borderRadius: 50, padding: "8px 16px", fontSize: 13, color: "var(--text-muted)",
            cursor: "pointer", transition: "all .2s",
            ':hover': { background: "var(--bg-hover)", color: "var(--text-main)", borderColor: "var(--accent-primary)" }
          }}>
            {c}
          </button>
        ))}
      </div>
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
