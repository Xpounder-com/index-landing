/* directionB2.jsx — Direction B v2: Stepped review with DOC-TYPE VARIANTS
   Each doc type has its own stepper flow + extracted fields + ERP impact.
   Switcher at top to compare flows. */

function DirectionB2() {
  const [docType, setDocType] = React.useState('invoice');
  const [step, setStep] = React.useState(1);

  const variants = {
    invoice: {
      label: 'AP Invoice',
      sub: 'Pinewood Mfg. · INV-PW-2026-04183',
      doc: <InvoiceDoc narrow/>,
      steps: ['Capture','Match','Code','Approve'],
      stepBody: InvoiceStepBody,
    },
    bank: {
      label: 'Bank statement',
      sub: 'Huntington · Acct ••8842 · April',
      doc: <BankStmtDoc/>,
      steps: ['Capture','Reconcile','Categorize','Close'],
      stepBody: BankStepBody,
    },
    cust_po: {
      label: 'Customer PO → SO',
      sub: 'Riverbend Co. · PO RB-9981',
      doc: <CustomerPODoc/>,
      steps: ['Capture','Allocate stock','Price & terms','Confirm SO'],
      stepBody: CustPOStepBody,
    },
    count: {
      label: 'Inventory count',
      sub: 'Cleveland WH · Q2 cycle · sheet 3',
      doc: <CountSheetDoc/>,
      steps: ['Capture','Triage variances','Investigate','Post adjustments'],
      stepBody: CountStepBody,
    },
  };

  const v = variants[docType];
  React.useEffect(()=>setStep(1), [docType]);
  const StepBody = v.stepBody;

  return (
    <LinkProvider>
      <AppChrome title={`Stepped review · ${v.sub}`} persona="Karim · AP" status={`step ${step+1} of ${v.steps.length}`}>
        <div style={{display:'flex', height:'calc(100% - 38px)'}}>
          <Sidebar active="Inbox"/>
          <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
            {/* Doc-type tabs */}
            <div style={{padding:'10px 18px 0', borderBottom:'1.5px solid var(--ink)', background:'var(--paper-warm)'}}>
              <div className="sk-row" style={{gap: 4, marginBottom: 8, flexWrap:'wrap'}}>
                {Object.entries(variants).map(([k, val]) => (
                  <span key={k}
                    onClick={()=>setDocType(k)}
                    className={`sk-tab ${docType===k?'active':''}`}
                    style={{cursor:'pointer', fontSize: 13, padding:'5px 12px'}}>
                    {val.label}
                  </span>
                ))}
                <div style={{flex:1}}/>
                <span className="sk-small" style={{alignSelf:'center'}}>doc-type-aware flow</span>
              </div>
              {/* Stepper */}
              <div className="sk-row" style={{gap: 8, alignItems:'center', paddingBottom: 12}}>
                {v.steps.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="sk-row" style={{gap:6, cursor:'pointer'}} onClick={()=>setStep(i)}>
                      <div style={{
                        width: 24, height: 24, borderRadius:'50%',
                        border:'1.75px solid var(--ink)',
                        background: i <= step ? 'var(--ink)' : 'var(--paper)',
                        color: i <= step ? 'var(--paper)' : 'var(--ink)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:'var(--font-hand-loose)', fontWeight:700, fontSize: 13,
                      }}>{i < step ? '✓' : i+1}</div>
                      <span style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700,
                        color: i === step ? 'var(--ink)' : 'var(--pencil)'}}>{s}</span>
                    </div>
                    {i < v.steps.length - 1 && <div style={{flex:1, height:0, borderTop:'2px dashed var(--pencil-light)'}}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div style={{flex:1, display:'flex', overflow:'hidden'}}>
              <div style={{width: 440, padding: 18, overflow:'auto', borderRight:'1.5px solid var(--ink)'}}>
                <StepBody step={step} setStep={setStep} stepCount={v.steps.length}/>
              </div>
              <div style={{flex:1, padding: 16, background:'var(--paper-warm)', overflow:'auto'}}>
                <div className="sk-row" style={{gap: 6, marginBottom: 8}}>
                  <span className="sk-pill accent">{v.label.toLowerCase()}</span>
                  <span className="sk-small">hover any field ↔ doc</span>
                </div>
                <div style={{aspectRatio:'8.5/11', maxHeight:'calc(100% - 36px)'}}>{v.doc}</div>
              </div>
            </div>
          </div>
        </div>
      </AppChrome>
    </LinkProvider>
  );
}

