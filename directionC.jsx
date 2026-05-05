/* directionC.jsx — Direction C: SPATIAL / DOC-FIRST
   The doc IS the canvas. Floating sticky-note "field cards" sit beside
   their regions, connected by sketchy dotted lines. Form is implicit.
   Bidirectional hover lifts both card + region together. */

function DirectionC() {
  return (
    <LinkProvider>
      <AppChrome title="Spatial · INV-PW-2026-04183" persona="Karim · AP">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>

          <div style={{flex:1, position:'relative', background:'var(--paper-warm)', overflow:'auto'}}>
            {/* Top context bar */}
            <div style={{display:'flex', gap:10, padding:10, borderBottom:'1.5px solid var(--ink)', background:'var(--paper)', alignItems:'center'}}>
              <span className="sk-h sk-h3">Pinewood Mfg. · $1,558.02</span>
              <span className="sk-pill warn">PO match — qty diff</span>
              <span className="sk-pill good">no dupe</span>
              <span className="sk-pill">cash ok · pay May 22</span>
              <div style={{flex:1}}/>
              <button className="sk-btn">Flag</button>
              <button className="sk-btn solid">Approve & post</button>
            </div>

            <div style={{position:'relative', padding:20, display:'flex', justifyContent:'center'}}>
              {/* Document centered */}
              <div style={{width: 480, aspectRatio:'8.5/11', position:'relative'}}>
                <InvoiceDoc narrow/>
              </div>

              {/* Floating sticky cards w/ connectors */}
              {/* connector SVG layer */}
              <svg style={{position:'absolute', inset:0, pointerEvents:'none'}} width="100%" height="100%">
                <defs>
                  <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
                    <circle cx="5" cy="5" r="3" fill="var(--accent)"/>
                  </marker>
                </defs>
                {[
                  ['M 200 95 Q 240 90 280 95', 'vendor'],
                  ['M 760 90 Q 720 80 680 95', 'invoice_no'],
                  ['M 760 220 Q 700 215 660 225', 'po_no'],
                  ['M 200 320 Q 250 320 290 320', 'bill_to'],
                  ['M 760 460 Q 700 460 660 470', 'total'],
                  ['M 760 555 Q 700 555 660 555', 'terms'],
                ].map(([d, id], i) => (
                  <path key={i} d={d} fill="none" stroke="var(--pencil)" strokeWidth="1.2" strokeDasharray="3 4" markerEnd="url(#dot)"/>
                ))}
              </svg>

              {/* Left side cards */}
              <FloatCard top={70} left={20} id="vendor" label="Vendor" value="Pinewood Mfg. Co." conf="good" extra="14 invoices YTD"/>
              <FloatCard top={290} left={20} id="bill_to" label="Bill-to" value="Acme Trading Co." conf="good"/>
              <FloatCard top={420} left={20} id="line_3" label="Line 3 — Threadlock" value="$184.80" conf="warn" extra="qty 48 vs PO 50"/>

              {/* Right side cards */}
              <FloatCard top={70} right={20} id="invoice_no" label="Invoice #" value="PW-2026-04183" conf="good"/>
              <FloatCard top={195} right={20} id="po_no" label="PO" value="PO-44217" conf="warn" extra="match found"/>
              <FloatCard top={310} right={20} id="due_date" label="Due" value="May 22, 2026" conf="warn" extra="terms NET 30"/>
              <FloatCard top={440} right={20} id="total" label="Total" value="$1,558.02" conf="good" extra="GL 5210"/>
              <FloatCard top={550} right={20} id="terms" label="Terms" value="NET 30" conf="good"/>
            </div>

            {/* sticky note explainer */}
            <div className="sk-note" style={{position:'absolute', bottom: 20, left: 24, maxWidth: 220}}>
              hover anywhere → both card<br/>and region light up together
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

function FloatCard({ top, left, right, id, label, value, conf, extra }) {
  const { isLinked, bind } = useLink(id);
  const colorBorder = conf === 'warn' ? 'var(--conf-warn)' : conf === 'bad' ? 'var(--conf-bad)' : 'var(--conf-good)';
  return (
    <div className={`sk-card link-target ${isLinked ? 'linked' : ''}`} style={{
      position:'absolute', top, left, right,
      width: 175, padding: '8px 10px',
      borderColor: isLinked ? 'var(--accent)' : colorBorder,
      borderWidth: '1.75px',
      transform: isLinked ? 'translateY(-2px) rotate(-0.4deg)' : 'rotate(-0.4deg)',
      zIndex: isLinked ? 10 : 1,
      cursor: 'pointer',
    }} {...bind}>
      <div className="sk-label" style={{margin:0}}>{label}</div>
      <div style={{fontFamily:'var(--font-hand)', fontSize: 14, fontWeight: 700}}>{value}</div>
      {extra && <div className="sk-small" style={{marginTop:2}}>{extra}</div>}
    </div>
  );
}

window.DirectionC = DirectionC;
