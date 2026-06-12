import { useState, useRef } from "react";
import { useEduAI } from "./hooks/useEduAI";
import { Settings } from "./components/Settings";
import { Hero } from "./components/Hero";
import { Pipeline } from "./components/Pipeline";
import { Results } from "./components/Results";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [query, setQuery] = useState("");
  
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  
  const currentRequestRef = useRef(0);

  const { runQuery, loading, error, statusMsg, pipeState } = useEduAI(apiKey);

  const handleGenerate = async () => {
    if (!query.trim()) return;
    setData(null);
    setImageUrl(null);
    
    const requestId = Date.now();
    currentRequestRef.current = requestId;
    
    const result = await runQuery(query);
    
    // Discard result if a newer request was made while this one was running
    if (currentRequestRef.current !== requestId) return;
    
    if (!result.error) {
      setData(result.eduData);
      setImageUrl(result.imageUrl);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Settings apiKey={apiKey} setApiKey={setApiKey} showKey={showKey} setShowKey={setShowKey} />
      
      {!data && !loading && (
        <Hero query={query} setQuery={setQuery} onGenerate={handleGenerate} loading={loading} />
      )}
      
      {(loading || data) && (
        <div style={{ 
          position: "sticky", top: 65, zIndex: 9, 
          background: "var(--bg-base)", borderBottom: "1px solid var(--border-light)",
          display: "flex", gap: 12, padding: "12px 24px", alignItems: "center"
        }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && handleGenerate()}
            placeholder="Search another topic..."
            style={{ 
              flex: 1, maxWidth: 400, background: "var(--bg-card)", border: "1px solid var(--border-light)", 
              borderRadius: 50, padding: "8px 16px", fontSize: 14, color: "var(--text-main)", outline: "none" 
            }}
          />
        </div>
      )}

      <Pipeline pipeState={pipeState} loading={loading} statusMsg={statusMsg} />

      {error && (
        <div style={{ maxWidth: 840, margin: "24px auto", padding: 16, borderRadius: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <Results data={data} imageUrl={imageUrl} loading={loading} />
    </div>
  );
}