function NavBtns({ step, setStep, stepCount, primary='Continue' }) {
  return (
    <div className="sk-row" style={{gap:8, marginTop: 12}}>
      <button className="sk-btn ghost" onClick={()=>setStep(s=>Math.max(0,s-1))}>← Back</button>
      <button className="sk-btn">Hold</button>
      <button className="sk-btn solid" style={{marginLeft:'auto'}} onClick={()=>setStep(s=>Math.min(stepCount-1,s+1))}>{primary} →</button>
    </div>
  );
}

/* ---------- Invoice flow ---------- */
function InvoiceStepBody({step, setStep, stepCount}) {
  const titles = ['Confirm extraction','Match against PO & GR','Code to GL','Approve & post'];
  return (
    <>
      <Squiggle width={70}/>
      <div className="sk-h sk-h2" style={{marginBottom: 4}}>{titles[step]}</div>
      <div className="sk-body" style={{marginBottom: 14}}>
        {['Verify what came off the page.','3-way match: invoice ↔ PO ↔ GR.','Pick the GL account & cost center.','Last check before it hits the books.'][step]}
      </div>

      {step === 0 && (
        <div className="sk-card" style={{padding: 12}}>
          <Field id="vendor" label="Vendor" value="Pinewood Mfg. Co." conf="good"/>
          <Field id="invoice_no" label="Invoice #" value="PW-2026-04183" conf="good"/>
          <Field id="invoice_date" label="Issue date" value="Apr 22, 2026" conf="good"/>
          <Field id="due_date" label="Due date" value="May 22, 2026" conf="warn"/>
          <Field id="total" label="Total" value="$1,558.02" conf="good"/>
        </div>
      )}

      {step === 1 && (
        <>
          <div className="sk-card" style={{padding:14, marginBottom:12}}>
            <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700, marginBottom:6}}>PO match</div>
            <Field id="po_no" label="PO on doc" value="PO-44217" conf="good"/>
            <div className="sk-row" style={{gap:6}}><Arrow dir="bidir"/><span className="sk-body">PO-44217 · Pinewood · $1,512 expected</span></div>
          </div>
          <div className="sk-card" style={{padding:14}}>
            <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700, marginBottom: 6}}>Goods receipt</div>
            <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize:12}}>
              <thead><tr style={{textAlign:'left', color:'var(--pencil)'}}><th>Item</th><th>PO</th><th>Got</th><th>Inv</th></tr></thead>
              <tbody>
                <tr><td>Bolt</td><td>2400</td><td>2400</td><td style={{color:'var(--conf-good)'}}>2400 ✓</td></tr>
                <tr><td>Washer</td><td>2400</td><td>2400</td><td style={{color:'var(--conf-good)'}}>2400 ✓</td></tr>
                <tr><td>Threadlock</td><td>50</td><td>50</td><td style={{color:'var(--conf-bad)', fontWeight:700}}>48 ⚠</td></tr>
              </tbody>
            </table>
            <div className="sk-note" style={{marginTop:10, transform:'rotate(-0.8deg)'}}>Short 2 tubes — accept partial?</div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="sk-card" style={{padding: 12}}>
          <Field id="gl_acct" label="GL account" value="5210 — Raw Materials" conf="warn" suffix={<span className="sk-small">96%</span>}/>
          <Field id="cost_center" label="Cost center" value="OPS-Cleveland" conf="good"/>
          <Field id="terms" label="Terms" value="NET 30" conf="good"/>
          <div className="sk-small" style={{marginTop:6}}>Will hit AP — Pinewood Cr $1,558.02 / Raw Mat Dr $1,476.80</div>
        </div>
      )}

      {step === 3 && (
        <div className="sk-card" style={{padding: 14}}>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">All extracted fields verified</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/><span className="sk-body">Qty short on L3 (accepted)</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">No duplicates · cash ok · approver L. Owens</span></div>
          <div style={{marginTop: 10}}>
            <button className="sk-btn solid" style={{width:'100%'}}>Approve & post to GL</button>
          </div>
        </div>
      )}
      <NavBtns step={step} setStep={setStep} stepCount={stepCount}/>
    </>
  );
}

