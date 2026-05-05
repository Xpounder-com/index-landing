/* secondary.jsx — Inbox, Dashboard, Inventory, CRM, Reports */

function InboxScreen() {
  const rows = [
    {who:'Pinewood Mfg.', kind:'AP Invoice', amt:'$1,558.02', date:'Apr 22', stage:'review', conf:'warn', tags:['PO match','3-way']},
    {who:'Acme Trading (us)', kind:'Customer PO', amt:'$8,420.00', date:'Apr 22', stage:'new', conf:'good', tags:['inventory']},
    {who:'Huntington Bank', kind:'Bank Stmt', amt:'—', date:'Apr 22', stage:'reconciling', conf:'good', tags:['recon · 4/12']},
    {who:'FedEx', kind:'AP Invoice', amt:'$214.40', date:'Apr 21', stage:'auto-approved', conf:'good', tags:['recurring']},
    {who:'Northwest Steel', kind:'GR / Packing slip', amt:'—', date:'Apr 21', stage:'matched', conf:'good', tags:['PO-44188']},
    {who:'Riverbend Co.', kind:'Customer Contract', amt:'$48,000', date:'Apr 21', stage:'review', conf:'bad', tags:['signature?','date?']},
    {who:'Staples', kind:'Expense Receipt', amt:'$87.32', date:'Apr 20', stage:'coded', conf:'good', tags:['6800 supplies']},
    {who:'Quarterly Count', kind:'Inventory Count', amt:'—', date:'Apr 19', stage:'review', conf:'warn', tags:['8 variances']},
    {who:'Dawson & Sons', kind:'Purchase Req.', amt:'$2,140.00', date:'Apr 19', stage:'awaiting PO', conf:'good', tags:[]},
  ];
  return (
    <AppChrome title="Inbox" persona="Karim · AP">
      <div style={{display:'flex', height:'calc(100% - 38px)'}}>
        <Sidebar active="Inbox"/>
        <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
          <div style={{padding: 14, borderBottom:'1.5px solid var(--ink)', display:'flex', gap: 10, alignItems:'center', background:'var(--paper-warm)'}}>
            <span className="sk-h sk-h2">Inbox</span>
            <span className="sk-pill">12 docs · 3 need you</span>
            <div style={{flex:1}}/>
            <div className="sk-input" style={{width: 220, fontSize: 12}}>
              <span>⌕</span><span style={{color:'var(--pencil)'}}>vendor, PO, amount…</span>
            </div>
            <button className="sk-btn">+ Upload</button>
            <button className="sk-btn solid">Connect mailbox</button>
          </div>

          {/* Filter chips */}
          <div style={{padding:'10px 14px', display:'flex', gap: 6, borderBottom:'1.25px solid var(--pencil-light)'}}>
            {['All', 'AP Invoices · 4', 'Customer POs · 2', 'Receipts · 3', 'Bank · 1', 'Contracts · 1', 'Inventory · 1'].map((t,i)=>(
              <span key={t} className={`sk-pill ${i===0 ? 'solid' : ''}`}>{t}</span>
            ))}
            <div style={{flex:1}}/>
            <span className="sk-pill">grouped: by stage</span>
          </div>

          <div style={{flex:1, overflow:'auto', padding:'4px 14px'}}>
            <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize: 13, borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', color:'var(--pencil)', fontSize: 11, textTransform:'uppercase', letterSpacing:1}}>
                  <th style={{padding:'8px 6px', width: 32}}><div className="sk-check"/></th>
                  <th style={{padding:'8px 6px'}}>From</th>
                  <th style={{padding:'8px 6px'}}>Type</th>
                  <th style={{padding:'8px 6px'}}>Amount</th>
                  <th style={{padding:'8px 6px'}}>Tags</th>
                  <th style={{padding:'8px 6px'}}>Stage</th>
                  <th style={{padding:'8px 6px'}}>Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r,i)=>(
                  <tr key={i} style={{borderTop:'1px dashed var(--pencil-light)', cursor:'pointer'}}>
                    <td style={{padding:'10px 6px'}}><div className="sk-check"/></td>
                    <td style={{padding:'10px 6px'}}>
                      <div className="sk-row" style={{gap: 8}}>
                        <StatusDot kind={r.conf}/>
                        <span style={{fontWeight: r.conf==='bad' ? 700 : 400}}>{r.who}</span>
                      </div>
                    </td>
                    <td style={{padding:'10px 6px', color:'var(--ink-3)'}}>{r.kind}</td>
                    <td style={{padding:'10px 6px', fontFamily:'var(--font-mono)'}}>{r.amt}</td>
                    <td style={{padding:'10px 6px'}}>
                      <div className="sk-row" style={{gap: 4, flexWrap:'wrap'}}>
                        {r.tags.map(t=> <span key={t} className="sk-pill" style={{fontSize: 10, padding:'1px 7px'}}>{t}</span>)}
                      </div>
                    </td>
                    <td style={{padding:'10px 6px'}}>
                      <span className={`sk-pill ${r.stage === 'review' ? 'warn' : r.stage === 'auto-approved' || r.stage === 'matched' || r.stage === 'coded' ? 'good' : ''}`} style={{fontSize: 11}}>{r.stage}</span>
                    </td>
                    <td style={{padding:'10px 6px', color:'var(--pencil)'}}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

function DashboardScreen() {
  return (
    <AppChrome title="Dashboard" persona="Sara · Owner">
      <div style={{display:'flex', height:'calc(100% - 38px)'}}>
        <Sidebar active="Dashboard"/>
        <div style={{flex:1, padding: 18, overflow:'auto', background:'var(--paper-warm)'}}>
          <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 12}}>
            <div>
              <div className="sk-h sk-h2">Tuesday, Apr 22</div>
              <div className="sk-body">Single source of truth · last sync 3 min ago</div>
            </div>
            <div className="sk-row" style={{gap: 6}}>
              <span className="sk-pill">this month</span>
              <span className="sk-pill solid">vs last</span>
              <button className="sk-btn">Customize</button>
            </div>
          </div>

          {/* KPI strip */}
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12, marginBottom: 14}}>
            {[
              {k:'Cash on hand', v:'$24,118', d:'-12% vs Mar', spark:[40,38,36,33,30,28,26,24], tone:'warn'},
              {k:'Gross margin', v:'34.2%', d:'+0.8 pts', spark:[30,31,32,32,33,33,34,34], tone:'good'},
              {k:'Inventory turns', v:'6.1×', d:'on target', spark:[5.5,5.7,5.8,6,6.1,6.2,6.1,6.1], tone:'good'},
              {k:'Sales pipeline', v:'$184k', d:'12 deals', spark:[120,140,150,160,170,175,180,184], tone:'good'},
            ].map((c,i)=>(
              <div key={i} className="sk-card" style={{padding: 12}}>
                <div className="sk-small" style={{textTransform:'uppercase', letterSpacing:1}}>{c.k}</div>
                <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 28, fontWeight: 700, lineHeight: 1}}>{c.v}</div>
                <div className="sk-small">{c.d}</div>
                <div style={{marginTop: 4}}><SketchLine data={c.spark} width={170} height={36} fill="var(--accent-soft)"/></div>
              </div>
            ))}
          </div>

          {/* Mid: late & purchase commitments */}
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap: 12, marginBottom: 14}}>
            <div className="sk-card" style={{padding: 14}}>
              <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 6}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Cash runway · 90d</span>
                <span className="sk-pill warn">dips week of May 15</span>
              </div>
              <SketchLine data={[40,38,36,33,30,28,26,24,22,19,18,20,22,25,28]} fill="var(--accent-soft)" width={420} height={110}/>
              <div className="sk-small">$20k floor · 4 invoices total $8.1k due in window</div>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Late orders</div>
              <div className="sk-body" style={{lineHeight: 1.7}}>
                <div className="sk-row" style={{gap:5}}><StatusDot kind="bad"/> SO-2231 · Riverbend · 4d late</div>
                <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/> SO-2244 · Halsey · 1d late</div>
                <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/> PO-44217 partial recv</div>
                <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/> 11 on track</div>
              </div>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Open purchase commit.</div>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 26, fontWeight:700}}>$42,118</div>
              <div className="sk-small">7 vendors · 14 POs</div>
              <div style={{marginTop: 4}}><SketchBars data={[12,8,6,5,4,4,3]} width={200} height={50}/></div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 12}}>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Margin by SKU</div>
              <SketchBars data={[42,38,35,32,30,28,22,18,12]} width={260} height={70}/>
              <div className="sk-small">PWB-850 highest · PWT-10 lowest</div>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Top customers</div>
              <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft: 14, lineHeight:1.7}}>
                <li>Riverbend · $48k YTD · contract renews Aug</li>
                <li>Halsey Co. · $32k · 12 orders</li>
                <li>Acme East · $24k · NET 60</li>
                <li>Tide Logistics · $18k</li>
              </ul>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>What needs me</div>
              <div className="sk-body" style={{lineHeight: 1.8}}>
                <div className="sk-row" style={{gap:5}}><span className="sk-pill warn" style={{fontSize:10}}>3</span> invoices to approve</div>
                <div className="sk-row" style={{gap:5}}><span className="sk-pill bad" style={{fontSize:10}}>1</span> contract — sig missing</div>
                <div className="sk-row" style={{gap:5}}><span className="sk-pill warn" style={{fontSize:10}}>8</span> count variances</div>
                <div className="sk-row" style={{gap:5}}><span className="sk-pill" style={{fontSize:10}}>2</span> POs to issue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

