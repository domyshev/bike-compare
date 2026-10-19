import {bikes,features,presets,checkedOn} from './data.mjs';
import {gears,limits,format} from './engine.mjs';
const $=id=>document.getElementById(id);
const defaults={gear:bikes.map(b=>b.id),compare:bikes.map(b=>b.id),features:presets.essentials,zoom:1,differences:false,preset:'essentials'};
let saved={};try{saved=JSON.parse(localStorage.getItem('cadence-v1')||'{}')||{};}catch{}
const validIds=bikes.map(b=>b.id),validFeatures=features.map(f=>f.id);
const state={...defaults,...saved};
for(const key of ['gear','compare'])state[key]=Array.isArray(state[key])?state[key].filter(id=>validIds.includes(id)):defaults[key];
state.features=Array.isArray(state.features)?state.features.filter(id=>validFeatures.includes(id)):defaults.features;
state.zoom=Math.min(4,Math.max(.05,Number(state.zoom)||1));
if(!Object.keys(presets).includes(state.preset)&&state.preset!=='custom')state.preset='essentials';
function persist(){try{localStorage.setItem('cadence-v1',JSON.stringify(state));}catch{}}
function bikeArt(b){return `<svg viewBox="0 0 360 165" role="img" aria-label="Illustrative bicycle silhouette, not a product photograph"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><g stroke="#313b34" stroke-width="3"><circle cx="85" cy="112" r="44"/><circle cx="280" cy="112" r="44"/></g><g stroke="#d5dbd0" stroke-width="1"><path d="M41 112h88M85 68v88M236 112h88M280 68v88"/></g><g stroke="${b.color}" stroke-width="6"><path d="M85 112l52-78 37 78H85l116-68-27 68M137 34l64 10 79 68M201 44l-8-19"/></g><g stroke="#414b42" stroke-width="4"><path d="M124 29h29M193 25h25q16 0 12 14h-11M174 112l19 11M187 124h13"/><circle cx="174" cy="112" r="13" stroke-width="2"/></g></g></svg>`;}
$('bike-cards').innerHTML=bikes.map((b,i)=>`<article class="bike-card" style="--bike-color:${b.color}"><div class="card-top"><span class="category">${b.category}</span><span class="model-number">0${i+1}</span></div><div class="bike-art">${bikeArt(b)}</div><div class="bike-copy"><h3 class="model-name"><span class="model-dot"></span>${b.name}</h3><p class="card-description">${b.description}</p><div class="card-bottom"><span class="price">${format(b,features[0])}</span><span class="card-meta">${b.weight} kg · ${b.frame}<br>${b.front.length}×${b.rear.length} · ${b.tyreWidth} mm tyres</span></div><a class="card-link" href="${b.url}" target="_blank" rel="noopener">View Canyon specification ↗</a></div></article>`).join('');
function modelOptions(target,key){
 $(target).innerHTML=bikes.map(b=>`<label class="model-option" style="--bike-color:${b.color}"><input type="checkbox" value="${b.id}" ${state[key].includes(b.id)?'checked':''}><span class="model-dot"></span>${b.name}</label>`).join('');
 $(target).addEventListener('change',event=>{const id=event.target.value;if(event.target.checked)state[key]=[...state[key],id];else state[key]=state[key].filter(x=>x!==id);persist();key==='gear'?renderGears():renderTable();});
}
modelOptions('gear-models','gear');modelOptions('compare-models','compare');
let chartWidth=2400,drag=null;
const allGears=bikes.flatMap(b=>gears(b).map(g=>({...g,bike:b})));
const domain={min:Math.min(...allGears.map(g=>g.ratio)),max:Math.max(...allGears.map(g=>g.ratio))};
function renderGears(){
 const selected=allGears.filter(g=>state.gear.includes(g.bikeId));
 const view=$('gear-scroll');
 chartWidth=Math.max(view.clientWidth,2400*state.zoom);
 $('zoom').value=state.zoom;$('zoom-label').value=Math.round(state.zoom*100)+'%';
 $('zoom-out').disabled=state.zoom<=.05;$('zoom-in').disabled=state.zoom>=4;
 $('gear-count').textContent=`${selected.length} combinations · ${state.gear.length} models`;
 $('gear-detail').textContent='Select a ratio label to inspect its chainring and cassette combination.';
 if(!selected.length){$('gear-canvas').innerHTML='<div class="empty">Select at least one model to explore its gears.</div>';return;}
 const x=v=>62+(v-domain.min)/(domain.max-domain.min)*(chartWidth-124);
 const sorted=selected.slice().sort((a,b)=>a.ratio-b.ratio||a.bikeId.localeCompare(b.bikeId));
 const lanes={top:[],bottom:[]};
 const placed=sorted.map(g=>{
   const side=g.bikeId==='grizl5'?'bottom':'top';
   const px=x(g.ratio),ends=lanes[side];
   let lane=ends.findIndex(end=>px-51>end+8);
   if(lane===-1)lane=ends.length;
   ends[lane]=px+51;
   return {...g,x:px,side,lane};
 });
 const baseline=74+lanes.top.length*40;
 const height=baseline+70+lanes.bottom.length*40;
 const ns='http://www.w3.org/2000/svg';
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('width',chartWidth);svg.setAttribute('height',height);svg.setAttribute('viewBox',`0 0 ${chartWidth} ${height}`);svg.setAttribute('role','group');svg.setAttribute('aria-label','Gear ratios on one common linear scale, from easier to harder.');
 function add(tag,attrs,text,parent=svg){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;parent.append(e);return e;}
 const ticks=[];for(let tick=1;tick<=4.5;tick+=.5)ticks.push(tick);
 ticks.forEach(t=>{const px=x(t);add('line',{x1:px,y1:40,x2:px,y2:height-25,stroke:t===1?'#c6cdbd':'#e7eadf','stroke-dasharray':t===1?'4 4':'2 6'});add('text',{x:px,y:25,'text-anchor':'middle',fill:'#8b9384','font-size':10},t===1?'1.00 · 1:1':t.toFixed(2));});
 add('line',{x1:35,x2:chartWidth-35,y1:baseline,y2:baseline,stroke:'#c9d0c2','stroke-width':1});
 placed.forEach((g,index)=>{
 const ly=g.side==='top'?baseline-29-g.lane*40:baseline+39+g.lane*40;
 add('path',{d:`M ${g.x} ${baseline+(g.side==='top'?-5:5)} L ${g.x} ${ly+(g.side==='top'?14:-19)}`,stroke:g.bike.color,'stroke-opacity':.25,fill:'none'});
 const group=add('g',{class:'gear-label',role:'button',tabindex:0,'aria-label':`${g.bike.name}: ${g.front} front teeth, ${g.rear} rear teeth, ratio ${g.ratio.toFixed(3)}`});
 add('rect',{x:g.x-51,y:ly-17,width:102,height:34,rx:4,fill:'#fcfdf9'},undefined,group);
 add('text',{x:g.x,y:ly-2,'text-anchor':'middle',fill:g.bike.color,'font-size':13,'font-weight':600},g.ratio.toFixed(2),group);
 add('text',{x:g.x,y:ly+11,'text-anchor':'middle',fill:'#7a8373','font-size':9},`${g.bike.shortName || g.bike.name} · ${g.front}/${g.rear}`,group);
 function choose(){ $('gear-detail').textContent=`${g.bike.name} · ${g.front}T front / ${g.rear}T rear = ${g.ratio.toFixed(3)} wheel revolutions per pedal revolution.`;svg.querySelectorAll('.gear-label rect').forEach(r=>r.setAttribute('stroke','none'));group.firstChild.setAttribute('stroke',g.bike.color);}
 group.addEventListener('click',choose);group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
 });
 // Equal ratios share a pie marker, keeping every model visible at the same coordinate.
 const clusters=new Map();selected.forEach(g=>{const key=g.ratio.toFixed(9);if(!clusters.has(key))clusters.set(key,[]);if(!clusters.get(key).some(d=>d.bikeId===g.bikeId))clusters.get(key).push(g);});
 clusters.forEach(cluster=>{const px=x(cluster[0].ratio),radius=3.3;cluster.forEach((g,i)=>{if(cluster.length===1)add('circle',{cx:px,cy:baseline,r:radius,fill:g.bike.color});else{const a=i/cluster.length*Math.PI*2,b=(i+1)/cluster.length*Math.PI*2;add('path',{d:`M ${px} ${baseline} L ${px+radius*Math.cos(a)} ${baseline+radius*Math.sin(a)} A ${radius} ${radius} 0 ${b-a>Math.PI?1:0} 1 ${px+radius*Math.cos(b)} ${baseline+radius*Math.sin(b)} Z`,fill:g.bike.color});}});});
 $('gear-canvas').replaceChildren(svg);
}
function zoomTo(z){const view=$('gear-scroll');const midpoint=(view.scrollLeft+view.clientWidth/2)/chartWidth;state.zoom=Math.max(.05,Math.min(4,z));renderGears();view.scrollLeft=midpoint*chartWidth-view.clientWidth/2;persist();}
$('zoom').addEventListener('input',e=>zoomTo(Number(e.target.value)));
$('zoom-in').addEventListener('click',()=>zoomTo(state.zoom+.25));$('zoom-out').addEventListener('click',()=>zoomTo(state.zoom-.25));$('fit').addEventListener('click',()=>{zoomTo($('gear-scroll').clientWidth/2400);$('gear-scroll').scrollLeft=0;});
$('gear-scroll').addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();zoomTo(state.zoom*Math.exp(-e.deltaY*.008));}},{passive:false});
$('gear-scroll').addEventListener('pointerdown',e=>{if(e.button!==0||e.target.closest('.gear-label')||e.pointerType==='touch')return;drag={x:e.clientX,left:$('gear-scroll').scrollLeft};$('gear-scroll').setPointerCapture(e.pointerId);$('gear-scroll').classList.add('dragging');});
$('gear-scroll').addEventListener('pointermove',e=>{if(drag)$('gear-scroll').scrollLeft=drag.left+drag.x-e.clientX;});
for(const event of ['pointerup','pointercancel','lostpointercapture'])$('gear-scroll').addEventListener(event,()=>{drag=null;$('gear-scroll').classList.remove('dragging');});
function featureOptions(){
 $('feature-options').innerHTML=[...new Set(features.map(f=>f.group))].map(group=>`<div class="feature-group"><strong>${group}</strong>${features.filter(f=>f.group===group).map(f=>`<label><input type="checkbox" value="${f.id}" ${state.features.includes(f.id)?'checked':''}>${f.label}</label>`).join('')}</div>`).join('');
 $('feature-count').textContent=`${state.features.length} selected`;
}
$('feature-options').addEventListener('change',e=>{const id=e.target.value;state.features=e.target.checked?[...state.features,id]:state.features.filter(x=>x!==id);state.preset='custom';$('preset').value='custom';$('feature-count').textContent=`${state.features.length} selected`;persist();renderTable();});
$('preset').value=state.preset;$('preset').addEventListener('change',e=>{state.preset=e.target.value;state.features=[...presets[state.preset]];featureOptions();renderTable();persist();});
$('differences').checked=!!state.differences;$('differences').addEventListener('change',e=>{state.differences=e.target.checked;renderTable();persist();});
function renderTable(){
 const chosen=bikes.filter(b=>state.compare.includes(b.id));
 if(!chosen.length){$('spec-table').innerHTML='<div class="empty">Choose at least one bike for your comparison.</div>';return;}
 const rows=features.filter(f=>state.features.includes(f.id)).filter(f=>!state.differences||chosen.length<2||new Set(chosen.map(b=>format(b,f))).size>1);
 if(!rows.length){$('spec-table').innerHTML=`<div class="empty">${state.features.length?'No differences in the selected specifications.':'Choose specifications above to build your comparison.'}</div>`;return;}
 $('spec-table').innerHTML=`<table><caption class="sr-only">Selected bicycle specifications, checked ${checkedOn}</caption><thead><tr><th scope="col">SPECIFICATION</th>${chosen.map(b=>`<th scope="col"><a class="table-model-name" href="${b.url}" target="_blank" rel="noopener"><span class="model-dot" style="--bike-color:${b.color}"></span>${b.name} ↗</a></th>`).join('')}</tr></thead><tbody>${rows.map(f=>`<tr><th scope="row">${f.label}</th>${chosen.map(b=>`<td>${format(b,f)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
featureOptions();renderTable();renderGears();
let resizeTimer;new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(renderGears,120);}).observe($('gear-scroll'));
