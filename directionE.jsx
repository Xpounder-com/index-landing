/* directionE.jsx — Direction E: ERP-FIRST / NARRATIVE
   Frames the doc as just one input to a bigger story: what's about to
   happen to the business when this gets posted. Form is collapsed into
   a sidebar; main canvas is a "what posts when I approve" preview. */

function DirectionE() {
  return (
    <LinkProvider>
      <AppChrome title="Posting preview · INV-PW-2026-04183" persona="Sara · Operations Owner">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>

          {/* Compact field column */}
          <div style={{width: 240, borderRight:'1.5px solid var(--ink)', padding: 10, overflow:'auto', background:'var(--paper)'}}>
            <div className="sk-h sk-h3" style={{marginBottom: 4}}>Extracted</div>
            <div className="sk-small" style={{marginBottom: 8}}>hover → see on doc</div>
            <Field id="vendor" label="Vendor" value="Pinewood Mfg." conf="good"/>
            <Field id="invoice_no" label="Inv #" value="PW-04183" conf="good"/>
            <Field id="po_no" label="PO" value="PO-44217" conf="warn"/>
            <Field id="due_date" label="Due" value="May 22" conf="warn"/>
            <Field id="total" label="Total" value="$1,558.02" conf="good"/>
            <Field id="terms" label="Terms" value="NET 30" conf="good"/>

            <div style={{marginTop: 8}} className="sk-card-tight" >
              <div style={{padding: 8}}>
                <div className="sk-small" style={{textTransform:'uppercase', letterSpacing:1}}>Lines</div>
                <Field id="line_1" label="L1 bolt" value="$1,008" conf="good"/>
                <Field id="line_2" label="L2 washer" value="$192" conf="good"/>
                <Field id="line_3" label="L3 threadlock" value="$184.80" conf="warn"/>
                <Field id="line_4" label="L4 freight" value="$92" conf="good"/>
              </div>
            </div>

            <button className="sk-btn solid" style={{width:'100%', marginTop: 10}}>Approve & post</button>
          </div>

          {/* Main canvas — narrative impact preview */}
          <div style={{flex: 1, padding: 18, overflow:'auto', background:'var(--paper-warm)'}}>
            <div className="sk-h sk-h2">If you approve this invoice…</div>
            <div className="sk-body" style={{marginBottom: 14}}>4 things change in your books. Each card links to the line on the doc.</div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14, marginBottom: 14}}>
              {/* Cash card */}
              <div className="sk-card" style={{padding: 14}}>
                <div className="sk-row" style={{justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>💵 Cash</span>
                  <span className="sk-pill good">safe</span>
                </div>
                <div className="sk-body" style={{marginTop:4}}>Pay May 22 → cash <strong>$24.1k</strong> (above $20k floor)</div>
                <SketchLine data={[40,38,36,33,30,28,26,24,23,24]} fill="var(--accent-soft)" width={300} height={62}/>
                <div className="sk-small">2 other invoices due same week ($3,840)</div>
              </div>

              {/* Inventory card */}
              <div className="sk-card" style={{padding: 14}}>
                <div className="sk-row" style={{justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>📦 Inventory</span>
                  <span className="sk-pill">3 SKUs</span>
                </div>
                <div className="sk-body" style={{marginTop: 4, lineHeight: 1.7}}>
                  <span className="link-target" data-link="line_1">+2,400 PWB-850</span> → 4,820 on hand<br/>
                  <span className="link-target" data-link="line_2">+2,400 PWW-08G</span> → 6,100 on hand<br/>
                  <span className="link-target" data-link="line_3" style={{color:'var(--conf-warn)'}}>+48 PWT-10 (2 short)</span> → 96 on hand
                </div>
                <div className="sk-small">Valuation +$1,384 FIFO</div>
              </div>

              {/* GL card */}
              <div className="sk-card" style={{padding: 14}}>
                <div className="sk-row" style={{justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>📒 GL entry</span>
                  <span className="sk-pill warn">96% conf</span>
                </div>
                <table style={{width:'100%', fontFamily:'var(--font-mono)', fontSize: 12, marginTop: 6}}>
                  <tbody>
                    <tr><td>5210 Raw Materials</td><td style={{textAlign:'right'}}>$1,476.80 Dr</td></tr>
                    <tr><td>1450 Sales Tax Recv</td><td style={{textAlign:'right'}}>$81.22 Dr</td></tr>
                    <tr><td>2010 AP — Pinewood</td><td style={{textAlign:'right'}}>$1,558.02 Cr</td></tr>
                  </tbody>
                </table>
                <div className="sk-small" style={{marginTop:6}}>Cost center OPS-Cleveland</div>
              </div>

              {/* Approval / risk */}
              <div className="sk-card" style={{padding: 14}}>
                <div className="sk-row" style={{justifyContent:'space-between'}}>
                  <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>⚑ Risks & approvals</span>
                  <span className="sk-pill warn">1 issue</span>
                </div>
                <div className="sk-body" style={{lineHeight: 1.7}}>
                  <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/> Line 3 qty short by 2 vs PO</div>
                  <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/> No duplicate invoice</div>
                  <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/> Vendor master matches</div>
                </div>
                <div className="sk-small" style={{marginTop:6}}>Routes to <strong>L. Owens</strong> (Controller, > $1k)</div>
              </div>
            </div>

            {/* Doc strip — collapsed */}
            <div className="sk-row" style={{gap: 8, marginBottom: 6, alignItems:'baseline'}}>
              <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Source document</span>
              <span className="sk-small">— hover any field above to highlight on the page</span>
            </div>
            <div style={{display:'flex', gap:14}}>
              <div style={{width: 380, aspectRatio:'8.5/11'}}>
                <InvoiceDoc narrow scale={0.85}/>
              </div>
              <div className="sk-card" style={{flex:1, padding: 12}}>
                <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 16, fontWeight: 700, marginBottom: 4}}>Audit trail</div>
                <ul style={{fontFamily:'var(--font-hand)', fontSize: 12, paddingLeft: 16, lineHeight: 1.7}}>
                  <li>Apr 22 · received via vendor portal</li>
                  <li>Apr 22 · OCR + extract (Doc AI v2)</li>
                  <li>Apr 22 · matched PO-44217 (Pinewood)</li>
                  <li>Apr 22 · matched GR-1198 (qty Δ flagged)</li>
                  <li>Apr 22 · 14 prior invoices learned coding</li>
                  <li>now · awaiting your approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}
window.DirectionE = DirectionE;