function InventoryScreen() {
  const skus = [
    {sku:'PWB-850', name:'M8 Hex Bolt 50mm', oh:4820, rop:1500, on_po:0, value:'$2,024', turn:'7.2×', trend:'good'},
    {sku:'PWW-08G', name:'Galvanized Washer 8mm', oh:6100, rop:2000, on_po:0, value:'$488', turn:'8.1×', trend:'good'},
    {sku:'PWT-10', name:'Threadlock 10ml tube', oh:96, rop:120, on_po:50, value:'$370', turn:'4.4×', trend:'warn'},
    {sku:'NWS-2X4', name:'Steel Beam 2"×4"', oh:42, rop:60, on_po:120, value:'$3,318', turn:'3.1×', trend:'warn'},
    {sku:'GLB-22', name:'Glass Block 22cm', oh:8, rop:40, on_po:0, value:'$112', turn:'1.8×', trend:'bad'},
    {sku:'CBL-100', name:'Copper Cable 100m', oh:14, rop:10, on_po:0, value:'$2,800', turn:'5.2×', trend:'good'},
  ];
  return (
    <AppChrome title="Inventory & warehouse" persona="Marco · Warehouse">
      <div style={{display:'flex', height:'calc(100% - 38px)'}}>
        <Sidebar active="Inventory"/>
        <div style={{flex:1, padding: 18, overflow:'auto', background:'var(--paper-warm)'}}>
          <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 14}}>
            <div className="sk-h sk-h2">Inventory · Cleveland WH</div>
            <div className="sk-row" style={{gap: 6}}>
              <span className="sk-pill warn">2 below ROP</span>
              <span className="sk-pill bad">1 stockout risk</span>
              <button className="sk-btn">Cycle count</button>
              <button className="sk-btn solid">Issue PO</button>
            </div>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap: 12, marginBottom: 14}}>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Valuation by category</div>
              <SketchBars data={[80, 65, 48, 32, 22, 14]} width={420} height={80}/>
              <div className="sk-small">FIFO · $42,180 total</div>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Turns by SKU</div>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 30, fontWeight:700}}>6.1×</div>
              <div className="sk-small">last 90d · target 6×</div>
            </div>
            <div className="sk-card" style={{padding: 14}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Open POs</div>
              <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.6}}>
                <li>PO-44217 · Pinewood · partial recv</li>
                <li>PO-44218 · Northwest Steel · in transit</li>
                <li>PO-44220 · Pinewood · placed today</li>
              </ul>
            </div>
          </div>

          <div className="sk-card" style={{padding: 0, overflow:'hidden'}}>
            <div style={{padding: '10px 14px', borderBottom:'1.5px solid var(--ink)', background:'var(--paper-warm)', display:'flex', gap: 10, alignItems:'center'}}>
              <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Stock by SKU</span>
              <span className="sk-small">linked to AP invoices · GR · POs</span>
              <div style={{flex:1}}/>
              <span className="sk-pill">linked: 14 docs</span>
            </div>
            <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize:12, borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', color:'var(--pencil)', fontSize:11, textTransform:'uppercase', letterSpacing: 1}}>
                  <th style={{padding:'8px 12px'}}>SKU</th>
                  <th style={{padding:'8px 12px'}}>Description</th>
                  <th style={{padding:'8px 12px'}}>On hand</th>
                  <th style={{padding:'8px 12px'}}>ROP</th>
                  <th style={{padding:'8px 12px'}}>Coverage</th>
                  <th style={{padding:'8px 12px'}}>On PO</th>
                  <th style={{padding:'8px 12px'}}>Value</th>
                  <th style={{padding:'8px 12px'}}>Turns</th>
                </tr>
              </thead>
              <tbody>
                {skus.map(s=>{
                  const pct = Math.min(100, (s.oh / Math.max(s.rop, 1)) * 50);
                  return (
                    <tr key={s.sku} style={{borderTop:'1px dashed var(--pencil-light)'}}>
                      <td style={{padding:'10px 12px', fontFamily:'var(--font-mono)'}}>{s.sku}</td>
                      <td style={{padding:'10px 12px'}}>{s.name}</td>
                      <td style={{padding:'10px 12px', fontWeight:700}}>{s.oh.toLocaleString()}</td>
                      <td style={{padding:'10px 12px', color:'var(--pencil)'}}>{s.rop}</td>
                      <td style={{padding:'10px 12px', width: 140}}>
                        <div style={{height: 6, width:120, background:'var(--pencil-faint)', borderRadius: 2, position:'relative'}}>
                          <div style={{position:'absolute', inset: 0, width: `${pct}%`, background: s.trend === 'bad' ? 'var(--conf-bad)' : s.trend === 'warn' ? 'var(--conf-warn)' : 'var(--conf-good)', borderRadius: 2}}/>
                          <div style={{position:'absolute', left: 50, top: -2, height: 10, width: 1.5, background:'var(--ink)'}}/>
                        </div>
                      </td>
                      <td style={{padding:'10px 12px'}}>{s.on_po ? <span className="sk-pill" style={{fontSize:10}}>+{s.on_po}</span> : '—'}</td>
                      <td style={{padding:'10px 12px', fontFamily:'var(--font-mono)'}}>{s.value}</td>
                      <td style={{padding:'10px 12px'}}>{s.turn}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

function CRMScreen() {
  return (
    <AppChrome title="Customer 360 · Riverbend Co." persona="Sara · Owner">
      <div style={{display:'flex', height:'calc(100% - 38px)'}}>
        <Sidebar active="Customers"/>
        <div style={{width: 220, borderRight:'1.5px solid var(--ink)', padding:'10px 8px', overflow:'auto', background:'var(--paper)'}}>
          <div className="sk-input" style={{fontSize:12, marginBottom: 8}}>⌕ <span style={{color:'var(--pencil)'}}>find customer…</span></div>
          {['Riverbend Co.', 'Halsey Co.', 'Acme East', 'Tide Logistics', 'Norfolk Mfg.', 'Greenline Foods', 'Bayside Dist.'].map((c,i)=>(
            <div key={c} className={`sk-nav ${i===0 ? 'active' : ''}`}>
              <span style={{flex:1}}>{c}</span>
              {i===0 && <span className="sk-pill" style={{fontSize:10, padding:'0 5px', background:'var(--paper)', color:'var(--ink)'}}>!</span>}
            </div>
          ))}
        </div>

        <div style={{flex:1, padding:18, overflow:'auto', background:'var(--paper-warm)'}}>
          <div className="sk-row" style={{gap: 12, marginBottom: 14, alignItems:'center'}}>
            <div style={{width: 56, height: 56, border:'1.75px solid var(--ink)', borderRadius:'8px 12px 6px 10px', background:'var(--paper)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-hand-loose)', fontSize: 26, fontWeight:700}}>R</div>
            <div>
              <div className="sk-h sk-h2">Riverbend Co.</div>
              <div className="sk-body">Cleveland OH · NET 60 · primary: Joan Tyler</div>
            </div>
            <div style={{flex:1}}/>
            <span className="sk-pill bad">SO 4d late</span>
            <button className="sk-btn">Email</button>
            <button className="sk-btn solid">New SO</button>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 12, marginBottom: 14}}>
            {[
              {k:'YTD revenue', v:'$48,200'},
              {k:'Open AR', v:'$8,420', tone:'warn'},
              {k:'Avg days to pay', v:'52d'},
              {k:'Lifetime', v:'$184k'},
            ].map((c,i)=>(
              <div key={i} className="sk-card" style={{padding: 12}}>
                <div className="sk-small" style={{textTransform:'uppercase', letterSpacing: 1}}>{c.k}</div>
                <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 24, fontWeight: 700}}>{c.v}</div>
              </div>
            ))}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 12}}>
            <div className="sk-card" style={{padding: 14}}>
              <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 6}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Linked documents</span>
                <span className="sk-small">orders · contracts · invoices · payments</span>
              </div>
              <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize: 12}}>
                <thead><tr style={{textAlign:'left', color:'var(--pencil)', textTransform:'uppercase', fontSize: 10, letterSpacing:1}}>
                  <th style={{padding:'4px 0'}}>Doc</th><th>Type</th><th>Amt</th><th>Stage</th><th>Date</th>
                </tr></thead>
                <tbody>
                  {[
                    {d:'Master Services Agmt', t:'Contract', a:'$48k/yr', s:'active', dt:'Aug 2025', tone:''},
                    {d:'SO-2231', t:'Sales Order', a:'$8,420', s:'late', dt:'Apr 16', tone:'bad'},
                    {d:'INV-1108', t:'Invoice', a:'$8,420', s:'open', dt:'Apr 16', tone:'warn'},
                    {d:'SO-2198', t:'Sales Order', a:'$6,100', s:'shipped', dt:'Apr 02', tone:'good'},
                    {d:'PMT-882', t:'Payment', a:'$6,100', s:'cleared', dt:'Apr 06', tone:'good'},
                    {d:'SO-2174', t:'Sales Order', a:'$4,200', s:'shipped', dt:'Mar 21', tone:'good'},
                  ].map((r,i)=>(
                    <tr key={i} style={{borderTop:'1px dashed var(--pencil-light)'}}>
                      <td style={{padding:'7px 0', fontWeight: 700}}>{r.d}</td>
                      <td>{r.t}</td>
                      <td style={{fontFamily:'var(--font-mono)'}}>{r.a}</td>
                      <td><span className={`sk-pill ${r.tone}`} style={{fontSize:10}}>{r.s}</span></td>
                      <td style={{color:'var(--pencil)'}}>{r.dt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sk-col" style={{gap: 12}}>
              <div className="sk-card" style={{padding: 14}}>
                <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Open pipeline</div>
                <SketchBars data={[12,8,6,4,2]} width={200} height={50}/>
                <div className="sk-small">Q1 disc · proposal · won (5 stages)</div>
              </div>
              <div className="sk-card" style={{padding: 14}}>
                <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, fontWeight: 700}}>Notes</div>
                <div className="sk-note" style={{transform:'rotate(-1deg)', fontSize: 14, marginTop: 4}}>
                  Joan asked about volume break at 5k units — quoted Mar 19, no resp.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

function ReportsScreen() {
  const reports = [
    {n:'Cash position · 90d', d:'rolling', tag:'Finance', star: true},
    {n:'AP aging · all vendors', d:'as of today', tag:'Finance'},
    {n:'AR aging · all customers', d:'as of today', tag:'Finance', star: true},
    {n:'Inventory turns by category', d:'last 90d', tag:'Inventory'},
    {n:'Margin by SKU', d:'MTD', tag:'Operations'},
    {n:'Late orders / SLA breaches', d:'open', tag:'Operations', star: true},
    {n:'Vendor spend concentration', d:'YTD', tag:'Procurement'},
    {n:'Sales pipeline by stage', d:'open', tag:'CRM'},
    {n:'Purchase commitments', d:'open POs', tag:'Procurement'},
    {n:'Cycle count variances', d:'last count', tag:'Inventory'},
  ];
  return (
    <AppChrome title="Reports & analytics" persona="Lana · Controller">
      <div style={{display:'flex', height:'calc(100% - 38px)'}}>
        <Sidebar active="Reports"/>
        <div style={{flex:1, padding: 18, overflow:'auto', background:'var(--paper-warm)'}}>
          <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 14}}>
            <div>
              <div className="sk-h sk-h2">Reports</div>
              <div className="sk-body">Single source of truth · pulls from extracted docs + ledger</div>
            </div>
            <div className="sk-row" style={{gap:6}}>
              <button className="sk-btn ghost">+ Build report</button>
              <button className="sk-btn">Schedule</button>
              <button className="sk-btn solid">Ask in plain English</button>
            </div>
          </div>

          {/* Plain-english search */}
          <div className="sk-card" style={{padding: 12, marginBottom: 14, borderColor:'var(--accent)', borderWidth: 1.75}}>
            <div className="sk-row" style={{gap:8}}>
              <span style={{fontFamily:'var(--font-hand-loose)', fontSize: 18, color:'var(--accent)'}}>?</span>
              <span style={{fontFamily:'var(--font-hand)', fontSize: 14, flex: 1}}>"Which Pinewood SKUs lost margin this quarter, and why?"</span>
              <button className="sk-btn sm accent">Ask</button>
            </div>
          </div>

          <div className="sk-row" style={{gap: 6, marginBottom: 12}}>
            {['All', 'Finance', 'Operations', 'Inventory', 'CRM', 'Procurement'].map((t,i)=>(
              <span key={t} className={`sk-pill ${i===0 ? 'solid' : ''}`}>{t}</span>
            ))}
            <div style={{flex:1}}/>
            <span className="sk-pill">⭐ pinned · 3</span>
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 12}}>
            {reports.map((r,i)=>(
              <div key={i} className="sk-card" style={{padding: 12}}>
                <div className="sk-row" style={{justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 17, fontWeight: 700, lineHeight: 1.1}}>{r.n}</div>
                    <div className="sk-small">{r.d} · {r.tag}</div>
                  </div>
                  <span style={{fontSize: 16, color: r.star ? 'var(--accent)' : 'var(--pencil-light)'}}>★</span>
                </div>
                <div style={{marginTop: 8, height: 60, display:'flex', alignItems:'flex-end'}}>
                  {i % 3 === 0 ? (
                    <SketchLine data={[3,4,3,5,4,6,7,6,8,7,9]} fill="var(--accent-soft)" width={250} height={60}/>
                  ) : i % 3 === 1 ? (
                    <SketchBars data={[4,7,5,9,6,8,3,7,5]} width={250} height={60}/>
                  ) : (
                    <SketchBars data={[8,7,6,5,4,3,2]} color="var(--accent)" width={250} height={60}/>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppChrome>
  );
}

Object.assign(window, { InboxScreen, DashboardScreen, InventoryScreen, CRMScreen, ReportsScreen });
