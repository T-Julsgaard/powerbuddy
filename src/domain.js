/* PowerBuddy domain: calculations and state transitions, independent of the DOM. */
const PB = (() => {
  const VERSION=1, SEED=260106, KEY='greenbuddies.powerbuddy.v1', START='2026-10-06T08:24:00.000Z';
  const CONFIG={electricityRate:2.4,waterRate:55,emissionsFactor:.12,laundryEnergy:.8,showerLitresPerMinute:8,standbyWatts:10};
  const REWARDS=[
    {id:'repair',name:'A seat at the repair table',partner:'Nørrebro Repair Collective',cost:80,icon:'Wrench',type:'repair',description:'Bring a small household item and learn a repair skill with a friendly volunteer. One fictional workshop place, with tools provided.',terms:'Mock voucher · one fictional workshop place.'},
    {id:'reuse',name:'Neighbourhood swap morning',partner:'The Second Life Club',cost:120,icon:'Repeat2',type:'reuse',description:'A reserved place at a local reuse morning. Share something you no longer need, find a new use, and meet your neighbours.',terms:'Mock voucher · one fictional event place.'},
    {id:'badge',name:'Small steps, shared future',partner:'GreenBuddies',cost:30,icon:'ShieldCheck',type:'badge',description:'A quiet digital badge for your household. A reminder that a useful habit is worth keeping, without needing to buy anything.',terms:'Fictional digital recognition. No monetary value.'}
  ];
  const clone=x=>JSON.parse(JSON.stringify(x));
  const partsFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Copenhagen',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const localParts=t=>partsFormatter.formatToParts(new Date(t)).reduce((a,p)=>(a[p.type]=p.value,a),{});
  const localDate=t=>{const p=localParts(t);return `${p.year}-${p.month}-${p.day}`};
  const localHour=t=>{const p=localParts(t);return +p.hour+(+p.minute/60)};
  const hourText=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.round((h%1)*60)).padStart(2,'0');
  const parseHour=value=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(value||''))return NaN;const [h,m]=value.split(':').map(Number);return h+m/60};
  /* Resolve Copenhagen wall time, including its DST offset, without relying on the host timezone. */
  function fromLocal(value){const [date,time='00:00']=value.split('T'),[y,m,d]=date.split('-').map(Number),[h,min]=time.split(':').map(Number);let utc=Date.UTC(y,m-1,d,h,min);for(let i=0;i<3;i++){const p=localParts(utc),represented=Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute);utc+=Date.UTC(y,m-1,d,h,min)-represented}return utc}
  const monthDays=m=>new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7),0)).getUTCDate();
  function prevMonth(m){const d=new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7)-2,1));return d.toISOString().slice(0,7)}
  const lastComplete=t=>prevMonth(localDate(t).slice(0,7));
  function demo(){return {
    version:VERSION,now:START,seq:1,config:clone(CONFIG),
    household:{nickname:'Freja’s home',name:'Freja',city:'Copenhagen',residents:2,housing:'Apartment',laundry:true,dishwasher:false,shortShowers:false,acceptableFrom:8,acceptableTo:22},
    readings:[['2026-04',260,8.8],['2026-05',252,8.4],['2026-06',238,8],['2026-07',245,8.2],['2026-08',240,8],['2026-09',210,7]].map(([period,electricity,water])=>({id:'reading-'+period,period,electricity,water,complete:true,days:monthDays(period),source:'demo'})).concat([{id:'reading-2026-10',period:'2026-10',electricity:35,water:1.17,complete:false,days:5,source:'demo'}]),
    plans:[],challenges:{loads:{joined:true,actions:[{id:'demo-load',at:START}],completed:false},reduction:{joined:false,baseline:'2026-09',target:5,resource:'electricity',completed:false,assessed:null}},
    ledger:[{id:'welcome',amount:40,reason:'Demo welcome points',at:START}],redemptions:[],notifications:[],priceOverrides:{},
    preferences:{prices:true,reminders:true,readings:true,achievements:true,quietEnabled:true,quietFrom:22,quietTo:7,hidePreviews:false,reducedMotion:false},device:'app'
  }}
  const id=(s,prefix)=>prefix+'-'+s.seq++;
  const reading=(s,period)=>s.readings.find(r=>r.period===period);
  const cost=(s,r)=>r.electricity*s.config.electricityRate+r.water*s.config.waterRate;
  const reduction=(baseline,current)=>Number.isFinite(baseline)&&baseline>0&&Number.isFinite(current)?(baseline-current)/baseline*100:null;
  const points=s=>s.ledger.reduce((a,l)=>a+l.amount,0);
  function breakdown(r,resource,kind='day'){
    const n=kind==='day'?r.days:24;
    const month=+r.period.slice(5),phase=(SEED%97)*.01,weights=Array.from({length:n},(_,i)=>kind==='day'?1+.18*Math.sin(i*1.37+month+phase)+.07*Math.cos(i*.6):.6+.45*Math.max(0,Math.cos((i-19)*Math.PI/12))+.25*Math.max(0,Math.cos((i-8)*Math.PI/9)));
    const sum=weights.reduce((a,v)=>a+v,0),total=r[resource];
    const values=weights.map(w=>total*w/sum);values[n-1]+=total-values.reduce((a,v)=>a+v,0);
    return values;
  }
  function comparison(s,r,resource){
    const b=reading(s,prevMonth(r.period));if(!b)return null;
    let baseline=b[resource],current=r[resource],label=`vs ${prevMonth(r.period)}`;
    if(!r.complete){if(b.days<r.days)return null;baseline=breakdown(b,resource).slice(0,r.days).reduce((a,v)=>a+v,0);label=`vs first ${r.days} days of ${b.period} · modelled`}
    return {baseline,current,percent:reduction(baseline,current),difference:baseline-current,saving:(baseline-current)*(resource==='electricity'?s.config.electricityRate:s.config.waterRate),label};
  }
  function price(s,t){const stamp=new Date(t).toISOString().slice(0,13);if(stamp in s.priceOverrides)return s.priceOverrides[stamp];const h=Math.floor(localHour(t));const base=[1.18,1.12,1.05,1.02,1.09,1.38,2.05,2.6,2.75,2.32,1.85,1.35,1.12,1.08,1.25,1.68,2.3,2.88,3.16,2.92,2.5,2.05,1.55,1.3];const day=+localDate(t).slice(8);return base[h]+((day-6)%3)*.05}
  function cycleCost(s,start,duration,energy){let t=start,end=start+duration*3600000,total=0;while(t<end){const next=Math.min(end,(Math.floor(t/3600000)+1)*3600000);total+=energy*((next-t)/(end-start))*price(s,t);t=next}return total}
  const energy=(s,appliance)=>s.config.laundryEnergy*(appliance==='Dishwasher'?1.375:1);
  function feasible(s,c){
    const start=fromLocal(c.date+'T'+c.earliest),finish=fromLocal(c.date+'T'+c.latest),now=+new Date(s.now),dur=c.duration*3600000;
    const options=[];for(let t=Math.ceil(Math.max(start,now)/900000)*900000;t+dur<=finish;t+=900000){let okay=true;for(let x=t;x<t+dur;x+=900000){const h=localHour(x),length=Math.min(900000,t+dur-x)/3600000;if(h<c.from||h+length>c.to){okay=false;break}}if(okay&&localDate(t)===c.date&&localDate(t+dur-1)===c.date)options.push({start:t,end:t+dur,cost:cycleCost(s,t,c.duration,c.energy??energy(s,c.appliance))})}
    const initial=options[0]||null,best=options.slice().sort((a,b)=>a.cost-b.cost||a.start-b.start)[0]||null;return {options,initial,best};
  }
  function quiet(s){if(!s.preferences.quietEnabled)return false;const h=localHour(s.now),a=s.preferences.quietFrom,b=s.preferences.quietTo;return a>b?h>=a||h<b:h>=a&&h<b}
  function notify(s,event){
    if(!s.preferences[event.category]||s.notifications.some(n=>n.key===event.key))return null;
    const n={id:id(s,'notification'),...event,at:s.now,status:quiet(s)?'pending':'unread'};s.notifications.push(n);
    if(n.status==='unread'&&s.device==='off')s.device='locked';return n;
  }
  function release(s){if(quiet(s))return;for(const n of s.notifications)if(n.status==='pending'){if(!s.preferences[n.category]){n.status='dismissed';continue}n.status='unread';if(s.device==='off')s.device='locked'}}
  function scheduleTick(s){release(s);for(const p of s.plans){if(p.status!=='scheduled')continue;const due=p.reminderAt||p.start;if(+new Date(s.now)>=+new Date(due)){notify(s,{key:'due-'+p.id+'-'+due,category:'reminders',title:'Your cycle is ready to start',body:`${p.appliance} · ${time(p.start)}. A full load makes the most of it.`,target:{type:'plan',id:p.id}})}}}
  function advance(s,t){if(!Number.isFinite(t))throw Error('Choose a valid simulation time.');s.now=new Date(t).toISOString();scheduleTick(s)}
  function savePlan(s,c,option,existingId){const chosen=option==='initial'?feasible(s,c).initial:feasible(s,c).best;if(!chosen)throw Error('No cycle fits these hours.');let p=s.plans.find(p=>p.id===existingId);if(p){for(const n of s.notifications)if(n.target.type==='plan'&&n.target.id===p.id)n.status='dismissed'}if(!p){p={id:id(s,'plan')};s.plans.push(p)}Object.assign(p,{...clone(c),start:new Date(chosen.start).toISOString(),end:new Date(chosen.end).toISOString(),cost:chosen.cost,energy:energy(s,c.appliance),status:'scheduled',reminderAt:new Date(chosen.start).toISOString(),reminder:true});return p}
  function scanPrices(s){for(const p of s.plans){if(p.status!=='scheduled')continue;const f=feasible(s,p);if(f.best&&f.best.cost+.05<cycleCost(s,+new Date(p.start),p.duration,p.energy)){notify(s,{key:'cheaper-'+p.id+'-'+f.best.start,category:'prices',title:'A better window for your cycle',body:`${time(f.best.start)}–${time(f.best.end)} could save ${money(cycleCost(s,+new Date(p.start),p.duration,p.energy)-f.best.cost)} DKK. Your chosen hours still fit.`,target:{type:'plan',id:p.id}})}}}
  function cancelPlan(s,planId){const p=s.plans.find(p=>p.id===planId);if(p){p.status='cancelled';p.reminder=false;for(const n of s.notifications)if(n.target.type==='plan'&&n.target.id===planId&&n.status!=='dismissed')n.status='dismissed'}}
  function snooze(s,planId){const p=s.plans.find(p=>p.id===planId);if(!p||p.status!=='scheduled')return false;p.reminderAt=new Date(+new Date(s.now)+30*60000).toISOString();for(const n of s.notifications)if(n.target.id===planId&&n.category==='reminders')n.status='read';return true}
  function completeChallenge(s,type){const c=s.challenges[type];if(c.completed)return false;c.completed=true;const key='challenge-'+type;if(!s.ledger.some(l=>l.id===key))s.ledger.push({id:key,amount:type==='loads'?60:80,reason:type==='loads'?'Three full loads':'Monthly electricity goal',at:s.now});notify(s,{key,category:'achievements',title:'Small steps, well done',body:type==='loads'?'Three full loads reported. You earned 60 points.':'Your next complete reading meets your goal. You earned 80 points.',target:{type:'challenge',id:type}});return true}
  function reportLoad(s,activityId){const c=s.challenges.loads;if(!c.joined||c.completed||c.actions.some(a=>a.id===activityId))return false;c.actions.push({id:activityId,at:s.now});if(c.actions.length>=3)completeChallenge(s,'loads');return true}
  function assessGoal(s){const c=s.challenges.reduction;if(!c.joined||c.completed)return;const baseline=reading(s,c.baseline);if(!baseline?.complete||baseline.electricity===0)return;const next=s.readings.filter(r=>r.complete&&r.period>c.baseline&&r.period<=lastComplete(s.now)).sort((a,b)=>a.period.localeCompare(b.period))[0];if(!next)return;c.assessed=next.period;const pct=reduction(baseline.electricity,next.electricity);if(pct!==null&&pct>=c.target)completeChallenge(s,'reduction')}
  function validateReading(s,input){const errors={};if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(input.period||''))errors.period='Choose the month this bill covers.';else if(input.period>lastComplete(s.now))errors.period='Use a complete past month. The current month is still in progress.';else if(input.period<'2020-01')errors.period='Choose a month from 2020 onwards.';for(const key of ['electricity','water']){if(input[key]===''||input[key]===null||input[key]===undefined)errors[key]=`Enter ${key} used during the month. Zero is okay.`;else if(!Number.isFinite(Number(input[key]))||Number(input[key])<0)errors[key]='Use a number of zero or more.';else if(Number(input[key])>1e7)errors[key]='This prototype supports values up to 10,000,000.'}return errors}
  function saveReading(s,input,replace=false){const errors=validateReading(s,input);if(Object.keys(errors).length)throw Error(Object.values(errors)[0]);const old=reading(s,input.period);if(old&&!replace)throw Error('This month already has a reading. Review before replacing it.');const r={id:old?.id||'reading-'+input.period,period:input.period,electricity:+input.electricity,water:+input.water,complete:true,days:monthDays(input.period),source:input.source||'manual'};if(old)s.readings[s.readings.indexOf(old)]=r;else s.readings.push(r);s.readings.sort((a,b)=>a.period.localeCompare(b.period));const ec=comparison(s,r,'electricity'),wc=comparison(s,r,'water');if((ec&&ec.percent!==null&&ec.percent< -20)||(wc&&wc.percent!==null&&wc.percent< -20)||r.electricity>1500||r.water>30)notify(s,{key:'review-'+r.id+'-'+r.electricity+'-'+r.water,category:'readings',title:'A fresh reading to look at',body:`${month(r.period)} is higher than your previous month. Check the period and units when you have a moment.`,target:{type:'reading',id:r.id}});assessGoal(s);return r}
  function claim(s,rewardId){const reward=REWARDS.find(r=>r.id===rewardId);if(!reward)throw Error('Reward not found.');const previous=s.redemptions.find(v=>v.rewardId===rewardId);if(previous)return previous;if(points(s)<reward.cost)throw Error(`You need ${reward.cost-points(s)} more points.`);const voucher={id:id(s,'PB'),rewardId,at:s.now,status:'claimed'};s.redemptions.push(voucher);s.ledger.push({id:'claim-'+voucher.id,amount:-reward.cost,reason:reward.name,at:s.now});return voucher}
  function redeem(s,voucherId){const v=s.redemptions.find(v=>v.id===voucherId);if(!v||v.status==='redeemed')return false;v.status='redeemed';v.redeemedAt=s.now;return true}
  function recommendations(s,period){const r=reading(s,period),h=s.household,result=[];
    if(h.laundry)result.push({id:'laundry',icon:'WashingMachine',title:'Give your next load a better time',body:`${h.residents>2?'Family laundry adds up.':'A full load, a little planning.'} Compare a convenient time with a cheaper window.`,estimate:'Same energy. A different price.',action:'Plan a laundry cycle',rank:4});
    if(!h.shortShowers)result.push({id:'shower',icon:'Droplet',title:'A minute less in the shower',body:`For ${h.residents} ${h.residents===1?'resident':'residents'}, one minute less each day could save ${Math.round(h.residents*s.config.showerLitresPerMinute*30).toLocaleString('en-GB')} litres a month.`,estimate:`Could save ${money(h.residents*s.config.showerLitresPerMinute*30/1000*s.config.waterRate)} DKK / month · assumes daily showers`,action:'Try this habit',rank:r&&r.water/h.residents>3?5:3});
    result.push({id:'standby',icon:'Power',title:'Switch off the quiet energy users',body:`Try a switchable socket for devices you can safely turn off. A ${s.config.standbyWatts} W standby load for 16 hours a day uses ${(s.config.standbyWatts/1000*16*30).toFixed(1)} kWh a month.`,estimate:`Could save ${money(s.config.standbyWatts/1000*16*30*s.config.electricityRate)} DKK / month · illustrative`,action:'See the idea',rank:r&&comparison(s,r,'electricity')?.percent<0?5:2});return result.sort((a,b)=>b.rank-a.rank)}
  function scenario(s,name){
    if(name==='cheaper'){
      s.now=START;s.household.laundry=true;s.household.acceptableFrom=8;s.household.acceptableTo=22;
      let p=s.plans.find(p=>p.scenario&&p.status==='scheduled');if(!p){p=savePlan(s,{appliance:'Washing machine',date:'2026-10-06',duration:2,earliest:'18:00',latest:'22:00',from:8,to:22},'initial');p.scenario=true;p.earliest='10:30'}
      for(let h=12;h<15;h++)s.priceOverrides[new Date(fromLocal('2026-10-06T'+String(h).padStart(2,'0')+':00')).toISOString().slice(0,13)]=.65;
      scanPrices(s);return 'A washing-machine plan at 18:00 was prepared. Its daytime window is now cheaper.';
    }
    if(name==='reading'){saveReading(s,{period:'2026-09',electricity:335,water:10.8,source:'scenario'},true);return 'September now has a fictional higher reading: 335 kWh and 10.8 m³.'}
    if(name==='challenge'){s.challenges.loads.joined=true;for(let i=1;i<=3;i++)reportLoad(s,'scenario-load-'+i);return 'The full-load challenge was joined and three example loads were self-reported. Points are granted once.'}
    if(name==='quiet'){s.preferences.quietEnabled=true;s.preferences.quietFrom=22;s.preferences.quietTo=7;s.now=new Date(fromLocal('2026-10-06T23:00')).toISOString();saveReading(s,{period:'2026-09',electricity:340,water:10.9,source:'scenario'},true);return 'Clock set to 23:00 and a higher fictional reading saved. Its review update waits quietly until 07:00.'}
    if(name==='due'){s.now=START;let p=s.plans.find(p=>p.status==='scheduled');if(!p)p=savePlan(s,{appliance:'Washing machine',date:'2026-10-06',duration:2,earliest:'12:00',latest:'16:00',from:8,to:22},'best');advance(s,+new Date(p.reminderAt));return 'The simulation clock moved to your cycle reminder.'}
    if(name==='goal'){s.challenges.reduction={joined:true,baseline:'2026-09',target:5,resource:'electricity',completed:false,assessed:null};advance(s,fromLocal('2026-11-01T10:00'));saveReading(s,{period:'2026-10',electricity:195,water:6.8,source:'scenario'},true);return 'A 5% goal was joined against September. A complete October reading of 195 kWh now qualifies.'}
    return '';
  }
  const money=n=>new Intl.NumberFormat('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const time=t=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Copenhagen',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(t));
  const month=m=>new Intl.DateTimeFormat('en-GB',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(m+'-01T12:00:00Z'));
  const shortMonth=m=>new Intl.DateTimeFormat('en-GB',{month:'short',timeZone:'UTC'}).format(new Date(m+'-01T12:00:00Z'));
  function validateState(x){
    const fail=message=>{throw Error(message)};const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);const str=(v,max=150)=>typeof v==='string'&&v.length>0&&v.length<=max;const num=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;const bool=v=>typeof v==='boolean';const date=v=>typeof v==='string'&&Number.isFinite(Date.parse(v))&&v.length<=30;
    if(!obj(x)||x.version!==VERSION)fail('This is not a PowerBuddy version 1 backup.');
    if(!date(x.now)||x.now<'2026-01-01'||x.now>'2030-12-31'||!Number.isInteger(x.seq)||x.seq<1||x.seq>1e8)fail('The simulation clock or ID counter is invalid.');
    if(!obj(x.household)||!str(x.household.nickname,50)||!str(x.household.name,50)||!str(x.household.city,60)||!Number.isInteger(x.household.residents)||!num(x.household.residents,1,12)||!['Apartment','House','Other'].includes(x.household.housing))fail('Household details are invalid.');
    const h=x.household;if(!['laundry','dishwasher','shortShowers'].every(k=>bool(h[k]))||!num(h.acceptableFrom,0,23.99)||!num(h.acceptableTo,.01,24)||h.acceptableFrom>=h.acceptableTo)fail('Household routine hours are invalid.');
    if(!obj(x.config)||!Object.keys(CONFIG).every(k=>num(x.config[k],0,k==='waterRate'?1000:k==='showerLitresPerMinute'?50:k==='standbyWatts'?1000:100)))fail('One of the mock assumptions is invalid.');
    if(!obj(x.preferences)||!['prices','reminders','readings','achievements','quietEnabled','hidePreviews','reducedMotion'].every(k=>bool(x.preferences[k]))||!num(x.preferences.quietFrom,0,23.99)||!num(x.preferences.quietTo,0,23.99)||x.preferences.quietFrom===x.preferences.quietTo)fail('Notification preferences are invalid.');
    for(const k of ['readings','plans','ledger','redemptions','notifications'])if(!Array.isArray(x[k])||x[k].length>1000)fail(`The ${k} list is invalid or too large.`);
    const unique=(items,key='id')=>new Set(items.map(v=>v[key])).size===items.length;
    const safeId=v=>str(v,100)&&/^[A-Za-z0-9_-]+$/.test(v);
    for(const k of ['readings','plans','ledger','redemptions','notifications'])if(!unique(x[k])||x[k].some(v=>!obj(v)||!safeId(v.id)))fail(`The ${k} list contains invalid or duplicate IDs.`);
    for(const [key,pattern]of Object.entries({readings:/^reading-20\d\d-(0[1-9]|1[0-2])$/,plans:/^plan-\d+$/,redemptions:/^PB-\d+$/,notifications:/^notification-\d+$/}))if(x[key].some(v=>!pattern.test(v.id)))fail(`A ${key} ID uses an unsupported format.`);
    if(!unique(x.readings,'period')||x.readings.some(r=>!/^20\d\d-(0[1-9]|1[0-2])$/.test(r.period)||r.period<'2020-01'||!num(r.electricity,0,1e7)||!num(r.water,0,1e7)||!bool(r.complete)||!Number.isInteger(r.days)||!num(r.days,1,monthDays(r.period))||(r.complete&&r.days!==monthDays(r.period))||!['demo','manual','sample','scenario'].includes(r.source)))fail('A consumption reading has an invalid period, amount or completeness.');
    if(x.plans.some(p=>!['Washing machine','Dishwasher'].includes(p.appliance)||!/^20\d\d-(0[1-9]|1[0-2])-\d\d$/.test(p.date)||!date(p.start)||!date(p.end)||!date(p.reminderAt)||!num(p.duration,.5,6)||!num(p.energy,0,150)||!num(p.cost,0,10000)||!num(p.from,0,23.99)||!num(p.to,.01,24)||p.from>=p.to||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.earliest)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(p.latest)||!['scheduled','completed','cancelled'].includes(p.status)||Math.abs(Date.parse(p.end)-Date.parse(p.start)-p.duration*3600000)>1))fail('An activity plan is invalid.');
    if(!obj(x.challenges)||!obj(x.challenges.loads)||!obj(x.challenges.reduction))fail('Challenge state is invalid.');
    const l=x.challenges.loads,g=x.challenges.reduction;if(!bool(l.joined)||!bool(l.completed)||!Array.isArray(l.actions)||l.actions.length>1000||!unique(l.actions)||l.actions.some(a=>!safeId(a.id)||!date(a.at))||(l.completed&&l.actions.length<3)||!bool(g.joined)||!bool(g.completed)||!/^20\d\d-(0[1-9]|1[0-2])$/.test(g.baseline)||!num(g.target,1,50)||g.resource!=='electricity'||(g.assessed!==null&&!/^20\d\d-(0[1-9]|1[0-2])$/.test(g.assessed)))fail('Challenge criteria or progress are invalid.');
    if(x.ledger.some(e=>!Number.isInteger(e.amount)||!num(e.amount,-10000,10000)||!str(e.reason,150)||!date(e.at))||points(x)<0)fail('The points ledger is invalid.');
    if(x.redemptions.some(v=>!REWARDS.some(r=>r.id===v.rewardId)||!date(v.at)||!['claimed','redeemed'].includes(v.status)||(v.status==='redeemed'&&!date(v.redeemedAt)))||!unique(x.redemptions,'rewardId'))fail('Reward claims are invalid.');
    for(const v of x.redemptions){const r=REWARDS.find(r=>r.id===v.rewardId),entry=x.ledger.find(e=>e.id==='claim-'+v.id);if(!entry||entry.amount!==-r.cost)fail('A voucher does not match its points deduction.')}
    for(const type of ['loads','reduction']){const entry=x.ledger.find(e=>e.id==='challenge-'+type);if(x.challenges[type].completed?(!entry||entry.amount!==(type==='loads'?60:80)):!!entry)fail('Challenge completion does not match its points award.')}
    if(x.ledger.some(e=>e.id!=='welcome'&&!['challenge-loads','challenge-reduction'].includes(e.id)&&!x.redemptions.some(v=>'claim-'+v.id===e.id))||x.ledger.find(e=>e.id==='welcome')?.amount!==40)fail('The points ledger contains an unsupported award.');
    if(x.notifications.some(n=>!str(n.key,200)||!str(n.title,100)||!str(n.body,500)||!date(n.at)||!['prices','reminders','readings','achievements'].includes(n.category)||!['pending','unread','read','dismissed'].includes(n.status)||!obj(n.target)||!['plan','reading','challenge','reward'].includes(n.target.type)||!str(n.target.id,100))||!unique(x.notifications,'key'))fail('Notification state is invalid.');
    for(const n of x.notifications){const target=n.target;if(target.type==='plan'&&!x.plans.some(p=>p.id===target.id)||target.type==='reading'&&!x.readings.some(r=>r.id===target.id)||target.type==='challenge'&&!['loads','reduction'].includes(target.id)||target.type==='reward'&&!REWARDS.some(r=>r.id===target.id))fail('A notification points to a missing item.')}
    if(!obj(x.priceOverrides)||Object.keys(x.priceOverrides).length>2000||Object.entries(x.priceOverrides).some(([k,v])=>!/^20\d\d-\d\d-\d\dT\d\d$/.test(k)||!num(v,0,100)))fail('The synthetic price series is invalid.');
    if(!['app','home','locked','off'].includes(x.device))fail('The device mode is invalid.');
    const ids=[...x.plans,...x.redemptions,...x.notifications].map(v=>Number(v.id.split('-').pop())).filter(Number.isFinite);if(ids.some(n=>n>=x.seq))fail('The ID counter would reuse an existing ID.');
    return clone(x);
  }
  return {VERSION,SEED,KEY,START,CONFIG,REWARDS,clone,demo,id,reading,cost,reduction,points,breakdown,comparison,price,cycleCost,energy,feasible,quiet,notify,release,scheduleTick,advance,savePlan,scanPrices,cancelPlan,snooze,reportLoad,assessGoal,validateReading,saveReading,claim,redeem,recommendations,scenario,money,time,month,shortMonth,localDate,localHour,hourText,parseHour,fromLocal,lastComplete,prevMonth,monthDays,validateState};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PB;
