/* docMocks2.jsx — Additional doc types: Customer PO, Inventory Count Sheet */

function CustomerPODoc({ scale = 1 }) {
  return (
    <div className="sk-page" style={{width:'100%', height:'100%', padding: 24*scale, fontFamily:'var(--font-mono)', fontSize: 11*scale, color:'var(--ink-2)', position:'relative'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom: 14*scale}}>
        <div style={{position:'relative'}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 22*scale, fontWeight:700, color:'var(--ink)'}}>RIVERBEND CO.</div>
          <DocMark id="cust" top={2*scale} left={-4*scale} width={170*scale} height={26*scale} conf="good"/>
          <div style={{lineHeight:1.5}}>
            440 Lake St · Cleveland OH<br/>
            buyer: <span style={{position:'relative'}}>Joan Tyler<DocMark id="contact" top={-2*scale} left={-2*scale} width={70*scale} height={14*scale} conf="good"/></span>
          </div>
        </div>
        <div style={{textAlign:'right', position:'relative'}}>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize: 24*scale, fontWeight:700}}>PURCHASE ORDER</div>
          <div style={{position:'relative'}}>PO# <strong>RB-9981</strong>
            <DocMark id="cust_po" top={-2*scale} left={28*scale} width={70*scale} height={14*scale} conf="good"/>
          </div>
          <div style={{position:'relative'}}>Date: Apr 22, 2026
            <DocMark id="po_date" top={-2*scale} left={28*scale} width={88*scale} height={14*scale} conf="good"/>
          </div>
          <div style={{position:'relative'}}>Need by: <strong>May 6</strong>
            <DocMark id="need_by" top={-2*scale} left={36*scale} width={66*scale} height={14*scale} conf="warn"/>
          </div>
          <div style={{position:'relative'}}>Ship to: dock-2
            <DocMark id="ship_to" top={-2*scale} left={36*scale} width={62*scale} height={14*scale} conf="good"/>
          </div>
        </div>
      </div>

      <div style={{border:'1px solid var(--ink-3)', marginBottom: 14*scale}}>
        <div style={{display:'grid', gridTemplateColumns:'1.6fr .5fr .7fr .8fr', background:'var(--paper-warm)', padding:`${4*scale}px ${8*scale}px`, fontFamily:'var(--font-hand)', fontSize: 11*scale, borderBottom:'1px solid var(--ink-3)', fontWeight:700}}>
          <span>SKU / Description</span><span>Qty</span><span>Unit</span><span style={{textAlign:'right'}}>Total</span>
        </div>
        {[
          {id:'so_l1', d:'PWB-850 — M8 Hex Bolt 50mm', q:'1,200', u:'$0.85', t:'$1,020.00', conf:'good'},
          {id:'so_l2', d:'PWW-08G — Galvanized Washer', q:'1,200', u:'$0.18', t:'$216.00', conf:'good'},
          {id:'so_l3', d:'CBL-100 — Copper Cable 100m', q:'24', u:'$285.00', t:'$6,840.00', conf:'warn'},
          {id:'so_l4', d:'NWS-2X4 — Steel Beam 2"×4"', q:'12', u:'$28.50', t:'$342.00', conf:'good'},
        ].map((l,i)=>(
          <div key={l.id} style={{display:'grid', gridTemplateColumns:'1.6fr .5fr .7fr .8fr', padding:`${5*scale}px ${8*scale}px`, position:'relative', borderBottom: i<3?'1px dashed var(--pencil-light)':'none'}}>
            <div>{l.d}</div><div>{l.q}</div><div>{l.u}</div><div style={{textAlign:'right'}}>{l.t}</div>
            <DocMark id={l.id} top={2*scale} left={2*scale} width="98%" height={18*scale} conf={l.conf}/>
          </div>
        ))}
      </div>

      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <div style={{minWidth: 200, fontFamily:'var(--font-mono)', position:'relative'}}>
          <div style={{display:'flex', justifyContent:'space-between'}}><span>Subtotal</span><span>$8,418.00</span></div>
          <div style={{display:'flex', justifyContent:'space-between', borderTop:'1.5px solid var(--ink)', paddingTop:3*scale, marginTop:3*scale, fontWeight:700, position:'relative'}}>
            <span>TOTAL</span><span>$8,418.00</span>
            <DocMark id="so_total" top={2*scale} left={-4*scale} width="105%" height={16*scale} conf="good"/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:6*scale, position:'relative'}}>
            <span>Terms</span><span>NET 60</span>
            <DocMark id="so_terms" top={-2*scale} left="55%" width="48%" height={14*scale} conf="warn"/>
          </div>
        </div>
      </div>
      <div style={{position:'absolute', bottom:18*scale, left:24*scale, right:24*scale, fontSize:10*scale, color:'var(--pencil)', borderTop:'1px dashed var(--pencil-light)', paddingTop:6*scale}}>
        Authorized: J. Tyler · Procurement · signed Apr 22, 2026
      </div>
    </div>
  );
}

