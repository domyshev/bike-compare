export const ratio = (front,rear) => front/rear;
export const gears = bike => bike.front.flatMap(front=>bike.rear.map(rear=>({front,rear,ratio:ratio(front,rear),bikeId:bike.id})));
export const limits = bike => {const r=gears(bike).map(g=>g.ratio);return {low:Math.min(...r),high:Math.max(...r)};};
export function value(bike,id){
 const {low,high}=limits(bike);
 if(id==='low')return low.toFixed(2);
 if(id==='high')return high.toFixed(2);
 if(id==='range')return Math.round(high/low*100);
 if(id==='combinations')return bike.front.length*bike.rear.length;
 return bike[id];
}
export function format(bike,feature){
 const v=value(bike,feature.id);
 if(v===null||v===undefined)return 'Not verified';
 if(typeof v==='boolean')return v?'Yes':'No';
 if(feature.id==='price')return new Intl.NumberFormat('en-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v);
 return (Array.isArray(v)?v.join(' / '):v)+(feature.unit?' '+feature.unit:'');
}
