/* directionA.jsx — Direction A: Classic split, grouped form left, doc right.
   The "spreadsheet-feeling" baseline. Bidirectional hover, ERP context
   collapsible at far right. */

function DirectionA() {
  return (
    <LinkProvider>
      <AppChrome
        title="Doc · INV-PW-2026-04183"
        tabs={['Extract', '3-Way Match', 'GL', 'History']}
        activeTab="Extract"
        persona="Karim · AP"
        status="● auto-saved"
      >
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>

          {/* Form panel */}
          <div style={{
            width: 360, borderRight: '1.5px solid var(--ink)',
            padding: '12px 14px', overflow: 'auto',
            background: 'var(--paper)',
          }}>
            <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 10}}>
              <div className="sk-col">
                <span className="sk-h sk-h3">Vendor Invoice</span>
                <span className="sk-small">extracted from PW-2026-04183.pdf</span>
              </div>
              <ConfLegend/>
            </div>

            <FormSection title="Header" sub="vendor & dates">
              <Field id="vendor" label="Vendor" value="Pinewood Mfg. Co." conf="good"/>
              <Field id="invoice_no" label="Invoice #" value="PW-2026-04183" conf="good"/>
              <div className="sk-row" style={{gap: 8}}>
                <div style={{flex:1}}><Field id="invoice_date" label="Issue date" value="Apr 22, 2026" conf="good"/></div>
                <div style={{flex:1}}><Field id="due_date" label="Due date" value="May 22, 2026" conf="warn"/></div>
              </div>
              <Field id="po_no" label="PO reference" value="PO-44217" conf="warn" suffix={<span className="sk-small" style={{color:'var(--conf-warn)'}}>match?</span>}/>
              <Field id="bill_to" label="Bill-to" value="Acme Trading Co." conf="good"/>
            </FormSection>

            <FormSection title="Lines" count="4 items · 2,449 units">
              {[
                {id:'line_1', desc:'M8 Hex Bolt 50mm × 2,400', total:'$1,008.00', conf:'good'},
                {id:'line_2', desc:'Galvanized Washer × 2,400', total:'$192.00', conf:'good'},
                {id:'line_3', desc:'Threadlock 10ml × 48', total:'$184.80', conf:'warn'},
                {id:'line_4', desc:'Freight & handling', total:'$92.00', conf:'good'},
              ].map(l => (
                <Field key={l.id} id={l.id} label={l.desc} value={l.total} conf={l.conf}/>
              ))}
            </FormSection>

            <FormSection title="Totals & Terms">
              <div className="sk-row" style={{gap: 8}}>
                <div style={{flex:1}}><Field id="tax" label="Tax" value="$81.22" conf="good"/></div>
                <div style={{flex:1}}><Field id="total" label="Total" value="$1,558.02" conf="good"/></div>
              </div>
              <Field id="terms" label="Payment terms" value="NET 30" conf="good"/>
            </FormSection>

            <FormSection title="GL coding" sub="suggested">
              <Field id="gl_acct" label="GL account" value="5210 — Raw Materials" conf="warn" suffix={<span className="sk-small">96% conf</span>}/>
              <Field id="cost_center" label="Cost center" value="OPS-Cleveland" conf="good"/>
            </FormSection>

            <div className="sk-row" style={{gap: 8, marginTop: 14}}>
              <button className="sk-btn ghost">Reject</button>
              <button className="sk-btn">Save draft</button>
              <button className="sk-btn solid" style={{marginLeft:'auto'}}>Approve & post →</button>
            </div>
          </div>

          {/* Doc viewer */}
          <div style={{flex: 1, padding: 14, overflow:'auto', background:'var(--paper-warm)'}}>
            <div className="sk-row" style={{gap: 8, marginBottom: 8}}>
              <span className="sk-pill">page 1 / 1</span>
              <span className="sk-pill">100%</span>
              <span className="sk-pill">⌕ search</span>
              <div style={{flex:1}}/>
              <span className="sk-small">↳ hover any field or highlight</span>
            </div>
            <div style={{aspectRatio:'8.5/11', maxHeight: 'calc(100% - 30px)'}}>
              <InvoiceDoc/>
            </div>
          </div>

          {/* ERP context rail */}
          <div style={{
            width: 230, borderLeft: '1.5px solid var(--ink)',
            background: 'var(--paper)', padding: 12, overflow:'auto',
          }}>
            <div className="sk-h sk-h3" style={{marginBottom: 6}}>ERP Context</div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div className="sk-row" style={{justifyContent:'space-between', marginBottom: 4}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>3-way match</span>
                <span className="sk-pill warn">2 / 3</span>
              </div>
              <div className="sk-small" style={{lineHeight:1.6}}>
                <div className="sk-row" style={{gap:4}}><StatusDot kind="good"/> PO-44217 found</div>
                <div className="sk-row" style={{gap:4}}><StatusDot kind="good"/> GR-1198 received Apr 19</div>
                <div className="sk-row" style={{gap:4}}><StatusDot kind="warn"/> Qty mismatch: line 3 (48 vs 50)</div>
              </div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Vendor</div>
              <div className="sk-body">Pinewood Mfg. Co.</div>
              <div className="sk-small">NET 30 · ACH preferred · 14 invoices YTD</div>
              <div className="sk-small">avg pay: 28d · $42,118 outstanding</div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div className="sk-row" style={{justifyContent:'space-between'}}>
                <span style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Cash impact</span>
                <span className="sk-pill good">ok</span>
              </div>
              <SketchLine data={[40, 38, 36, 33, 30, 28, 26, 24, 23]} fill="var(--accent-soft)" width={200} height={50}/>
              <div className="sk-small">Pay May 22 → cash $24.1k (above $20k floor)</div>
            </div>

            <div className="sk-card" style={{padding: 10, marginBottom: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Inventory</div>
              <div className="sk-small" style={{lineHeight:1.6}}>
                +2,400 PWB-850 → 4,820 on hand<br/>
                +2,400 PWW-08G → 6,100 on hand<br/>
                Valuation +$1,200 (FIFO)
              </div>
            </div>

            <div className="sk-card" style={{padding: 10}}>
              <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Approval</div>
              <div className="sk-small">Next: <strong>L. Owens, Controller</strong></div>
              <div className="sk-small">Threshold > $1,000</div>
              <button className="sk-btn sm" style={{marginTop:6}}>Send for approval</button>
            </div>

            <div className="sk-row" style={{gap: 6, marginTop: 8}}>
              <span className="sk-pill good">no dupes</span>
              <span className="sk-small">checked 384 invoices</span>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

window.DirectionA = DirectionA;
