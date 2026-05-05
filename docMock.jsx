/* docMock.jsx — A reusable invoice-document mock w/ link regions */

// A scanned-looking vendor invoice. Each highlighted region shares an `id`
// with a Field on the left, so hovering either side activates both.
function InvoiceDoc({ scale = 1, narrow }) {
  return (
    <div className="sk-page" style={{
      width: '100%', height: '100%', position: 'relative',
      padding: `${28*scale}px ${32*scale}px`,
      fontFamily: 'var(--font-mono)',
      fontSize: 11 * scale,
      color: 'var(--ink-2)',
    }}>
      {/* Header band */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 18*scale, position:'relative'}}>
        <div>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 22*scale, fontWeight: 700, color:'var(--ink)', position:'relative'}}>
            Pinewood Mfg. Co.
            <DocMark id="vendor" top={3*scale} left={-4*scale} width={170*scale} height={28*scale} conf="good"/>
          </div>
          <div style={{marginTop: 3*scale, lineHeight: 1.45}}>
            221 Cedar St · Milwaukee WI 53202<br/>
            <span style={{position:'relative', display:'inline-block'}}>
              billing@pinewood.co · (414) 555-0142
            </span>
          </div>
        </div>
        <div style={{textAlign:'right', position:'relative'}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 26*scale, fontWeight: 700, color:'var(--ink)'}}>INVOICE</div>
          <div style={{position:'relative', marginTop: 6*scale}}>
            INV # <strong>PW-2026-04183</strong>
            <DocMark id="invoice_no" top={-2*scale} left={36*scale} width={92*scale} height={16*scale} conf="good"/>
          </div>
          <div style={{position:'relative', marginTop: 2*scale}}>
            Date: Apr 22, 2026
            <DocMark id="invoice_date" top={-2*scale} left={32*scale} width={82*scale} height={16*scale} conf="good"/>
          </div>
          <div style={{position:'relative', marginTop: 2*scale}}>
            Due: May 22, 2026
            <DocMark id="due_date" top={-2*scale} left={28*scale} width={86*scale} height={16*scale} conf="warn"/>
          </div>
          <div style={{position:'relative', marginTop: 2*scale}}>
            PO # <span style={{textDecoration:'underline', textDecorationStyle:'wavy', textDecorationColor:'var(--conf-warn)'}}>PO-44217</span>
            <DocMark id="po_no" top={-2*scale} left={32*scale} width={68*scale} height={16*scale} conf="warn"/>
          </div>
        </div>
      </div>

      {/* Bill-to */}
      <div style={{marginBottom: 14*scale, position:'relative'}}>
        <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 13*scale, color:'var(--pencil)'}}>BILL TO</div>
        <div style={{position:'relative', display:'inline-block'}}>
          Acme Trading Co. · 88 Industrial Pkwy · Cleveland OH 44115
          <DocMark id="bill_to" top={-2*scale} left={-4*scale} width={290*scale} height={16*scale} conf="good"/>
        </div>
      </div>

      {/* Line items table */}
      <div style={{border:'1px solid var(--ink-3)', marginBottom: 14*scale}}>
        <div style={{display:'grid', gridTemplateColumns: narrow ? '1.6fr 0.5fr 0.7fr 0.8fr' : '2fr 0.5fr 0.8fr 0.9fr', background:'var(--paper-warm)', padding: `${4*scale}px ${8*scale}px`, fontFamily:'var(--font-hand)', fontSize: 11*scale, borderBottom:'1px solid var(--ink-3)', fontWeight: 700}}>
          <span>Item / Description</span><span>Qty</span><span>Unit</span><span style={{textAlign:'right'}}>Total</span>
        </div>
        {[
          {id:'line_1', desc:'M8 Stainless Hex Bolt — 50mm', sku:'SKU PWB-850', qty:'2,400', unit:'$0.42', total:'$1,008.00', conf:'good'},
          {id:'line_2', desc:'Galvanized Washer — 8mm', sku:'SKU PWW-08G', qty:'2,400', unit:'$0.08', total:'$192.00', conf:'good'},
          {id:'line_3', desc:'Threadlock Compound — 10ml tube', sku:'SKU PWT-10', qty:'48', unit:'$3.85', total:'$184.80', conf:'warn'},
          {id:'line_4', desc:'Freight & handling', sku:'', qty:'1', unit:'$92.00', total:'$92.00', conf:'good'},
        ].map((l, i) => (
          <div key={l.id} style={{
            display:'grid', gridTemplateColumns: narrow ? '1.6fr 0.5fr 0.7fr 0.8fr' : '2fr 0.5fr 0.8fr 0.9fr',
            padding: `${5*scale}px ${8*scale}px`, position:'relative',
            borderBottom: i < 3 ? '1px dashed var(--pencil-light)' : 'none',
          }}>
            <div>
              <div>{l.desc}</div>
              {l.sku && <div style={{fontSize: 9*scale, color:'var(--pencil)'}}>{l.sku}</div>}
            </div>
            <div>{l.qty}</div>
            <div>{l.unit}</div>
            <div style={{textAlign:'right'}}>{l.total}</div>
            <DocMark id={l.id} top={2*scale} left={2*scale} width="98%" height={l.sku ? 28*scale : 18*scale} conf={l.conf}/>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <div style={{minWidth: narrow ? 160 : 220, fontFamily:'var(--font-mono)'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <span>Subtotal</span><span>$1,476.80</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', position:'relative'}}>
            <span>Tax (5.5%)</span><span>$81.22</span>
            <DocMark id="tax" top={-2*scale} left="60%" width="40%" height={14*scale} conf="good"/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', borderTop:'1.5px solid var(--ink)', paddingTop: 3*scale, marginTop: 3*scale, fontWeight: 700, position:'relative'}}>
            <span>TOTAL DUE</span><span>$1,558.02</span>
            <DocMark id="total" top={3*scale} left={-4*scale} width="105%" height={18*scale} conf="good"/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop: 6*scale, position:'relative'}}>
            <span>Terms</span><span>NET 30</span>
            <DocMark id="terms" top={-2*scale} left="55%" width="48%" height={14*scale} conf="good"/>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div style={{position:'absolute', bottom: 18*scale, left: 32*scale, right: 32*scale, fontSize: 10*scale, color: 'var(--pencil)', borderTop:'1px dashed var(--pencil-light)', paddingTop: 6*scale}}>
        Remit to: Pinewood Mfg. Co. · ACH 071000013 / Acct ••5544 · Late fee 1.5%/mo after due date
      </div>
    </div>
  );
}

// Bank statement variant (used in inbox / inventory contexts)
function BankStmtDoc({ scale = 1 }) {
  return (
    <div className="sk-page" style={{width:'100%', height:'100%', padding: 24*scale, fontFamily:'var(--font-mono)', fontSize: 10*scale}}>
      <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 20*scale, fontWeight:700}}>HUNTINGTON BANK</div>
      <div className="sk-small">Statement · April 2026 · Acct ••8842</div>
      <div style={{marginTop: 12*scale}}>
        {Array.from({length: 11}).map((_,i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'0.6fr 1.6fr 0.6fr 0.6fr', borderBottom:'1px dashed var(--pencil-light)', padding:`${3*scale}px 0`}}>
            <span>04/{(i+2).toString().padStart(2,'0')}</span>
            <span>{['ACH PINEWOOD','WIRE OUT','POS — STAPLES','DEPOSIT','PAYROLL','CHECK 4421','ACH MASTERCARD','REFUND','ACH UTILITY','XFER SAVINGS','ACH FEDEX'][i]}</span>
            <span style={{textAlign:'right'}}>{i % 3 === 0 ? '+' : '-'}${(Math.random()*4000).toFixed(2)}</span>
            <span style={{textAlign:'right'}}>${(20000 - i*1700).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Customer PO from Riverbend
function CustomerPODoc({ scale = 1 }) {
  const lines = [
    {id:'so_l1', sku:'PWB-850', desc:'Bolt, M8 × 40 zinc', qty:1200, price:'0.85', amt:'1,020.00'},
    {id:'so_l2', sku:'PWW-08G', desc:'Washer, M8 galv',     qty:1200, price:'0.18', amt:'216.00'},
    {id:'so_l3', sku:'CBL-100', desc:'Cable assy 100ft',    qty:24,   price:'285.00', amt:'6,840.00'},
    {id:'so_l4', sku:'NWS-2X4', desc:'Beam blank 2×4 oak',  qty:12,   price:'28.50', amt:'342.00'},
  ];
  return (
    <div className="sk-page" style={{width:'100%', height:'100%', padding: 28*scale, fontFamily:'var(--font-mono)', fontSize: 11*scale, lineHeight: 1.5, position:'relative'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 24*scale, fontWeight:700}}>Riverbend Co.</div>
          <div className="sk-small">812 Mill Ave · Akron OH</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 22*scale, fontWeight:700}}>PURCHASE ORDER</div>
          <div className="link-target" data-link="cust_po">PO# <strong>RB-9981</strong></div>
          <div className="link-target" data-link="po_date">Date: Apr 22, 2026</div>
          <div className="link-target" data-link="need_by" style={{color:'var(--conf-warn)'}}>Need by: <strong>May 6, 2026</strong></div>
        </div>
      </div>
      <div style={{marginTop: 14*scale, display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10*scale}}>
        <div className="link-target" data-link="cust" style={{padding: 8*scale, border:'1.25px solid var(--pencil-light)'}}>
          <div className="sk-small">Bill to</div>
          <strong>Riverbend Co.</strong><br/>AP · ap@riverbend.co
        </div>
        <div className="link-target" data-link="ship_to" style={{padding: 8*scale, border:'1.25px solid var(--pencil-light)'}}>
          <div className="sk-small">Ship to</div>
          <strong>Riverbend dock-2</strong><br/>820 Mill Ave
        </div>
      </div>
      <div className="link-target" data-link="contact" style={{marginTop: 8*scale}}>Buyer: <strong>Joan Tyler</strong> · 330-555-0142</div>
      <table style={{width:'100%', marginTop: 14*scale, borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'1.5px solid var(--ink)'}}>
            <th style={{textAlign:'left'}}>SKU</th><th style={{textAlign:'left'}}>Description</th><th>Qty</th><th>Unit</th><th style={{textAlign:'right'}}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lines.map(l => (
            <tr key={l.id} className="link-target" data-link={l.id} style={{borderBottom:'1px dashed var(--pencil-light)'}}>
              <td><strong>{l.sku}</strong></td><td>{l.desc}</td><td style={{textAlign:'center'}}>{l.qty}</td><td style={{textAlign:'right'}}>{l.price}</td><td style={{textAlign:'right'}}>{l.amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop: 14*scale, display:'flex', justifyContent:'space-between'}}>
        <div className="link-target" data-link="so_terms"><strong>Terms:</strong> NET 60</div>
        <div className="link-target" data-link="so_total" style={{fontFamily:'var(--font-hand-loose)', fontSize:18*scale, fontWeight:700}}>TOTAL  $8,418.00</div>
      </div>
    </div>
  );
}

// Inventory cycle-count sheet
function CountSheetDoc({ scale = 1 }) {
  const rows = [
    {id:'cnt_1', sku:'PWB-850', desc:'Bolt M8×40',    sys:4820, cnt:4820, ok:true},
    {id:'cnt_2', sku:'PWW-08G', desc:'Washer M8',     sys:6100, cnt:6100, ok:true},
    {id:'cnt_3', sku:'PWT-10',  desc:'Threadlock',    sys:96,   cnt:88,   tone:'bad'},
    {id:'cnt_4', sku:'NWS-2X4', desc:'Beam 2×4 oak',  sys:42,   cnt:40,   tone:'warn'},
    {id:'cnt_5', sku:'GLB-22',  desc:'Glue stick',    sys:8,    cnt:12,   tone:'warn'},
    {id:'cnt_6', sku:'CBL-100', desc:'Cable 100ft',   sys:14,   cnt:14,   ok:true},
    {id:'cnt_7', sku:'PWP-50',  desc:'Pin lock',      sys:240,  cnt:232,  tone:'warn'},
    {id:'cnt_8', sku:'GSK-04',  desc:'Gasket O-ring', sys:512,  cnt:498,  tone:'warn'},
  ];
  return (
    <div className="sk-page" style={{width:'100%', height:'100%', padding: 28*scale, fontFamily:'var(--font-mono)', fontSize: 11*scale, lineHeight: 1.5}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
        <div>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 22*scale, fontWeight:700}}>CYCLE COUNT</div>
          <div className="sk-small">Cleveland WH · zone A · sheet 3 / 8</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="link-target" data-link="count_date">Date: <strong>Apr 19, 2026</strong></div>
          <div className="link-target" data-link="counter">Counter: <strong>M. Reyes</strong></div>
          <div className="link-target" data-link="zone">Zone: <strong>A-3</strong></div>
        </div>
      </div>
      <table style={{width:'100%', marginTop: 14*scale, borderCollapse:'collapse'}}>
        <thead>
          <tr style={{borderBottom:'1.5px solid var(--ink)'}}>
            <th style={{textAlign:'left'}}>SKU</th><th style={{textAlign:'left'}}>Description</th><th>System</th><th>Counted</th><th>Δ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const delta = r.cnt - r.sys;
            const color = r.ok ? 'inherit' : (r.tone==='bad' ? 'var(--conf-bad)' : 'var(--conf-warn)');
            return (
              <tr key={r.id} className="link-target" data-link={r.id} style={{borderBottom:'1px dashed var(--pencil-light)', color}}>
                <td><strong>{r.sku}</strong></td>
                <td>{r.desc}</td>
                <td style={{textAlign:'center'}}>{r.sys}</td>
                <td style={{textAlign:'center', fontWeight:700}}>{r.cnt}</td>
                <td style={{textAlign:'center', fontWeight:700}}>{delta > 0 ? '+' : ''}{delta || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{marginTop: 16*scale, display:'flex', gap: 18*scale}}>
        <div>Counter sig: ___M.R.___</div>
        <div>Sup sig: _________</div>
        <div className="link-target" data-link="var_count" style={{marginLeft:'auto', color:'var(--conf-warn)'}}>5 variances</div>
      </div>
    </div>
  );
}

Object.assign(window, { InvoiceDoc, BankStmtDoc, CustomerPODoc, CountSheetDoc });