function CountSheetDoc({ scale = 1 }) {
  const rows = [
    {id:'cnt_1', sku:'PWB-850', sys:4820, cnt:'4,818', conf:'good'},
    {id:'cnt_2', sku:'PWW-08G', sys:6100, cnt:'6,100', conf:'good'},
    {id:'cnt_3', sku:'PWT-10', sys:96, cnt:'88', conf:'bad'},
    {id:'cnt_4', sku:'NWS-2X4', sys:42, cnt:'40', conf:'warn'},
    {id:'cnt_5', sku:'GLB-22', sys:8, cnt:'12', conf:'warn'},
    {id:'cnt_6', sku:'CBL-100', sys:14, cnt:'14', conf:'good'},
    {id:'cnt_7', sku:'PWP-50', sys:240, cnt:'232', conf:'warn'},
    {id:'cnt_8', sku:'GSK-04', sys:512, cnt:'498', conf:'warn'},
  ];
  return (
    <div className="sk-page" style={{width:'100%', height:'100%', padding:24*scale, fontFamily:'var(--font-mono)', fontSize:11*scale, position:'relative'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:8*scale}}>
        <div>
          <div style={{fontFamily:'var(--font-hand-loose)', fontSize:22*scale, fontWeight:700}}>CYCLE COUNT — Q2 / Cleveland WH</div>
          <div className="sk-small">Counter: M. Reyes · zone A · sheet 3 of 8</div>
        </div>
        <div style={{textAlign:'right', position:'relative'}}>
          Date: Apr 19, 2026
          <DocMark id="count_date" top={-2*scale} left={-30*scale} width={160*scale} height={16*scale} conf="good"/>
        </div>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--font-mono)', fontSize: 11*scale}}>
        <thead><tr style={{background:'var(--paper-warm)', borderBottom:'1.5px solid var(--ink-3)'}}>
          <th style={{textAlign:'left', padding:`${5*scale}px ${8*scale}px`}}>SKU</th>
          <th style={{padding:`${5*scale}px ${8*scale}px`}}>System qty</th>
          <th style={{padding:`${5*scale}px ${8*scale}px`}}>Counted</th>
          <th style={{padding:`${5*scale}px ${8*scale}px`}}>Δ</th>
          <th style={{padding:`${5*scale}px ${8*scale}px`}}>Initials</th>
        </tr></thead>
        <tbody>
          {rows.map(r => {
            const cnt = parseInt(r.cnt.replace(/,/g,''));
            const diff = cnt - r.sys;
            return (
              <tr key={r.id} style={{borderBottom:'1px dashed var(--pencil-light)', position:'relative'}}>
                <td style={{padding:`${4*scale}px ${8*scale}px`}}>{r.sku}</td>
                <td style={{padding:`${4*scale}px ${8*scale}px`, textAlign:'center'}}>{r.sys}</td>
                <td style={{padding:`${4*scale}px ${8*scale}px`, textAlign:'center', fontWeight:700, position:'relative'}}>
                  <span style={{fontFamily:'var(--font-hand-loose)', fontSize:14*scale}}>{r.cnt}</span>
                  <DocMark id={r.id} top={2*scale} left={2*scale} width="96%" height={20*scale} conf={r.conf}/>
                </td>
                <td style={{padding:`${4*scale}px ${8*scale}px`, textAlign:'center', color: diff===0?'var(--pencil)':diff<0?'var(--conf-bad)':'var(--conf-warn)'}}>
                  {diff===0?'—':diff>0?`+${diff}`:diff}
                </td>
                <td style={{padding:`${4*scale}px ${8*scale}px`, textAlign:'center', fontFamily:'var(--font-hand-loose)', fontSize:13*scale}}>MR</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{position:'absolute', bottom:18*scale, left:24*scale, right:24*scale, fontSize:10*scale, color:'var(--pencil)', borderTop:'1px dashed var(--pencil-light)', paddingTop:6*scale}}>
        Sheet signed by counter & supervisor · scanned Apr 19, 16:42
      </div>
    </div>
  );
}

Object.assign(window, { CustomerPODoc, CountSheetDoc });
