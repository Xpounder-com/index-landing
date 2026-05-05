/* directionB.jsx — Direction B: STEPPED REVIEW
   Top progress stepper (Capture → Match → Code → Approve). Form is just
   the *current* step's fields — fewer at once, big and forgiving. Doc on
   right is annotated only for the current step. */

function DirectionB() {
  const [step, setStep] = React.useState(1);
  const steps = ['Capture', 'Match', 'Code', 'Approve'];
  return (
    <LinkProvider>
      <AppChrome title="Stepped review · INV-PW-2026-04183" persona="Karim · AP" status="step 2 of 4">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>
          <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {/* Stepper */}
            <div style={{padding: '14px 22px', borderBottom: '1.5px solid var(--ink)', background:'var(--paper-warm)'}}>
              <div className="sk-row" style={{gap: 10, alignItems:'center'}}>
                {steps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="sk-row" style={{gap:6, cursor:'pointer'}} onClick={()=>setStep(i)}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        border: '1.75px solid var(--ink)',
                        background: i <= step ? 'var(--ink)' : 'var(--paper)',
                        color: i <= step ? 'var(--paper)' : 'var(--ink)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'var(--font-hand-loose)', fontWeight:700, fontSize: 14,
                      }}>{i < step ? '✓' : i+1}</div>
                      <span style={{
                        fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700,
                        color: i === step ? 'var(--ink)' : 'var(--pencil)',
                      }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div style={{flex:1, height:0, borderTop:'2px dashed var(--pencil-light)'}}/>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div style={{flex: 1, display:'flex', overflow:'hidden'}}>
              {/* Step body */}
              <div style={{width: 420, padding: 22, overflow:'auto', borderRight: '1.5px solid var(--ink)'}}>
                <div className="sk-row" style={{gap: 6, marginBottom: 6}}>
                  <Squiggle width={70}/>
                </div>
                <div className="sk-h sk-h2" style={{marginBottom: 4}}>Match against PO & GR</div>
                <div className="sk-body" style={{marginBottom: 16}}>
                  3-way match: vendor invoice ↔ PO ↔ goods receipt.<br/>
                  Confirm or fix anything that doesn't line up.
                </div>

                <div className="sk-card" style={{padding: 14, marginBottom: 14}}>
                  <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700, marginBottom: 6}}>PO match</div>
                  <Field id="po_no" label="PO number on doc" value="PO-44217" conf="good"/>
                  <div className="sk-row" style={{gap:8}}>
                    <Arrow dir="bidir"/>
                    <span className="sk-body">matched <strong>PO-44217</strong> · Pinewood Mfg. · $1,512 expected</span>
                  </div>
                </div>

                <div className="sk-card" style={{padding: 14, marginBottom: 14}}>
                  <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700, marginBottom: 6}}>Goods receipt</div>
                  <div className="sk-body" style={{marginBottom: 6}}>GR-1198 · received Apr 19 · dock-3</div>
                  <table style={{width:'100%', fontSize:12, fontFamily:'var(--font-hand)'}}>
                    <thead><tr style={{textAlign:'left', color:'var(--pencil)'}}>
                      <th>Item</th><th>PO qty</th><th>Got</th><th>Inv qty</th>
                    </tr></thead>
                    <tbody>
                      <tr data-row><td>Bolt PWB-850</td><td>2400</td><td>2400</td><td className="link-target" data-link-row><span style={{color:'var(--conf-good)'}}>2400 ✓</span></td></tr>
                      <tr><td>Washer PWW-08G</td><td>2400</td><td>2400</td><td><span style={{color:'var(--conf-good)'}}>2400 ✓</span></td></tr>
                      <tr><td>Threadlock PWT-10</td><td>50</td><td>50</td><td><span style={{color:'var(--conf-bad)', fontWeight:700}}>48 ⚠</span></td></tr>
                    </tbody>
                  </table>
                  <div className="sk-note" style={{marginTop: 10, transform:'rotate(-0.8deg)'}}>
                    Short 2 tubes — accept partial?
                  </div>
                </div>

                <div className="sk-row" style={{gap: 8, marginTop: 8}}>
                  <button className="sk-btn ghost">← Back</button>
                  <button className="sk-btn">Flag & hold</button>
                  <button className="sk-btn solid" style={{marginLeft:'auto'}} onClick={()=>setStep(s=>Math.min(3,s+1))}>Continue → Code</button>
                </div>
              </div>

              {/* Doc */}
              <div style={{flex:1, padding: 18, background:'var(--paper-warm)', overflow:'auto'}}>
                <div className="sk-row" style={{gap: 8, marginBottom: 8}}>
                  <span className="sk-pill accent">showing: line items</span>
                  <span className="sk-small">other regions dimmed</span>
                </div>
                <div style={{aspectRatio:'8.5/11', maxHeight:'calc(100% - 30px)', position:'relative'}}>
                  <InvoiceDoc narrow/>
                  {/* dimming mask except for line items area */}
                  <div style={{position:'absolute', inset:0, background:'rgba(250,247,240,0.55)', pointerEvents:'none', clipPath:'polygon(0 0, 100% 0, 100% 36%, 0 36%, 0 76%, 100% 76%, 100% 100%, 0 100%)'}}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}
window.DirectionB = DirectionB;
