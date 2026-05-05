/* fullscreens.jsx — Customer PO→SO conversion screen + Inventory count variance screen */

function CustPOConversionScreen() {
  const [allocStrategy, setAllocStrategy] = React.useState('balanced');
  return (
    <LinkProvider>
      <AppChrome title="Customer PO → Sales Order · RB-9981" persona="Karim · AP / Ops">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>

          {/* LEFT: extracted PO fields + allocation builder */}
          <div style={{width: 380, borderRight:'1.5px solid var(--ink)', padding:14, overflow:'auto', background:'var(--paper)'}}>
            <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 6}}>
              <div className="sk-col">
                <span className="sk-h sk-h3">Customer PO</span>
                <span className="sk-small">extracted from RB-9981.pdf</span>
              </div>
              <ConfLegend/>
            </div>

            <FormSection title="Header">
              <Field id="cust" label="Customer" value="Riverbend Co." conf="good" suffix={<span className="sk-pill" style={{fontSize:10}}>active MSA</span>}/>
              <Field id="cust_po" label="Customer PO #" value="RB-9981" conf="good"/>
              <Field id="contact" label="Buyer" value="Joan Tyler" conf="good"/>
              <div className="sk-row" style={{gap:8}}>
                <div style={{flex:1}}><Field id="po_date" label="PO date" value="Apr 22" conf="good"/></div>
                <div style={{flex:1}}><Field id="need_by" label="Need by" value="May 6" conf="warn"/></div>
              </div>
              <Field id="ship_to" label="Ship to" value="Riverbend dock-2" conf="good"/>
            </FormSection>

            <FormSection title="Lines & allocation" sub="4 items · $8,418">
              {[
                {id:'so_l1', d:'PWB-850 Bolt × 1,200', alloc:'Cleveland WH', tone:'good', amt:'$1,020'},
                {id:'so_l2', d:'PWW-08G Washer × 1,200', alloc:'Cleveland WH', tone:'good', amt:'$216'},
                {id:'so_l3', d:'CBL-100 Cable × 24', alloc:'14 OH + 10 backorder', tone:'warn', amt:'$6,840'},
                {id:'so_l4', d:'NWS-2X4 Beam × 12', alloc:'Cleveland WH', tone:'good', amt:'$342'},
              ].map(l => (
                <div key={l.id} className={`sk-card-tight link-target`} data-link={l.id} style={{padding:8, marginBottom:6}}>
                  <div className="sk-row" style={{justifyContent:'space-between'}}>
                    <span style={{fontFamily:'var(--font-hand)', fontSize:13, fontWeight:700}}>{l.d}</span>
                    <span className="sk-mono">{l.amt}</span>
                  </div>
                  <div className="sk-row" style={{gap:5, marginTop: 2}}>
                    <StatusDot kind={l.tone}/>
                    <span className="sk-small">{l.alloc}</span>
                  </div>
                </div>
              ))}
            </FormSection>

            <FormSection title="Pricing & terms">
              <Field id="so_total" label="Order total" value="$8,418.00" conf="good"/>
              <Field id="so_terms" label="Terms (PO)" value="NET 60" conf="warn" suffix={<span className="sk-small" style={{color:'var(--conf-warn)'}}>contract: 45</span>}/>
            </FormSection>

            <div className="sk-row" style={{gap:8, marginTop: 14}}>
              <button className="sk-btn ghost">Reject PO</button>
              <button className="sk-btn">Save draft</button>
              <button className="sk-btn solid" style={{marginLeft:'auto'}}>Create SO →</button>
            </div>
          </div>

          {/* CENTER: PO doc */}
          <div style={{flex: 1, padding: 14, background:'var(--paper-warm)', overflow:'auto'}}>
            <div className="sk-row" style={{gap:8, marginBottom:8}}>
              <span className="sk-pill">customer PO · 1pg</span>
              <span className="sk-pill good">vendor master ✓</span>
              <span className="sk-pill warn">credit: NET 60 vs 45</span>
              <div style={{flex:1}}/>
              <span className="sk-small">↳ hover any field</span>
            </div>
            <div style={{aspectRatio:'8.5/11', maxHeight:'calc(100% - 36px)'}}>
              <CustomerPODoc/>
            </div>
          </div>

          {/* RIGHT: SO preview + ops impact */}
          <div style={{width: 280, borderLeft:'1.5px solid var(--ink)', padding:12, overflow:'auto'}}>
            <div className="sk-h sk-h3" style={{marginBottom:6}}>What we'll create</div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10, borderColor:'var(--accent)', borderWidth: 1.75}}>
              <div className="sk-row" style={{justifyContent:'space-between'}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>SO-2247</span>
                <span className="sk-pill accent">draft</span>
              </div>
              <div className="sk-body" style={{lineHeight: 1.6}}>
                Riverbend Co. · 4 lines<br/>
                Total <strong>$8,418.00</strong><br/>
                Ship by <strong>May 4</strong> (2d buffer)
              </div>
            </div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Backorder PO</div>
              <div className="sk-body">PO-44222 → Pinewood<br/>10 × CBL-100 · lead 4d</div>
              <div className="sk-row" style={{gap:5, marginTop: 4}}>
                <button className="sk-btn sm">Send to Pinewood</button>
              </div>
            </div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Stock impact</div>
              <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.7}}>
                <li>PWB-850 → 3,620 OH</li>
                <li>PWW-08G → 4,900 OH</li>
                <li className="link-target" data-link="so_l3" style={{color:'var(--conf-warn)'}}>CBL-100 → 0 OH (10 in)</li>
                <li>NWS-2X4 → 30 OH</li>
              </ul>
            </div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Cash forecast</div>
              <SketchLine data={[24,23,22,22,21,22,24,28,32]} fill="var(--accent-soft)" width={240} height={48}/>
              <div className="sk-small">+$8,418 expected ~Jul 6 (NET 45)</div>
            </div>

            <div className="sk-card" style={{padding: 12}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Approval</div>
              <div className="sk-small">→ S. Park (Ops Mgr) · backorder needs sign-off</div>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

function CountVarianceScreen() {
  return (
    <LinkProvider>
      <AppChrome title="Cycle Count · Q2 sheet 3 · variance review" persona="Marco · WH">
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inventory"/>

          {/* LEFT: variance summary + line items */}
          <div style={{width: 380, borderRight:'1.5px solid var(--ink)', padding:14, overflow:'auto', background:'var(--paper)'}}>
            <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 8}}>
              <div className="sk-col">
                <span className="sk-h sk-h3">Count variances</span>
                <span className="sk-small">extracted from cycle-count sheet 3</span>
              </div>
              <ConfLegend/>
            </div>

            {/* Summary card */}
            <div className="sk-card" style={{padding: 12, marginBottom: 14}}>
              <div className="sk-row" style={{justifyContent:'space-between', alignItems:'baseline'}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight:700}}>Net shrinkage</span>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 26, fontWeight:700, color:'var(--conf-bad)'}}>-$71</span>
              </div>
              <div className="sk-small">5 SKUs off · 0.17% of zone-A inventory · within tolerance (0.5%)</div>
            </div>

            <FormSection title="Header">
              <Field id="count_date" label="Count date" value="Apr 19, 2026" conf="good"/>
              <Field id="counter" label="Counter" value="M. Reyes" conf="good"/>
              <Field id="zone" label="Zone / sheet" value="A · 3 of 8" conf="good"/>
            </FormSection>

            <FormSection title="Variances" count="5 of 8 SKUs">
              {[
                {id:'cnt_3', sku:'PWT-10', sys:96, cnt:88, conf:'bad', usd:'-$30.80', note:'unexplained'},
                {id:'cnt_8', sku:'GSK-04', sys:512, cnt:498, conf:'warn', usd:'-$28.00', note:'recount?'},
                {id:'cnt_4', sku:'NWS-2X4', sys:42, cnt:40, conf:'warn', usd:'-$57.00', note:'recent damage rep'},
                {id:'cnt_7', sku:'PWP-50', sys:240, cnt:232, conf:'warn', usd:'-$11.20', note:'minor'},
                {id:'cnt_5', sku:'GLB-22', sys:8, cnt:12, conf:'warn', usd:'+$56.00', note:'misshelved? '},
              ].map(v => (
                <div key={v.id} className="sk-card-tight link-target" data-link={v.id} style={{padding: 8, marginBottom: 6}}>
                  <div className="sk-row" style={{justifyContent:'space-between'}}>
                    <span style={{fontFamily:'var(--font-hand)', fontWeight:700, fontSize: 13}}>{v.sku}</span>
                    <span className="sk-mono" style={{color: v.usd.startsWith('-') ? 'var(--conf-bad)' : 'var(--conf-good)'}}>{v.usd}</span>
                  </div>
                  <div className="sk-row" style={{justifyContent:'space-between', marginTop: 2}}>
                    <span className="sk-small">sys {v.sys} → counted {v.cnt} ({v.cnt - v.sys > 0 ? '+' : ''}{v.cnt - v.sys})</span>
                    <span className="sk-pill" style={{fontSize: 9, padding:'0 5px'}}>{v.note}</span>
                  </div>
                </div>
              ))}
            </FormSection>

            <FormSection title="Adjustment journal">
              <Field label="Inventory (1310)" value="$71.00 Cr" conf="good" id="adj_inv"/>
              <Field label="Shrinkage (5810)" value="$71.00 Dr" conf="good" id="adj_shrink"/>
            </FormSection>

            <div className="sk-row" style={{gap: 8, marginTop: 12}}>
              <button className="sk-btn ghost">Recount required</button>
              <button className="sk-btn solid" style={{marginLeft:'auto'}}>Post adjustments</button>
            </div>
          </div>

          {/* CENTER: count sheet doc */}
          <div style={{flex:1, padding:14, background:'var(--paper-warm)', overflow:'auto'}}>
            <div className="sk-row" style={{gap:8, marginBottom:8}}>
              <span className="sk-pill">count sheet · 1pg</span>
              <span className="sk-pill warn">5 variances</span>
              <span className="sk-pill bad">PWT-10 critical</span>
              <div style={{flex:1}}/>
              <span className="sk-small">↳ hover any row</span>
            </div>
            <div style={{aspectRatio:'8.5/11', maxHeight:'calc(100% - 36px)'}}>
              <CountSheetDoc/>
            </div>
          </div>

          {/* RIGHT: investigation panel */}
          <div style={{width: 280, borderLeft:'1.5px solid var(--ink)', padding:12, overflow:'auto'}}>
            <div className="sk-h sk-h3" style={{marginBottom:6}}>Investigation</div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10, borderColor:'var(--accent)', borderWidth: 1.75}}>
              <div className="sk-row" style={{gap: 5, marginBottom: 4}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>PWT-10 — root cause?</span>
              </div>
              <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.7}}>
                <li>GR Apr 19: 48 (PO 50)</li>
                <li>Issued: 6 to SO-2231</li>
                <li>Last count Mar 19: 102</li>
                <li style={{color:'var(--conf-bad)'}}>-6 unexplained</li>
              </ul>
              <div className="sk-row" style={{gap: 5, marginTop: 4}}>
                <button className="sk-btn sm">Open SOP review</button>
              </div>
            </div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Linked docs</div>
              <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.6}}>
                <li>GR-1198 (Apr 19)</li>
                <li>INV-PW-04183</li>
                <li>Prior count Mar 19</li>
              </ul>
            </div>

            <div className="sk-card" style={{padding: 12, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Shrinkage trend</div>
              <SketchLine data={[20, 32, 28, 41, 35, 52, 48, 71]} color="var(--conf-bad)" fill="rgba(168,50,50,0.12)" width={240} height={56}/>
              <div className="sk-small">last 8 cycles · trending up</div>
            </div>

            <div className="sk-card" style={{padding: 12}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:15, fontWeight:700}}>Approvals</div>
              <div className="sk-small">→ Marco (you) posts<br/>→ L. Owens reviews if > $200</div>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

Object.assign(window, { CustPOConversionScreen, CountVarianceScreen });
