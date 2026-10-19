import assert from 'node:assert/strict';
import {bikes,features,presets} from './dist/data.mjs';
import {gears,limits,format} from './dist/engine.mjs';
assert.equal(new Set(bikes.map(b=>b.id)).size,bikes.length);
for(const b of bikes){
 assert.ok(/^https:\/\//.test(b.url));assert.ok(/^#[0-9a-f]{6}$/i.test(b.color));
 for(const teeth of [b.front,b.rear]){assert.ok(teeth.length);assert.ok(teeth.every(n=>Number.isInteger(n)&&n>0));assert.equal(new Set(teeth).size,teeth.length);assert.deepEqual(teeth,[...teeth].sort((a,b)=>a-b));}
 assert.equal(gears(b).length,b.front.length*b.rear.length);
 for(const f of features)assert.equal(typeof format(b,f),'string');
}
const byId=Object.fromEntries(bikes.map(b=>[b.id,b]));
assert.equal(limits(byId.grizl5).low,.8);
assert.equal(limits(byId.cf6).low,34/36);
assert.equal(limits(byId.allroad).low,34/39);
assert.equal(limits(byId.allroad).high,limits(byId.cf6).high);
assert.equal(bikes.flatMap(gears).length,77);
assert.equal(new Set(bikes.flatMap(gears).map(g=>g.ratio.toFixed(9))).size,47);
for(const p of Object.values(presets))for(const id of p)assert.ok(features.some(f=>f.id===id));
assert.equal(format(byId.cf6,features.find(f=>f.id==='rack')),'Not verified');
for(const b of bikes){assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(b.priceCheckedOn||''),'priceCheckedOn date for '+b.id);}
console.log('Catalog, 77 combinations, 47 unique ratios, formatting and presets passed.');
