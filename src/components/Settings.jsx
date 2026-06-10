import { Eye, EyeOff, Key } from "lucide-react";

export function Settings({ apiKey, setApiKey, showKey, setShowKey }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, 
      padding: "16px 24px", 
      borderBottom: "1px solid var(--border-light)",
      background: "var(--bg-card)",
      flexWrap: "wrap",
      position: "sticky", top: 0, zIndex: 10
    }}>
      <Key size={18} color="var(--text-muted)" />
      <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>API Configuration</span>
      
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: apiKey.length > 8 ? "var(--accent-success)" : "var(--accent-danger)",
        flexShrink: 0, transition: "background .3s",
        boxShadow: apiKey.length > 8 ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none"
      }}/>
      
      <div className="input-focus-ring" style={{
        position: "relative", flex: 1, minWidth: "250px", maxWidth: "400px",
        borderRadius: 50, border: "1px solid var(--border-light)",
        background: "var(--bg-base)", transition: "all 0.3s"
      }}>
        <input 
          type={showKey ? "text" : "password"} 
          value={apiKey} 
          onChange={e => setApiKey(e.target.value)} 
          placeholder="Enter OpenAI / GitHub PAT..." 
          autoComplete="off"
          style={{
            width: "100%", background: "transparent", border: "none",
            padding: "10px 44px 10px 20px", fontSize: 13,
            color: "var(--text-main)", outline: "none"
          }}
        />
        <button 
          onClick={() => setShowKey(!showKey)} 
          style={{
            position: "absolute", right: 12, top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", color: "var(--text-muted)",
            cursor: "pointer", display: "flex", alignItems: "center",
            padding: 4
          }}
        >
          {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
