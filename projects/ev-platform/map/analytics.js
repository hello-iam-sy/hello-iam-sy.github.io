/* All report panels derive from the same fetched Gold snapshot and filter state. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt = (value, digits = 0) => value == null ? '—' : Number(value).toLocaleString('en-AU', {maximumFractionDigits: digits});
  const price = value => value == null ? '—' : '$' + Number(value).toFixed(2);
  const {filter, summarize} = window.EVAnalytics;
  // A host page can restyle the report through CSS variables and point it at a static
  // snapshot (the portfolio); without them it reads the live endpoint with these colours.
  const cssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const ramp = [0, 1, 2, 3, 4].map(i => cssVar('--ramp-' + i, ''));
  const palette = ramp.every(Boolean) ? ramp : ['#e0edf7', '#a6cce5', '#659fc7', '#2c6d9e', '#123e66'];
  const ink = {dc:cssVar('--dc', '#2872a3'), ac:cssVar('--ac', '#ce8b32'), unknown:cssVar('--map-unknown', '#7e8982'),
    zero:cssVar('--map-zero', '#fff'), noData:cssVar('--map-nodata', '#d8dcda'), quiet:cssVar('--map-quiet', '#e4edf2'),
    edge:cssVar('--map-edge', '#fff'), selected:cssVar('--map-selected', '#123e66')};
  const DATA_URL = document.documentElement.dataset.mapData || '/map/data';
  let data, map, regionsLayer, pointsLayer, page = 0, selectedCharger = null, snapshotRows = [];
  const regionLayers = new Map();
  function filters() { return {operator:$('operator').value, current:$('current').value, status:$('status').value, region:$('region').value}; }
  function error(message) { $('error').textContent = message; $('error').hidden = !message; }
  function initMap() {
    if (typeof L === 'undefined') { error('The map library could not load. Refresh the page.'); return; }
    map = L.map('map', {scrollWheelZoom:false, zoomAnimation:false}).setView([-32.8, 147.3], 6);
    map.createPane('regions').style.zIndex = 350;
    L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${cssVar('--map-tiles', 'Light')}_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
      maxZoom:16, attribution:'Tiles © Esri, HERE, Garmin · © OpenStreetMap contributors'
    }).on('tileerror', () => { $('tiles-note').hidden = false; }).addTo(map);
  }
  function optionList(id, values, all) {
    const old = $(id).value;
    $(id).replaceChildren(new Option(all, ''));
    values.forEach(([value,label]) => $(id).add(new Option(label, value)));
    if (values.some(([value]) => value === old)) $(id).value = old;
  }
  async function load() {
    $('refresh').disabled = true;
    error('');
    try {
      const response = await fetch(DATA_URL, {cache:'no-store'});
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Unable to load analytical data.');
      data = payload;
      const hasUnknownType = data.chargers.some(r => !['AC', 'DC'].includes(r.current_type));
      optionList('current', [['AC','AC'], ['DC','DC'], ...(hasUnknownType ? [['unknown','Unknown']] : [])], hasUnknownType ? 'All current types' : 'AC + DC');
      $('unknown-legend').hidden = !hasUnknownType;
      optionList('operator', [...new Set(data.chargers.map(r => r.operator_name))].sort().map(n => [n,n]), 'All operators');
      optionList('region', data.regions.features.map(f => [f.properties.sa4_code, f.properties.sa4_name]), 'All NSW SA4 regions');
      if (regionsLayer) map.removeLayer(regionsLayer);
      regionLayers.clear();
      if (map) {
        regionsLayer = L.geoJSON(data.regions, {pane:'regions', style:{weight:1, color:ink.edge, fillOpacity:0.7}, onEachFeature:(feature, layer) => {
          const code = feature.properties.sa4_code;
          regionLayers.set(code, layer);
          layer.on('click', () => selectRegion(code));
        }}).addTo(map);
        if (regionsLayer.getBounds().isValid()) map.fitBounds(regionsLayer.getBounds(), {padding:[18,18], animate:false});
      }
      page = 0; selectedCharger = null;
      render();
      const date = value => value ? new Date(value).toLocaleString('en-AU', {timeZone:'Australia/Sydney'}) + ' Sydney time' : 'not recorded';
      $('freshness').textContent = `Gold last built: ${date(data.gold_built_at)}. Report loaded: ${date(data.queried_at)}. ${data.excluded_rows} entries outside mapped NSW SA4 regions are excluded. Refresh data to load subsequent Gold updates.`;
      $('download').disabled = false;
    } catch (e) {
      error((data ? 'Refresh failed; the report below still shows the previous snapshot. ' : '') + e.message);
      if (!data) $('scope').textContent = 'Data unavailable';
    } finally { $('refresh').disabled = false; }
  }
  function selectRegion(code) {
    $('region').value = code; selectedCharger = null; page = 0; render();
    if (map) map.stop();
    const layer = regionLayers.get(code);
    if (layer) map.fitBounds(layer.getBounds(), {padding:[25,25], maxZoom:11, animate:false});
    else if (map && regionsLayer) map.fitBounds(regionsLayer.getBounds(), {padding:[18,18], animate:false});
  }
  function selectOperator(name) { $('operator').value = name; selectedCharger = null; page = 0; render(); }
  function selectType(current, operator) {
    $('current').value = current;
    if (operator !== undefined) $('operator').value = operator;
    selectedCharger = null; page = 0; render();
  }
  function scopeArea() {
    const features = data.regions.features.filter(f => !$('region').value || f.properties.sa4_code === $('region').value);
    return features.reduce((total,f) => total + (f.properties.area_sqkm || 0), 0);
  }
  function render() {
    if (!data) return;
    const f = filters(), base = filter(data.chargers, {...f, region:''});
    snapshotRows = filter(data.chargers, f);
    const summary = summarize(snapshotRows, scopeArea());
    document.querySelectorAll('[data-report-type]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.reportType === f.current));
      b.onclick = () => selectType(b.dataset.reportType);
    });
    const region = data.regions.features.find(r => r.properties.sa4_code === f.region);
    $('scope').innerHTML = `<button class="table-select" id="all-nsw">NSW</button>${region ? ' › <button class="table-select" id="scope-region">'+esc(region.properties.sa4_name)+'</button>' : ''}${f.operator ? ' › '+esc(f.operator) : ''}: ${fmt(summary.count)} ${esc(f.status || 'any status')} entries, ${esc(f.current || 'AC and DC')}`;
    $('all-nsw').onclick = () => { $('region').value=''; $('operator').value=''; selectRegion(''); };
    if ($('scope-region')) $('scope-region').onclick = () => selectOperator('');
    const kpis = [
      ['Charger entries',fmt(summary.count),`${fmt(summary.sites)} distinct sites`],
      [summary.unknown ? 'AC / DC / Unknown' : 'AC / DC',`${fmt(summary.ac)} / ${fmt(summary.dc)}${summary.unknown ? ' / '+fmt(summary.unknown) : ''}`,'Within the selected scope'],
      ['Entries / 1,000 km²',fmt(summary.density,2),'Area-based density'],
      ['Median charging price (AUD/kWh)',price(summary.price),`Base rate; ${fmt(summary.priced)} of ${fmt(summary.count)} prices known (${summary.count ? fmt(100*summary.priced/summary.count,1) : '0'}%)`],
      ['Median rated power',summary.power == null ? '—' : fmt(summary.power,1)+' kW',`${fmt(summary.powerKnown)} entries with a rated output`]
    ];
    $('kpis').innerHTML = kpis.map(([title,value,note]) => `<div class="kpi"><span>${title}</span><strong>${value}</strong><small>${note}</small></div>`).join('');
    const stats = new Map(data.regions.features.map(feature => {
      const p = feature.properties;
      return [p.sa4_code, {...p,...summarize(base.filter(r => r.sa4_code === p.sa4_code),p.area_sqkm)}];
    }));
    const metric = $('metric').value;
    const breaks = {count:[25,50,100,200], density:[1,10,100,1000], price:[0.25,0.5,0.75,1], power:[7,22,50,150]}[metric];
    const color = v => v == null ? ink.noData : metric==='count' && v===0 ? ink.zero : palette[breaks.filter(b=>v>=b).length];
    const showPoints = $('points').value==='on' || ($('points').value==='auto' && !!f.region);
    regionLayers.forEach((layer,code) => {
      const s = stats.get(code), selected = f.region === code;
      layer.setStyle({fillColor:showPoints ? ink.quiet : color(s[metric]), fillOpacity:showPoints ? (selected?0.25:0.08) : (f.region && !selected?0.25:0.9), weight:selected?3:1, color:selected?ink.selected:ink.edge});
      layer.bindTooltip(`<strong>${esc(s.sa4_name)}</strong><br>${fmt(s.count)} charger entries, ${fmt(s.sites)} sites<br>AC ${fmt(s.ac)}, DC ${fmt(s.dc)}<br>${fmt(s.density,2)} entries / 1,000 km²<br>Median base price ${price(s.price)} (${fmt(s.priced)} priced entries)<br>Click to explore this region`);
    });
    const metricValue = v => metric==='price' ? price(v) : fmt(v,metric==='count'?0:2)+(metric==='power'?' kW':'');
    const ranges = palette.map((_,i)=>i===0 ? '< '+metricValue(breaks[0]) : i===4 ? '≥ '+metricValue(breaks[3]) : '≥ '+metricValue(breaks[i-1])+' to < '+metricValue(breaks[i]));
    if(metric==='count') ranges.splice(0,5,'1–24','25–49','50–99','100–199','200+');
    $('legend').hidden = showPoints;
    $('legend').innerHTML = `<b>${esc($('metric').selectedOptions[0].text)}</b>` + ranges.map((label,i)=>`<span><i class="swatch" style="background:${palette[i]}"></i>${label}</span>`).join('') + `<span><i class="swatch" style="background:${metric==='count'?ink.zero:ink.noData}"></i>${metric==='count'?'0 entries':'No data'}</span>`;
    $('map-heading').textContent = showPoints ? 'Charger locations' : 'Regional overview';
    $('map-context').textContent = showPoints ? 'Select a point to inspect the charger and published tariff.' : 'Stronger colour means a higher value. Select a region to see its chargers.';
    $('point-key').hidden = !showPoints;
    if (pointsLayer) map.removeLayer(pointsLayer);
    if (map && showPoints) {
      const canvas = L.canvas(); pointsLayer = L.layerGroup().addTo(map);
      snapshotRows.forEach(r => {
        if (!Number.isFinite(r.latitude) || !Number.isFinite(r.longitude)) return;
        L.circleMarker([r.latitude,r.longitude],{renderer:canvas,radius:6,weight:1.5,color:ink.edge,fillColor:r.current_type==='DC'?ink.dc:r.current_type==='AC'?ink.ac:ink.unknown,fillOpacity:0.9})
          .bindTooltip(esc(r.station_name || r.address)).on('click',()=>showCharger(r)).addTo(pointsLayer);
      });
    }
    $('region-rows').innerHTML = [...stats.values()].sort((a,b)=>(b[metric]??-1)-(a[metric]??-1)).map(s => `<tr class="${f.region===s.sa4_code?'active-row':''}"><td><button class="table-select" data-region="${esc(s.sa4_code)}">${esc(s.sa4_name)}</button></td><td class="num">${fmt(s.count)}</td><td class="num">${fmt(s.density,2)}</td><td class="num" title="${s.priced} known prices">${price(s.price)}<br><small class="muted">n=${s.priced}</small></td><td class="num">${fmt(s.power,1)}</td></tr>`).join('');
    const operators = [...new Set(snapshotRows.map(r=>r.operator_name))].map(name=>({name,...summarize(snapshotRows.filter(r=>r.operator_name===name))})).sort((a,b)=>b.count-a.count);
    const typeCount = (s, type) => `<td class="num"><button class="table-select type-count" data-type-operator="${esc(s.name)}" data-current-type="${type}" aria-label="Show ${esc(s.name)} ${type} chargers" aria-pressed="${f.operator===s.name && f.current===type}" ${s[type.toLowerCase()]===0?'disabled':''}>${fmt(s[type.toLowerCase()])}</button></td>`;
    $('operator-rows').innerHTML = operators.map(s=>`<tr><td><button class="table-select" data-operator="${esc(s.name)}">${esc(s.name)}</button></td><td class="num bar-cell">${fmt(s.count)}<div class="bar-track"><div class="bar-fill" style="width:${100*s.count/(summary.count||1)}%"></div></div></td>${typeCount(s,'AC')}${typeCount(s,'DC')}<td class="num" title="${fmt(s.priced)} numeric prices out of ${fmt(s.count)} charger entries">${fmt(s.priced)} / ${fmt(s.count)}</td><td class="num">${price(s.price)}</td><td class="num">${fmt(s.power,1)}</td></tr>`).join('') || '<tr><td colspan="7">No entries match these filters.</td></tr>';
    document.querySelectorAll('[data-region]').forEach(b=>b.onclick=()=>selectRegion(b.dataset.region));
    document.querySelectorAll('[data-operator]').forEach(b=>b.onclick=()=>selectOperator(b.dataset.operator));
    document.querySelectorAll('[data-type-operator]').forEach(b=>b.onclick=()=>selectType(b.dataset.currentType,b.dataset.typeOperator));
    renderRecords();
    if (!selectedCharger || !snapshotRows.some(r=>r.charger_id===selectedCharger.charger_id)) {
      selectedCharger = null;
      $('detail').innerHTML = `<h2>${region?'Selected region':'Selected scope'}</h2><h3>${esc(region?.properties.sa4_name || 'All NSW regions')}</h3><p>${esc(f.operator || 'All operators')}</p>` + details([
        ['Charger entries',fmt(summary.count)],['Distinct sites',fmt(summary.sites)],['Operators',fmt(summary.operators)],[summary.unknown ? 'AC / DC / Unknown' : 'AC / DC',`${summary.ac} / ${summary.dc}${summary.unknown ? ' / '+summary.unknown : ''}`],['Area',fmt(scopeArea(),1)+' km²'],['Entries / 1,000 km²',fmt(summary.density,2)],['Known prices',`${summary.priced} / ${summary.count}`],['Median charging price (AUD/kWh)',price(summary.price)],['Median rated power',summary.power==null?'—':fmt(summary.power,1)+' kW']]) + '<p>Choose an operator below, then select a charger entry to view its address and tariff.</p>' + (region?'<button id="clear-region">Clear region selection</button>':'');
      if (!region) {
        const ranked = [...stats.values()].filter(s=>Number.isFinite(s[metric])).sort((a,b)=>b[metric]-a[metric]).slice(0,6);
        const top = ranked[0]?.[metric] || 1;
        $('detail').innerHTML = `<h2>Top regions</h2><h3>${esc($('metric').selectedOptions[0].text)}</h3><p>${f.operator?esc(f.operator)+'. ':''}Select a region to drill down.</p><div class="region-ranking">` + ranked.map((s,i)=>`<button class="rank-region" data-ranked-region="${esc(s.sa4_code)}"><span class="rank-name">${i+1}. ${esc(s.sa4_name)}</span><strong>${metricValue(s[metric])}</strong><span class="rank-track"><span style="width:${100*s[metric]/top}%"></span></span></button>`).join('') + '</div><p class="muted">Compare exact values here; map area reflects geography, not charger numbers.</p>';
        document.querySelectorAll('[data-ranked-region]').forEach(b=>b.onclick=()=>selectRegion(b.dataset.rankedRegion));
      }
      if ($('clear-region')) $('clear-region').onclick=()=>selectRegion('');
    } else showCharger(selectedCharger,false);
    const params = new URLSearchParams(); Object.entries(f).forEach(([k,v])=>{if(v)params.set(k,v);});
    params.set('status', f.status); params.set('metric',metric);
    history.replaceState(null,'',location.pathname+'?'+params+location.hash);
  }
  function details(items) { return '<dl>'+items.map(([key,value])=>`<dt>${esc(key)}</dt><dd>${esc(value)}</dd>`).join('')+'</dl>'; }
  function showCharger(r,pan=true) {
    selectedCharger = r;
    $('detail').innerHTML = `<h2>Charger #${esc(r.charger_id)}</h2><h3>${esc(r.station_name || r.address || 'Charger #'+r.charger_id)}</h3><p>${esc(r.station_name ? r.address : 'Station name not provided in source')}</p>`+details([
      ['Region',r.sa4_name],['Operator',r.operator_name],['Status',r.status],['Type',r.current_type||'Unknown'],['Rated output',r.max_power_kw==null?'Unknown':fmt(r.max_power_kw,1)+' kW'],['Plugs',r.number_of_plugs==null?'Unknown':fmt(r.number_of_plugs)],['Base tariff',r.price_per_kwh==null?'Unknown':price(r.price_per_kwh)+'/kWh'],['Price source',r.enrichment_source||'Not matched'],['Peak surcharge',r.peak_surcharge_per_kwh==null?'Not supplied':price(r.peak_surcharge_per_kwh)+'/kWh'],['Peak window',r.peak_start?`${r.peak_start}–${r.peak_end}`:'Not supplied']])+`<h2>Published tariff</h2><p>${esc(r.usage_cost || 'No published tariff available in the current Gold data.')}</p><button id="back-region">Back to scope summary</button>`;
    $('back-region').onclick=()=>{selectedCharger=null;render();};
    if(pan && map && Number.isFinite(r.latitude) && Number.isFinite(r.longitude)) map.setView([r.latitude,r.longitude],Math.max(map.getZoom(),12),{animate:false});
  }
  function recordRows() {
    const search=$('search').value.toLowerCase().trim();
    return snapshotRows.filter(r=>!search || [r.charger_id,r.station_name,r.address].join(' ').toLowerCase().includes(search));
  }
  function renderRecords() {
    const rows=recordRows(),size=20;page=Math.min(page,Math.max(0,Math.ceil(rows.length/size)-1));
    $('record-count').textContent=`${fmt(rows.length)} entries, page ${page+1} of ${Math.max(1,Math.ceil(rows.length/size))}`;
    $('previous').disabled=page===0;$('next').disabled=(page+1)*size>=rows.length;
    $('charger-rows').innerHTML=rows.slice(page*size,(page+1)*size).map(r=>`<tr><td><button class="table-select" data-charger="${r.charger_id}">${esc(r.station_name || r.address)}</button><br><small class="muted">#${r.charger_id}, ${esc(r.station_name?r.address:'Name not supplied')}</small></td><td>${esc(r.operator_name)}</td><td>${esc(r.sa4_name)}</td><td>${esc(r.current_type||'Unknown')}</td><td class="num">${fmt(r.max_power_kw,1)}</td><td class="num">${price(r.price_per_kwh)}</td><td>${esc(r.enrichment_source||'—')}</td></tr>`).join('') || '<tr><td colspan="7">No charger entries match these filters.</td></tr>';
    document.querySelectorAll('[data-charger]').forEach(b=>b.onclick=()=>{showCharger(snapshotRows.find(r=>String(r.charger_id)===b.dataset.charger));$('detail').scrollIntoView({behavior:'smooth',block:'center'});});
  }
  ['operator','current','status','region','metric','points'].forEach(id=>$(id).onchange=()=>{selectedCharger=null;page=0;id==='region'?selectRegion($(id).value):render();});
  $('reset').onclick=()=>{['operator','current','region','search'].forEach(id=>$(id).value='');$('status').value='operational';$('metric').value='count';$('points').value='auto';selectRegion('');};
  $('search').oninput=()=>{page=0;renderRecords();};$('previous').onclick=()=>{page--;renderRecords();};$('next').onclick=()=>{page++;renderRecords();};
  $('refresh').onclick=load;
  $('download').onclick=()=>{
    const fields=['charger_id','station_name','operator_name','sa4_name','current_type','status','address','max_power_kw','price_per_kwh','enrichment_source','usage_cost'];
    const cell=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    const csv=[fields,...recordRows().map(r=>fields.map(k=>r[k]))].map(row=>row.map(cell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='nsw-ev-filtered-report.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  initMap();
  const params=new URLSearchParams(location.search);
  ['current','status','metric'].forEach(key=>{if(params.has(key) && [...$(key).options].some(o=>o.value===params.get(key)))$(key).value=params.get(key);});
  // Preserve shared filter links once asynchronous option lists have loaded.
  load().then(()=>{if(!data)return;['region','operator','current'].forEach(key=>{if(params.has(key) && [...$(key).options].some(o=>o.value===params.get(key)))$(key).value=params.get(key);});selectRegion($('region').value);});
})();