/* ---------- Bank statement flow ---------- */
function BankStepBody({step, setStep, stepCount}) {
  const titles = ['Imported bank statement','Reconcile against ledger','Categorize unmatched','Close month'];
  return (
    <>
      <Squiggle width={70}/>
      <div className="sk-h sk-h2" style={{marginBottom: 4}}>{titles[step]}</div>
      <div className="sk-body" style={{marginBottom: 14}}>
        {['11 transactions parsed from PDF.','Auto-match to ledger entries.','7 left to code.','Lock April once everything ties.'][step]}
      </div>

      {step === 0 && (
        <div className="sk-card" style={{padding: 12}}>
          <Field label="Bank" value="Huntington · ••8842" conf="good" id="bank"/>
          <Field label="Statement period" value="Apr 1 – Apr 30" conf="good" id="period"/>
          <Field label="Opening balance" value="$36,420.18" conf="good" id="open_bal"/>
          <Field label="Closing balance" value="$24,118.02" conf="good" id="close_bal"/>
          <Field label="Transactions" value="11 entries" conf="good" id="txn_count"/>
        </div>
      )}

      {step === 1 && (
        <div className="sk-card" style={{padding: 14}}>
          <div className="sk-row" style={{justifyContent:'space-between'}}>
            <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Auto-match</span>
            <span className="sk-pill warn">7 / 11 matched</span>
          </div>
          <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.7, marginTop: 4}}>
            <li>ACH PINEWOOD $1,512 → INV-PW-04129 ✓</li>
            <li>WIRE OUT $4,200 → SO-2231 (Riverbend) ✓</li>
            <li>POS STAPLES $87 → expense receipt ✓</li>
            <li><span style={{color:'var(--conf-warn)'}}>CHECK 4421 $890 → no ledger match</span></li>
            <li><span style={{color:'var(--conf-warn)'}}>ACH UTILITY $312 → unmatched</span></li>
          </ul>
        </div>
      )}

      {step === 2 && (
        <div className="sk-card" style={{padding: 12}}>
          <div className="sk-body" style={{marginBottom: 6}}>For each unmatched txn, IDX suggests a category:</div>
          <div className="sk-card-tight" style={{padding:8, marginBottom:6}}>
            <div className="sk-row" style={{justifyContent:'space-between'}}>
              <span className="sk-mono">CHECK 4421 · $890</span><span className="sk-pill warn">88%</span>
            </div>
            <div className="sk-body">→ 6300 Rent (recurs every Apr)</div>
          </div>
          <div className="sk-card-tight" style={{padding:8}}>
            <div className="sk-row" style={{justifyContent:'space-between'}}>
              <span className="sk-mono">ACH UTILITY · $312</span><span className="sk-pill warn">82%</span>
            </div>
            <div className="sk-body">→ 6310 Utilities</div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="sk-card" style={{padding: 14}}>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">11 / 11 reconciled</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">Closing balance matches ledger</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/><span className="sk-body">2 categorizations need controller sign-off</span></div>
          <button className="sk-btn solid" style={{width:'100%', marginTop: 8}}>Lock April</button>
        </div>
      )}
      <NavBtns step={step} setStep={setStep} stepCount={stepCount} primary={step===2?'Apply codings':'Continue'}/>
    </>
  );
}

