import { Play, ExternalLink, Link as LinkIcon, BookOpen, Brain, Lightbulb, Target } from "lucide-react";

export function Results({ data, imageUrl, loading }) {
  if (!data && !loading) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 1rem", color: "var(--text-muted)" }}>
        <BookOpen size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
        <p style={{ fontSize: 16 }}>Start your learning journey by entering a topic above.</p>
      </div>
    );
  }

  if (!data) return null;

  const ytUrl = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const khanUrl = q => `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(q)}`;
  const britUrl = q => `https://www.britannica.com/search?query=${encodeURIComponent(q)}`;
  const wikiUrl = q => `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(q)}`;

  function mdHtml(md) {
    if (!md) return "";
    // First: normalize — force newlines before ### markers so they become real headings
    let text = md
      .replace(/\.(?=###)/g, ".\n")      // Insert newline before ### if preceded by sentence end
      .replace(/([^.\n])(?=###)/g, "$1\n") // Insert newline before ### if no period/newline before it
      .replace(/###\s*/g, "\n### ")       // Normalize all ### to have newline before and space after
      .trim();
    
    // HTML-escape
    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Parse headings
    text = text.replace(/### (.+)/g, '<h3 style="color:var(--text-main); font-weight:600; margin-top:32px; margin-bottom:14px; font-size:1.35rem; font-family:Outfit,sans-serif; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:10px">$1</h3>');
    text = text.replace(/## (.+)/g, '<h2 style="color:var(--text-main); font-weight:700; margin-top:36px; margin-bottom:16px; font-size:1.6rem; font-family:Outfit,sans-serif">$1</h2>');
    
    // Parse bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#F8FAFC; font-weight:600">$1</strong>');
    
    // Parse bullet lists
    text = text.replace(/\n- (.+)/g, '\n<li style="margin-bottom:8px">$1</li>');
    text = text.replace(/(<li[^>]*>[\s\S]*?<\/li>)+/g, m => `<ul style="padding-left:24px; margin-bottom:16px">${m}</ul>`);
    
    // Parse numbered lists (1. 2. 3.)
    text = text.replace(/\n\d+\.\s+(.+)/g, '\n<li style="margin-bottom:8px">$1</li>');
    
    // Wrap loose text in paragraphs
    text = text.replace(/\n\n/g, '</p><p style="margin-bottom:16px; line-height:1.8">');
    text = text.replace(/\n/g, '<br/>');
    
    // Wrap the entire content
    text = `<div style="line-height:1.8">${text}</div>`;
    
    return text;
  }

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", padding: "40px 20px 100px" }}>
      <article>
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            <span style={{ borderRadius: 50, padding: "4px 14px", fontSize: 12, fontWeight: 600, background: "rgba(99, 102, 241, 0.15)", color: "var(--accent-primary)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
              {data?.context?.subject || data.subject}
            </span>
            <span style={{ borderRadius: 50, padding: "4px 14px", fontSize: 12, fontWeight: 600, background: "rgba(16, 185, 129, 0.15)", color: "var(--accent-success)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              {data?.context?.class || data.education_level}
            </span>
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: "0 0 16px 0", color: "#F8FAFC", lineHeight: 1.1 }}>{data?.title || data?.context?.topic || data.topic}</h1>
          {data.revision_summary && (
            <p style={{ fontSize: "1.2rem", color: "var(--text-muted)", margin: 0, fontStyle: "italic", borderLeft: "4px solid var(--accent-primary)", paddingLeft: 20, background: "linear-gradient(90deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)", padding: "16px 20px", borderRadius: "0 8px 8px 0" }}>
              {data.revision_summary}
            </p>
          )}
        </header>

        {/* Real Educational Image */}
        {imageUrl && (
          <section style={{ marginBottom: 48 }}>
            <div className="glass" style={{ borderRadius: 16, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-card)" }}>
              <img 
                src={imageUrl} 
                alt={data?.context?.topic || data.topic} 
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain", background: "#ffffff" }} 
              />
            </div>
          </section>
        )}

        {/* Explanation / Content */}
        <section style={{ marginBottom: 48, fontSize: "1.1rem", color: "var(--text-main)", lineHeight: "1.8" }}>
          {data.content ? (
            <div dangerouslySetInnerHTML={{ __html: mdHtml(data.content) }} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: mdHtml(data.explanation || "") }} />
          )}
        </section>

        {/* Fascinating Facts */}
        {data.important_facts?.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div className="glass" style={{ padding: 24, background: "rgba(245, 158, 11, 0.05)", borderColor: "rgba(245, 158, 11, 0.2)" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent-warning)", marginBottom: 16, marginTop: 0 }}>Fascinating Facts</h3>
              <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-main)", listStyleType: "circle" }}>
                {data.important_facts.map((f,i) => <li key={i} style={{ marginBottom: 12 }}>{f}</li>)}
              </ul>
            </div>
          </section>
        )}

        {/* Real World Applications */}
        {data.real_world_applications?.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}><Target color="var(--accent-success)" /> Real-World Impact</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              {data.real_world_applications.map((a,i) => (
                <div key={i} className="glass" style={{ padding: 20, transition: "transform 0.2s", cursor: "default", ':hover': { transform: "translateY(-2px)" }}}>
                  <div style={{ fontSize: 12, color: "var(--accent-primary)", textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700, marginBottom: 12 }}>{a.category}</div>
                  <div style={{ fontSize: 14, color: "var(--text-main)", lineHeight: 1.6 }}>{a.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Revision & Practice */}
        <section style={{ marginBottom: 48 }}>
           <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}><Lightbulb color="var(--accent-warning)" /> Practice & Review</h2>
           
           {data.revision_notes?.length > 0 && (
             <div className="glass" style={{ marginBottom: 32, background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)", borderColor: "rgba(245, 158, 11, 0.2)", padding: 24 }}>
               <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--accent-warning)", marginTop: 0, marginBottom: 16 }}>Quick Review Notes</h3>
               <ul style={{ margin: 0, paddingLeft: 24, color: "var(--text-main)" }}>
                 {data.revision_notes.map((n,i) => <li key={i} style={{ marginBottom: 8 }}>{n}</li>)}
               </ul>
             </div>
           )}

           <div>
             {[{k:"easy",l:"Warm-up",c:"var(--accent-success)", bg:"rgba(16, 185, 129, 0.05)"},{k:"medium",l:"Challenge",c:"var(--accent-warning)", bg:"rgba(245, 158, 11, 0.05)"},{k:"advanced",l:"Expert",c:"var(--accent-danger)", bg:"rgba(239, 68, 68, 0.05)"}].map(({k,l,c,bg}) => {
              const qs = data.practice_questions?.[k]||[];
              if(!qs.length) return null;
              return <div key={k} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 700, margin: "0 0 12px", color: c }}>{l}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {qs.map((q,i) => <div key={i} className="glass" style={{ background: bg, borderColor: `${c}33`, color: "var(--text-main)", padding: "16px 20px", fontSize: 15 }}>{q}</div>)}
                </div>
              </div>;
            })}
           </div>
        </section>

        {/* Resources & Links */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}><LinkIcon color="var(--text-muted)" /> Explore Further</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", marginBottom: 16, marginTop: 0 }}>Web Resources</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { n: "Curriculum Notes", c: "var(--accent-primary)", u: data?.refs?.url || `https://www.google.com/search?q=${encodeURIComponent(data?.context?.topic || data.topic)}+ncert+vedantu` },
                  { n: "Khan Academy", c: "var(--accent-success)", u: khanUrl(data?.context?.topic || data.topic) },
                  { n: "Wikipedia", c: "var(--text-main)", u: wikiUrl(data?.context?.topic || data.topic) }
                ].map((r,i) => (
                  <a key={i} href={r.u} target="_blank" rel="noreferrer" className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, textDecoration: "none", transition: "all 0.2s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,255,255,0.05)`, color: r.c, display: "flex", alignItems: "center", justifyContent: "center" }}><ExternalLink size={18} /></div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#F8FAFC", marginBottom: 2 }}>{r.n}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.u}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", marginBottom: 16, marginTop: 0 }}>Video Lectures</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(data.youtube_queries||[]).map((q,i) => (
                  <a key={i} href={ytUrl(q)} target="_blank" rel="noreferrer" className="glass" style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, textDecoration: "none", transition: "all 0.2s" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239, 68, 68, 0.1)", color: "var(--accent-danger)", display: "flex", alignItems: "center", justifyContent: "center" }}><Play size={18} /></div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#F8FAFC", marginBottom: 2 }}>Search: {q}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>YouTube</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
