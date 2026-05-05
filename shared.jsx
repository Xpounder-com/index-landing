/* shared.jsx — common primitives & bidirectional hover system */

// Global "linked field id" — when set, every element with matching data-link
// attribute gets a `.linked` class. Used for bidirectional hover between
// extracted fields (left) and document regions (right).
const LinkCtx = React.createContext({ active: null, setActive: () => {} });

function LinkProvider({ children }) {
  const [active, setActive] = React.useState(null);
  return <LinkCtx.Provider value={{ active, setActive }}>{children}</LinkCtx.Provider>;
}

function useLink(id) {
  const { active, setActive } = React.useContext(LinkCtx);
  return {
    isLinked: active === id,
    bind: {
      onMouseEnter: () => setActive(id),
      onMouseLeave: () => setActive(null),
      'data-link': id,
    },
  };
}

// Simple sketchy frame — wraps a "screen" inside an artboard.
function Frame({ children, style }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'var(--paper)',
      fontFamily: 'var(--font-ui)', color: 'var(--ink)',
      overflow: 'hidden', position: 'relative', ...style,
    }}>{children}</div>
  );
}

// Hand-drawn squiggly underline as inline SVG
function Squiggle({ width = 80, color = 'var(--accent)' }) {
  return (
    <svg width={width} height="6" viewBox="0 0 80 6" style={{display:'block'}}>
      <path d="M2 4 Q 12 1 22 3 T 42 3 T 62 4 T 78 3" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

// Hand-drawn arrow
function Arrow({ dir = 'right', size = 18, color = 'var(--accent)' }) {
  const paths = {
    right: 'M2 9 Q 8 7 18 9 M 13 4 L 18 9 L 13 14',
    down:  'M9 2 Q 7 8 9 18 M 4 13 L 9 18 L 14 13',
    bidir: 'M2 9 L 18 9 M 5 5 L 2 9 L 5 13 M 15 5 L 18 9 L 15 13',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <path d={paths[dir]} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// A field-row in the left form panel, bidirectionally linked to a doc region
function Field({ id, label, value, conf = 'good', placeholder, suffix, locked }) {
  const { isLinked, bind } = useLink(id);
  const confClass = conf === 'good' ? 'good' : conf === 'warn' ? 'warn' : conf === 'bad' ? 'bad' : '';
  return (
    <div className="sk-col" style={{gap: 2, marginBottom: 10}}>
      <div className="sk-label">{label}</div>
      <div className={`sk-input ${confClass} link-target ${isLinked ? 'linked' : ''}`} {...bind}>
        <span style={{flex: 1, color: value ? 'var(--ink)' : 'var(--pencil-light)'}}>
          {value || placeholder || '—'}
        </span>
        {suffix}
        {locked && <span style={{fontSize:11, color:'var(--pencil)'}}>🔒</span>}
        {conf === 'warn' && <span title="Low confidence" style={{color:'var(--conf-warn)', fontSize:14}}>⚠</span>}
        {conf === 'bad' && <span title="Needs review" style={{color:'var(--conf-bad)', fontSize:14}}>!</span>}
      </div>
    </div>
  );
}

// A clickable doc region (the yellow highlight) bidirectionally linked
function DocMark({ id, top, left, width, height, conf }) {
  const { isLinked, bind } = useLink(id);
  const confColor = conf === 'bad' ? 'var(--conf-bad)' : conf === 'warn' ? 'var(--conf-warn)' : null;
  return (
    <div
      className={`doc-mark link-target ${isLinked ? 'linked' : ''}`}
      style={{
        top, left, width, height,
        borderLeft: confColor ? `2px solid ${confColor}` : 'none',
      }}
      {...bind}
    />
  );
}

// Doc text line cluster — placeholders that look like printed text
function DocLines({ lines = [], style }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap: 4, ...style}}>
      {lines.map((w, i) => (
        <div key={i} className={`doc-line ${w < 0.5 ? 'short' : ''} ${w < 0.3 ? 'faint' : ''}`}
          style={{width: `${Math.max(20, w * 100)}%`}}/>
      ))}
    </div>
  );
}

// Section header inside form panel
function FormSection({ title, count, children, sub }) {
  return (
    <div style={{marginBottom: 14}}>
      <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 4, alignItems:'baseline'}}>
        <div className="sk-row" style={{gap: 6}}>
          <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>{title}</span>
          {sub && <span className="sk-small">— {sub}</span>}
        </div>
        {count != null && <span className="sk-small">{count}</span>}
      </div>
      <div className="sk-divider" style={{height: 2, background: 'var(--ink)', clipPath: 'none', margin: '0 0 8px'}}/>
      {children}
    </div>
  );
}

// Confidence legend
function ConfLegend() {
  return (
    <div className="sk-row" style={{gap: 10, fontFamily:'var(--font-hand)', fontSize: 11}}>
      <span className="sk-row" style={{gap: 4}}>
        <span style={{width:10, height:10, background:'var(--conf-good)', borderRadius:2}}/> verified
      </span>
      <span className="sk-row" style={{gap: 4}}>
        <span style={{width:10, height:10, background:'var(--conf-warn)', borderRadius:2}}/> review
      </span>
      <span className="sk-row" style={{gap: 4}}>
        <span style={{width:10, height:10, background:'var(--conf-bad)', borderRadius:2}}/> needs fix
      </span>
    </div>
  );
}

