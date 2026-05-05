/* directionD.jsx — Direction D: COMMAND-PALETTE / KEYBOARD-FIRST
   Power-user view. Left = densely packed table of every extracted field
   in one scrollable list (J/K to navigate). Center = the doc, focused
   region auto-scrolls into view. Right = AI suggestions / quick actions.
   Bottom = command bar. */

function DirectionD() {
  return (
    <LinkProvider>
      <AppChrome title="Power-review · INV-PW-2026-04183" persona="Lana · Controller" status="kbd: J/K · ⏎ approve · / search">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>

          {/* Field table */}
          <div style={{width: 320, borderRight: '1.5px solid var(--ink)', display:'flex', flexDirection:'column'}}>
            <div style={{padding: 10, borderBottom:'1.5px solid var(--ink)', background:'var(--paper-warm)'}}>
              <div className="sk-row" style={{justifyContent:'space-between'}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Fields (24)</span>
                <span className="sk-pill warn">3 to review</span>
              </div>
              <div className="sk-input" style={{marginTop: 6, fontSize: 12}}>
                <span style={{color:'var(--pencil)'}}>⌕</span>
                <span>filter fields…</span>
                <span className="sk-pill" style={{marginLeft:'auto', fontSize: 10, padding:'0 5px'}}>/</span>
              </div>
            </div>
            <div style={{flex: 1, overflow:'auto', padding: 6}}>
              {[
                {id:'vendor', g:'Header', k:'vendor', v:'Pinewood Mfg. Co.', c:'good'},
                {id:'invoice_no', g:'Header', k:'invoice #', v:'PW-2026-04183', c:'good'},
                {id:'invoice_date', g:'Header', k:'issued', v:'2026-04-22', c:'good'},
                {id:'due_date', g:'Header', k:'due', v:'2026-05-22', c:'warn', focus:true},
                {id:'po_no', g:'Header', k:'po ref', v:'PO-44217', c:'warn'},
                {id:'bill_to', g:'Header', k:'bill-to', v:'Acme Trading Co.', c:'good'},
                {id:'line_1', g:'Lines', k:'L1 hex bolt', v:'2400 × $0.42 = $1,008', c:'good'},
                {id:'line_2', g:'Lines', k:'L2 washer', v:'2400 × $0.08 = $192', c:'good'},
                {id:'line_3', g:'Lines', k:'L3 threadlock', v:'48 × $3.85 = $184.80', c:'warn'},
                {id:'line_4', g:'Lines', k:'L4 freight', v:'$92.00', c:'good'},
                {id:'tax', g:'Totals', k:'tax (5.5%)', v:'$81.22', c:'good'},
                {id:'total', g:'Totals', k:'total', v:'$1,558.02', c:'good'},
                {id:'terms', g:'Totals', k:'terms', v:'NET 30', c:'good'},
              ].map((f, i, arr) => {
                const showGroup = i === 0 || arr[i-1].g !== f.g;
                return (
                  <React.Fragment key={f.id}>
                    {showGroup && <div className="sk-small" style={{padding: '6px 6px 2px', textTransform:'uppercase', letterSpacing:1}}>{f.g}</div>}
                    <FieldRow {...f}/>
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{padding: 8, borderTop:'1.5px solid var(--ink)', background:'var(--paper-warm)', display:'flex', gap: 6, fontFamily:'var(--font-hand)', fontSize:11}}>
              <span className="sk-pill" style={{padding:'0 5px'}}>J</span>
              <span className="sk-pill" style={{padding:'0 5px'}}>K</span>
              <span>navigate</span>
              <span style={{flex:1}}/>
              <span className="sk-pill" style={{padding:'0 5px'}}>⏎</span>
              <span>approve</span>
            </div>
          </div>

          {/* Doc */}
          <div style={{flex: 1, padding: 14, background:'var(--paper-warm)', overflow:'auto'}}>
            <div style={{aspectRatio:'8.5/11', maxHeight:'100%'}}>
              <InvoiceDoc narrow/>
            </div>
          </div>

          {/* AI / suggestions */}
          <div style={{width: 240, borderLeft:'1.5px solid var(--ink)', padding: 12, overflow:'auto'}}>
            <div className="sk-h sk-h3" style={{marginBottom: 6}}>Co-pilot</div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10, borderColor:'var(--accent)', borderWidth: 1.75}}>
              <div className="sk-row" style={{gap:5, marginBottom: 4}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Suggested fix</span>
                <span className="sk-pill accent" style={{fontSize:10}}>⏎</span>
              </div>
              <div className="sk-body">
                Line 3 qty (48) is 2 short of PO. Pinewood usually invoices delivered qty.
              </div>
              <div className="sk-row" style={{gap: 5, marginTop: 6}}>
                <button className="sk-btn sm">Accept short</button>
                <button className="sk-btn sm ghost">Hold</button>
              </div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>GL coding</div>
              <div className="sk-body">5210 · Raw Materials</div>
              <div className="sk-small">based on 11 prior Pinewood invoices</div>
              <div className="sk-row" style={{gap:5, marginTop: 4}}>
                <button className="sk-btn sm">Apply</button>
                <span className="sk-pill" style={{fontSize:10}}>96%</span>
              </div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>3-way match</div>
              <div className="sk-row" style={{gap:4}}><StatusDot kind="good"/><span className="sk-small">PO-44217</span></div>
              <div className="sk-row" style={{gap:4}}><StatusDot kind="good"/><span className="sk-small">GR-1198</span></div>
              <div className="sk-row" style={{gap:4}}><StatusDot kind="warn"/><span className="sk-small">qty Δ on L3</span></div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Cash impact</div>
              <SketchLine data={[40,38,36,33,30,28,26,24]} fill="var(--accent-soft)" width={210} height={40}/>
              <div className="sk-small">Pay May 22 → $24.1k cash</div>
            </div>

            <div className="sk-card" style={{padding: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Approval</div>
              <div className="sk-small">→ L. Owens (you) · approves</div>
            </div>
          </div>
        </div>

        {/* Bottom command bar */}
        <div style={{
          position:'absolute', bottom: 14, left: '50%', transform:'translateX(-50%)',
          width: 460, background:'var(--ink)', color:'var(--paper)', borderRadius: 6,
          padding: '8px 14px', display:'flex', gap: 8, alignItems:'center',
          boxShadow: '4px 5px 0 rgba(0,0,0,0.25)',
          fontFamily:'var(--font-hand)', fontSize: 13,
        }}>
          <span style={{opacity: 0.6}}>⌘K</span>
          <span style={{flex:1, opacity:0.85}}>approve, recode, send to L. Owens, post to GL…</span>
          <span className="sk-pill" style={{borderColor:'var(--paper)', color:'var(--paper)', fontSize:10}}>⏎</span>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

function FieldRow({ id, k, v, c, focus }) {
  const { isLinked, bind } = useLink(id);
  const dot = c === 'good' ? 'var(--conf-good)' : c === 'warn' ? 'var(--conf-warn)' : 'var(--conf-bad)';
  return (
    <div className={`link-target ${isLinked || focus ? 'linked' : ''}`} {...bind} style={{
      display:'flex', gap: 6, padding: '4px 6px', borderRadius: 4,
      cursor:'pointer', fontFamily:'var(--font-hand)', fontSize: 12,
      background: (isLinked || focus) ? 'var(--accent-soft)' : 'transparent',
      borderLeft: focus ? '2px solid var(--accent)' : '2px solid transparent',
      alignItems:'baseline',
    }}>
      <span style={{width:6, height:6, borderRadius:'50%', background: dot, flexShrink:0, marginTop: 4}}/>
      <span style={{width: 90, color:'var(--pencil)'}}>{k}</span>
      <span style={{flex:1, color:'var(--ink)', fontWeight: focus ? 700 : 400}}>{v}</span>
    </div>
  );
}

window.DirectionD = DirectionD;