/* ---------- Customer PO → SO flow ---------- */
function CustPOStepBody({step, setStep, stepCount}) {
  const titles = ['Captured customer PO','Allocate stock from inventory','Confirm price & terms','Create sales order'];
  return (
    <>
      <Squiggle width={70}/>
      <div className="sk-h sk-h2" style={{marginBottom:4}}>{titles[step]}</div>
      <div className="sk-body" style={{marginBottom: 14}}>
        {['4 line items off the PDF — verify the ones we flagged.','Decide which warehouse covers which line.','Cross-check against contract pricing & credit.','One click → SO drops into operations.'][step]}
      </div>

      {step === 0 && (
        <div className="sk-card" style={{padding: 12}}>
          <Field id="cust" label="Customer" value="Riverbend Co." conf="good"/>
          <Field id="cust_po" label="PO #" value="RB-9981" conf="good"/>
          <Field id="contact" label="Buyer" value="Joan Tyler" conf="good"/>
          <Field id="need_by" label="Need by" value="May 6, 2026" conf="warn" suffix={<span className="sk-small">tight</span>}/>
          <Field id="ship_to" label="Ship-to" value="dock-2" conf="good"/>
          <Field id="so_total" label="Total" value="$8,418.00" conf="good"/>
          <Field id="so_terms" label="Terms" value="NET 60" conf="warn" suffix={<span className="sk-small">contract says NET 45?</span>}/>
        </div>
      )}

      {step === 1 && (
        <div className="sk-card" style={{padding: 14}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700, marginBottom:6}}>Stock allocation</div>
          <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize:12}}>
            <thead><tr style={{textAlign:'left', color:'var(--pencil)'}}><th>Item</th><th>Need</th><th>OH</th><th>Action</th></tr></thead>
            <tbody>
              <tr className="link-target" data-link="so_l1"><td>PWB-850</td><td>1,200</td><td>4,820</td><td style={{color:'var(--conf-good)'}}>allocate ✓</td></tr>
              <tr className="link-target" data-link="so_l2"><td>PWW-08G</td><td>1,200</td><td>6,100</td><td style={{color:'var(--conf-good)'}}>allocate ✓</td></tr>
              <tr className="link-target" data-link="so_l3"><td>CBL-100</td><td>24</td><td>14</td><td style={{color:'var(--conf-warn)', fontWeight:700}}>backorder 10 ⚠</td></tr>
              <tr className="link-target" data-link="so_l4"><td>NWS-2X4</td><td>12</td><td>42</td><td style={{color:'var(--conf-good)'}}>allocate ✓</td></tr>
            </tbody>
          </table>
          <div className="sk-note" style={{marginTop:10, transform:'rotate(0.6deg)'}}>
            Cable short 10 — issue PO to Pinewood?<br/>
            <span className="sk-small">lead time 4d · still hits May 6</span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="sk-card" style={{padding: 12}}>
          <div className="sk-row" style={{justifyContent:'space-between'}}>
            <span style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Pricing check</span>
            <span className="sk-pill good">on contract</span>
          </div>
          <div className="sk-body" style={{lineHeight: 1.6}}>
            All 4 line prices match Riverbend MSA · vol break tier 2.
          </div>
          <div className="sk-divider-soft"/>
          <div className="sk-row" style={{justifyContent:'space-between'}}>
            <span style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Terms / credit</span>
            <span className="sk-pill warn">flag</span>
          </div>
          <div className="sk-body">
            PO says NET 60. Contract says NET 45. Prior pay avg <strong>52d</strong>.<br/>
            Open AR with Riverbend: <strong>$8,420</strong>.
          </div>
          <button className="sk-btn sm" style={{marginTop:6}}>Apply NET 45</button>
        </div>
      )}

      {step === 3 && (
        <div className="sk-card" style={{padding: 14}}>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">SO-2247 ready to issue</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="warn"/><span className="sk-body">10 cable on backorder → PO to Pinewood</span></div>
          <div className="sk-row" style={{gap:5}}><StatusDot kind="good"/><span className="sk-body">Forecast cash +$8,418 by Jul 6</span></div>
          <button className="sk-btn solid" style={{width:'100%', marginTop:8}}>Create SO + PO</button>
        </div>
      )}
      <NavBtns step={step} setStep={setStep} stepCount={stepCount} primary={step===3?'Create':'Continue'}/>
    </>
  );
}