// Window chrome for the screens
function AppChrome({ title, tabs, activeTab, persona, children, status }) {
  return (
    <Frame>
      {/* Top bar */}
      <div style={{
        display:'flex', alignItems:'center', gap: 10,
        padding: '7px 14px', borderBottom: '1.5px solid var(--ink)',
        background: 'var(--paper-warm)', height: 38, flexShrink: 0,
      }}>
        <div style={{
          width: 22, height: 22, border: '1.75px solid var(--ink)',
          borderRadius: '4px 6px 3px 5px', display:'flex',
          alignItems:'center', justifyContent:'center',
          fontFamily:'var(--font-hand-loose)', fontSize: 16, fontWeight: 700,
          background: 'var(--ink)', color: 'var(--paper)',
        }}>i</div>
        <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>IDX</div>
        <div className="sk-small" style={{marginLeft: 4}}>· {title}</div>
        <div style={{flex: 1}}/>
        {tabs && (
          <div style={{display:'flex', gap: 4}}>
            {tabs.map(t => (
              <span key={t} className={`sk-tab ${t === activeTab ? 'active' : ''}`}>{t}</span>
            ))}
          </div>
        )}
        {status && <span className="sk-small">{status}</span>}
        {persona && (
          <div style={{display:'flex', alignItems:'center', gap: 6, marginLeft: 6}}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: '1.5px solid var(--ink)', background: 'var(--paper)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-hand-loose)', fontSize: 13, fontWeight: 700,
            }}>{persona[0]}</div>
            <span className="sk-small">{persona}</span>
          </div>
        )}
      </div>
      {children}
    </Frame>
  );
}

// Sidebar (left rail) used by several screens
function Sidebar({ active = 'Inbox', extra }) {
  const items = [
    { name: 'Inbox', count: 12, icon: '⌧' },
    { name: 'Documents', count: 384, icon: '⊟' },
    { name: 'Dashboard', icon: '◫' },
    { name: 'Inventory', count: 7, icon: '▦' },
    { name: 'Customers', icon: '◐' },
    { name: 'Vendors', icon: '◑' },
    { name: 'Reports', icon: '⌗' },
    { name: 'Approvals', count: 4, icon: '⊜' },
  ];
  return (
    <div style={{
      width: 168, borderRight: '1.5px solid var(--ink)',
      background: 'var(--paper-warm)', padding: '10px 8px',
      display:'flex', flexDirection:'column', gap: 2, flexShrink: 0,
    }}>
      <div className="sk-small" style={{padding: '0 6px 6px', textTransform:'uppercase', letterSpacing: 1}}>WORK</div>
      {items.map(it => (
        <div key={it.name} className={`sk-nav ${active === it.name ? 'active' : ''}`}>
          <span style={{width: 14, fontFamily:'var(--font-mono)', fontSize: 13}}>{it.icon}</span>
          <span style={{flex: 1}}>{it.name}</span>
          {it.count != null && (
            <span className="sk-pill" style={{padding: '0 6px', fontSize: 10, background: active === it.name ? 'var(--paper)' : 'var(--paper)', color: 'var(--ink)'}}>{it.count}</span>
          )}
        </div>
      ))}
      <div style={{flex: 1}}/>
      {extra}
      <div className="sk-divider-soft"/>
      <div className="sk-row" style={{gap: 6, padding: '4px 6px'}}>
        <div style={{width: 22, height: 22, borderRadius:'50%', border:'1.5px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-hand-loose)', fontSize: 12, fontWeight: 700}}>K</div>
        <div className="sk-col" style={{lineHeight: 1.1}}>
          <span style={{fontFamily:'var(--font-hand)', fontSize: 12}}>Karim · AP</span>
          <span className="sk-small" style={{fontSize: 10}}>Acme Trading Co.</span>
        </div>
      </div>
    </div>
  );
}

// Status row pill
function StatusDot({ kind = 'good' }) {
  const c = kind === 'good' ? 'var(--conf-good)' : kind === 'warn' ? 'var(--conf-warn)' : kind === 'bad' ? 'var(--conf-bad)' : 'var(--pencil-light)';
  return <span style={{width: 7, height: 7, borderRadius:'50%', background: c, display:'inline-block'}}/>;
}

// Bar chart placeholder (sketch style)
function SketchBars({ data, color = 'var(--ink)', height = 60, width = 200 }) {
  const max = Math.max(...data);
  const bw = width / data.length - 2;
  return (
    <svg width={width} height={height} style={{display:'block'}}>
      {data.map((v, i) => {
        const h = (v / max) * (height - 6);
        return (
          <rect key={i} x={i*(bw+2)} y={height - h} width={bw} height={h}
            fill={color} rx="1" style={{filter: 'drop-shadow(0.5px 0.5px 0 rgba(0,0,0,0.15))'}}/>
        );
      })}
    </svg>
  );
}

// Sketchy line chart
function SketchLine({ data, color = 'var(--accent)', height = 60, width = 220, fill }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - 4) + 2;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return [x, y];
  });
  // Wobble each point slightly for sketchy feel
  const path = pts.map((p, i) => {
    const wob = (Math.sin(i * 1.7) * 0.8);
    return `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${(p[1] + wob).toFixed(1)}`;
  }).join(' ');
  const fillPath = `${path} L ${pts[pts.length-1][0]} ${height} L ${pts[0][0]} ${height} Z`;
  return (
    <svg width={width} height={height}>
      {fill && <path d={fillPath} fill={fill}/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Squiggly box (for placeholders / charts)
function SquiggleBox({ width = '100%', height = 80, label }) {
  return (
    <div className="sk-scribble" style={{
      width, height, display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--font-hand)', fontSize: 12, color:'var(--pencil)',
    }}>{label}</div>
  );
}

Object.assign(window, {
  LinkCtx, LinkProvider, useLink,
  Frame, Field, DocMark, DocLines, FormSection, ConfLegend,
  AppChrome, Sidebar, StatusDot, SketchBars, SketchLine, SquiggleBox,
  Squiggle, Arrow,
});