/* ---------- Inventory count variance flow ---------- */
function CountStepBody({step, setStep, stepCount}) {
  const titles = ['Count sheet captured','Triage variances','Investigate the worst','Post adjustments'];
  return (
    <>
      <Squiggle width={70}/>
      <div className="sk-h sk-h2" style={{marginBottom:4}}>{titles[step]}</div>
      <div className="sk-body" style={{marginBottom:14}}>
        {['8 SKUs counted on this sheet.','5 SKUs are off. Sort by impact.','Look at history before adjusting.','Write the adjustments to the ledger.'][step]}
      </div>

      {step === 0 && (
        <div className="sk-card" style={{padding: 12}}>
          <Field id="count_date" label="Count date" value="Apr 19, 2026" conf="good"/>
          <Field label="Counter" value="M. Reyes" conf="good" id="counter"/>
          <Field label="Zone" value="A · sheet 3 / 8" conf="good" id="zone"/>
          <Field label="SKUs counted" value="8" conf="good" id="skus"/>
          <Field label="Variances detected" value="5 (1 critical · 4 minor)" conf="warn" id="var_count"/>
        </div>
      )}

      {step === 1 && (
        <div className="sk-card" style={{padding: 12}}>
          <div className="sk-row" style={{justifyContent:'space-between', marginBottom:6}}>
            <span style={{fontFamily:'var(--font-hand-loose)', fontSize:18, fontWeight:700}}>Variances by $ impact</span>
            <span className="sk-pill warn">5 of 8</span>
          </div>
          <table style={{width:'100%', fontFamily:'var(--font-hand)', fontSize:12}}>
            <thead><tr style={{textAlign:'left', color:'var(--pencil)'}}><th>SKU</th><th>Δ</th><th>$ impact</th></tr></thead>
            <tbody>
              <tr className="link-target" data-link="cnt_3"><td><strong>PWT-10</strong></td><td style={{color:'var(--conf-bad)'}}>-8</td><td>-$30.80</td></tr>
              <tr className="link-target" data-link="cnt_8"><td>GSK-04</td><td style={{color:'var(--conf-warn)'}}>-14</td><td>-$28.00</td></tr>
              <tr className="link-target" data-link="cnt_4"><td>NWS-2X4</td><td style={{color:'var(--conf-warn)'}}>-2</td><td>-$57.00</td></tr>
              <tr className="link-target" data-link="cnt_7"><td>PWP-50</td><td style={{color:'var(--conf-warn)'}}>-8</td><td>-$11.20</td></tr>
              <tr className="link-target" data-link="cnt_5"><td>GLB-22</td><td style={{color:'var(--conf-warn)'}}>+4</td><td>+$56.00</td></tr>
            </tbody>
          </table>
          <div className="sk-small" style={{marginTop: 6}}>Net shrinkage: <strong>-$71</strong> · 0.17% of inventory</div>
        </div>
      )}

      {step === 2 && (
        <div className="sk-card" style={{padding: 12}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>PWT-10 · why short 8?</div>
          <ul style={{fontFamily:'var(--font-hand)', fontSize:12, paddingLeft:14, lineHeight:1.7}}>
            <li>Last GR Apr 19: 48 received (PO said 50) — already noted</li>
            <li>Last issued: SO-2231 took 6 (Apr 17)</li>
            <li>Prior count: 102 on Mar 19 → expected 96, found 88</li>
            <li className="link-target" data-link="cnt_3" style={{color:'var(--conf-bad)'}}>Unexplained -6 since last count</li>
          </ul>
          <div className="sk-note" style={{marginTop: 8, transform:'rotate(-0.6deg)'}}>
            Likely a partial-tube write-off not logged. Adjust + flag for SOP review.
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="sk-card" style={{padding: 14}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize:16, fontWeight:700}}>Adjustments to post</div>
          <table style={{width:'100%', fontFamily:'var(--font-mono)', fontSize:11, marginTop: 4}}>
            <tbody>
              <tr><td>1310 Inventory</td><td style={{textAlign:'right'}}>$71.00 Cr</td></tr>
              <tr><td>5810 Inv. shrinkage</td><td style={{textAlign:'right'}}>$71.00 Dr</td></tr>
            </tbody>
          </table>
          <div className="sk-small" style={{marginTop: 8}}>5 SKU records updated · audit trail attached</div>
          <button className="sk-btn solid" style={{width:'100%', marginTop:8}}>Post adjustment</button>
        </div>
      )}
      <NavBtns step={step} setStep={setStep} stepCount={stepCount} primary={step===3?'Post':'Continue'}/>
    </>
  );
}

window.DirectionB2 = DirectionB2;
