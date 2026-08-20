
const APP_VERSION = "2.0.0";
const TRIP_DATE = new Date("2027-01-09T00:00:00");
const START_DATE = new Date("2026-08-24T00:00:00");

const PLAN = {
  phases: [
    {id:"reentry",name:"Re-entry",from:"2026-08-24",to:"2026-09-06",goal:"Return without chasing old volume.",rules:["2 gym sessions/week","Established lifts: 2 work sets","BSS + step-down: 2 sets","Calf + inversion rehab: 3 sets","3–4 RIR initially"]},
    {id:"build",name:"Build",from:"2026-09-07",to:"2026-10-31",goal:"Rebuild strength while skiing weekly.",rules:["A + B are the baseline","Established lifts move toward 3 sets","BSS + step-down stay at 2 sets initially","Progress reps/load before adding volume","1 Snozone session/week"]},
    {id:"control",name:"Ski strength & control",from:"2026-11-01",to:"2026-11-29",goal:"Turn strength into unilateral and eccentric control.",rules:["Maintain main strength","Progress BSS and slow step-down quality","Add lateral work by substitution, not pile-on volume","Snozone technique remains a priority"]},
    {id:"conditioning",name:"Ski conditioning",from:"2026-11-30",to:"2026-12-27",goal:"Keep technique when the legs are tired.",rules:["Maintain strength","Small ski-endurance dose only","Longer / more continuous Snozone sessions","Power is optional, not mandatory"]},
    {id:"taper",name:"Taper",from:"2026-12-28",to:"2027-01-09",goal:"Arrive in Les Carroz fresh.",rules:["Reduce lower-body gym volume","Easy final Snozone","No leg-destroying finishers","Prioritise sleep and normal movement"]}
  ],
  weeklyTargets:{strength:2,snow:1,cardio:2},
  workouts:{
    A:{
      name:"Workout A",subtitle:"Squat + unilateral",
      exercises:[
        {name:"Hack Squat",key:"hack",repMin:6,repMax:10,sets:2,eventualSets:3,startWeight:42.5,increment:5,note:"Primary lower-body strength. Hack first."},
        {name:"Chest Fly",key:"fly",repMin:8,repMax:10,sets:2,eventualSets:3,startWeight:67.5,increment:5},
        {name:"Pull Up",key:"pullup",repMin:4,repMax:8,sets:2,eventualSets:3,startWeight:0,increment:1,note:"Bodyweight. Progress reps first."},
        {name:"Bulgarian Split Squat",key:"bss",repMin:8,repMax:10,sets:2,eventualSets:2,startWeight:0,increment:2.5,note:"Keep at 2 sets initially. Quality > misery."},
        {name:"Lateral Raise Machine",key:"latraise",repMin:10,repMax:12,sets:2,eventualSets:3,startWeight:30,increment:2.5},
        {name:"Loaded Inversion",key:"inversion",repMin:12,repMax:12,sets:3,eventualSets:3,startWeight:27.5,increment:2.5,note:"Rehab work. Retain 3 sets."},
        {name:"Standing Calf Raise",key:"standcalf",repMin:8,repMax:12,sets:3,eventualSets:3,startWeight:52.5,increment:5,note:"Rehab / ankle capacity."},
        {name:"Back Extension",key:"backext",repMin:10,repMax:12,sets:2,eventualSets:3,startWeight:0,increment:5},
        {name:"DB Curl",key:"curl",repMin:10,repMax:12,sets:2,eventualSets:3,startWeight:10,increment:2.5,optional:true}
      ]
    },
    B:{
      name:"Workout B",subtitle:"Hamstrings + eccentric",
      exercises:[
        {name:"Seated Leg Curl",key:"legcurl",repMin:8,repMax:12,sets:2,eventualSets:3,startWeight:47.5,increment:5},
        {name:"Incline Chest Press",key:"incline",repMin:6,repMax:10,sets:2,eventualSets:3,startWeight:75,increment:5},
        {name:"Seated Row",key:"row",repMin:8,repMax:10,sets:2,eventualSets:3,startWeight:42.5,increment:5},
        {name:"Slow Step-down",key:"stepdown",repMin:8,repMax:10,sets:2,eventualSets:2,startWeight:0,increment:2.5,note:"3–4 sec lowering. Eccentric control, not a max-strength lift."},
        {name:"Lateral Raise Machine",key:"latraise",repMin:10,repMax:12,sets:2,eventualSets:3,startWeight:30,increment:2.5},
        {name:"Loaded Inversion",key:"inversion",repMin:12,repMax:12,sets:3,eventualSets:3,startWeight:27.5,increment:2.5},
        {name:"Seated Calf Raise",key:"seatcalf",repMin:10,repMax:12,sets:3,eventualSets:3,startWeight:47.5,increment:5},
        {name:"Triceps Pushdown",key:"triceps",repMin:8,repMax:12,sets:2,eventualSets:3,startWeight:47.5,increment:5},
        {name:"Knee Raise",key:"kneeraise",repMin:8,repMax:15,sets:2,eventualSets:3,startWeight:0,increment:1}
      ]
    }
  },
  skiFocus:[
    "Quiet upper body","Outside ski pressure","Turn shape & speed control","Short-radius turns",
    "Variable turn radius","Pole plants","Instructor feedback","Slow skiing & control",
    "Technique under fatigue","Steeper-section control"
  ]
};

const HISTORICAL = {
  hack:["60×8","60×7","60×6"], fly:["84×10","84×10","84×8"], pullup:["6","6","5"],
  latraise:["41×12","41×12","41×9"], inversion:["30×12","30×12","30×12"],
  standcalf:["55×8","70×8","70×8"], curl:["12.5×12","12.5×12","12.5×10"],
  backext:["10×12","10×12","10×12"], incline:["80×8","100×8","110×4"],
  row:["55×8","60×8"], legcurl:["57×8","57×8","57×8"], seatcalf:["60×12","60×12","60×12"],
  triceps:["57×8","66×8","60×8"], kneeraise:["16","15","10"]
};

class DB {
  constructor(){this.db=null}
  async init(){
    this.db = await new Promise((resolve,reject)=>{
      const r=indexedDB.open("skiPrepV2",1);
      r.onupgradeneeded=()=>{
        const d=r.result;
        ["sessions","weights","settings"].forEach(s=>{if(!d.objectStoreNames.contains(s))d.createObjectStore(s,{keyPath:"id",autoIncrement:true})});
      };
      r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error);
    });
  }
  store(name,mode="readonly"){return this.db.transaction(name,mode).objectStore(name)}
  async all(name){return new Promise((res,rej)=>{const r=this.store(name).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
  async add(name,val){return new Promise((res,rej)=>{const r=this.store(name,"readwrite").add(val);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
  async put(name,val){return new Promise((res,rej)=>{const r=this.store(name,"readwrite").put(val);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
  async clear(name){return new Promise((res,rej)=>{const r=this.store(name,"readwrite").clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
}
const db=new DB();

const S={tab:"today", modal:null, editingSession:null};
const $=s=>document.querySelector(s);
const fmtDate=d=>new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const iso=d=>new Date(d).toISOString();
const today=()=>new Date();
const daysBetween=(a,b)=>Math.ceil((b-a)/86400000);

function currentPhase(){
  const n=today();
  return PLAN.phases.find(p=>n>=new Date(p.from+"T00:00:00")&&n<=new Date(p.to+"T23:59:59")) || PLAN.phases[0];
}
function weekStart(d=new Date()){
  const x=new Date(d); const day=(x.getDay()+6)%7; x.setHours(0,0,0,0); x.setDate(x.getDate()-day); return x;
}
function sessionType(s){
  if(s.kind==="gym") return "strength";
  if(s.kind==="snow") return "snow";
  if(s.kind==="cardio") return "cardio";
  return "other";
}
function inThisWeek(s){const ws=weekStart(),we=new Date(ws);we.setDate(ws.getDate()+7);const d=new Date(s.date);return d>=ws&&d<we}
function workoutSetsForPhase(ex){
  const p=currentPhase().id;
  if(p==="reentry") return ex.sets;
  if(p==="build"||p==="control"||p==="conditioning") return ex.eventualSets;
  return Math.max(1,Math.min(ex.eventualSets,2));
}
async function lastExercisePerformance(key){
  const sessions=(await db.all("sessions")).filter(s=>s.kind==="gym"&&s.status!=="skipped"&&s.exercises);
  sessions.sort((a,b)=>new Date(b.date)-new Date(a.date));
  for(const s of sessions){
    const e=s.exercises.find(x=>x.key===key);
    if(e && e.sets.some(x=>x.reps||x.weight)) return e.sets.filter(x=>x.reps||x.weight);
  }
  return null;
}
function progressionSuggestion(ex,last){
  if(!last||!last.length) return {weight:ex.startWeight,reps:ex.repMin,text:`Start around ${ex.startWeight||"bodyweight"} · ${ex.repMin} reps`};
  const work=last.filter(x=>x.reps);
  const weight=Math.max(...work.map(x=>Number(x.weight)||0),0);
  const allTop=work.length>=Math.min(workoutSetsForPhase(ex),2)&&work.every(x=>Number(x.reps)>=ex.repMax);
  if(ex.key==="pullup"||weight===0){
    const best=Math.min(...work.map(x=>Number(x.reps)||0));
    return {weight, reps:Math.min(ex.repMax,best+1), text:allTop?"Rep range topped — keep quality high":`Aim to beat last reps`};
  }
  return allTop
    ? {weight:weight+ex.increment,reps:ex.repMin,text:`Rep range topped → try ${weight+ex.increment} kg`}
    : {weight,reps:ex.repMin,text:`Stay at ${weight} kg and beat reps`};
}

function nav(){
  const tabs=[["today","⌂","Today"],["train","＋","Train"],["progress","↗","Progress"],["plan","≡","Plan"],["more","•••","More"]];
  $("#tabs").innerHTML=tabs.map(([id,ic,l])=>`<button class="tab ${S.tab===id?"on":""}" data-tab="${id}"><b>${ic}</b>${l}</button>`).join("");
  document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;render()});
}
async function render(){
  nav();
  if(S.tab==="today") await renderToday();
  if(S.tab==="train") await renderTrain();
  if(S.tab==="progress") await renderProgress();
  if(S.tab==="plan") await renderPlan();
  if(S.tab==="more") await renderMore();
}

async function renderToday(){
  const sessions=await db.all("sessions"), weights=await db.all("weights");
  const week=sessions.filter(inThisWeek);
  const counts={strength:0,snow:0,cardio:0};
  week.filter(s=>s.status!=="skipped").forEach(s=>{const t=sessionType(s);if(counts[t]!=null)counts[t]++});
  const targetTotal=5, done=Math.min(counts.strength,2)+Math.min(counts.snow,1)+Math.min(counts.cardio,2);
  const phase=currentPhase();
  const days=Math.max(0,daysBetween(today(),TRIP_DATE));
  const latestW=weights.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  const lastStrength=week.filter(s=>s.kind==="gym"&&s.status!=="skipped").sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  const nextWorkout=lastStrength?.workout==="A"?"B":"A";
  const focusIndex=Math.max(0,Math.floor((today()-START_DATE)/(14*86400000)))%PLAN.skiFocus.length;
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">Gareth's Ski Prep</div><h1>Today</h1></div><span class="phase-pill">${phase.name}</span></div>
    <section class="hero">
      <div class="hero-grid"><div><div class="countdown">${days}<span>days to Les Carroz</span></div></div><div style="text-align:right"><div class="kicker">Current phase</div><strong>${phase.name}</strong><div class="small muted">${phase.goal}</div></div></div>
    </section>
    <section class="card">
      <div class="item-head"><div><h2>This week</h2><div class="muted small">Do the work. Move it when life happens. Log the truth.</div></div><strong>${done}/${targetTotal}</strong></div>
      ${scoreRow("🏋️","Strength",counts.strength,2)}
      ${scoreRow("⛷️","Snozone",counts.snow,1)}
      ${scoreRow("♥","Cardio",counts.cardio,2)}
      <div class="progressbar"><div style="width:${done/targetTotal*100}%"></div></div>
    </section>
    <section class="card next-card">
      <div class="session-type">Next useful session</div>
      <h2 style="margin-top:5px">${PLAN.workouts[nextWorkout].name}</h2>
      <p class="muted">${PLAN.workouts[nextWorkout].subtitle} · ${phase.id==="reentry"?"re-entry volume":"current phase prescription"}</p>
      <button class="btn block" id="startNext">Start ${nextWorkout}</button>
    </section>
    <div class="grid2">
      <section class="card metric"><span>Latest weight</span><strong>${latestW?latestW.kg.toFixed(1)+" kg":"—"}</strong><button class="btn small secondary" id="logWeight" style="margin-top:10px">Log weight</button></section>
      <section class="card metric"><span>Ski focus</span><strong style="font-size:18px">${PLAN.skiFocus[focusIndex]}</strong><button class="btn small secondary" id="logSnow" style="margin-top:10px">Log Snozone</button></section>
    </div>
    <section class="card soft">
      <div class="kicker">Recovery rule</div>
      <p style="margin-bottom:0">Snozone counts as lower-body load. If your legs or ankle are unusually sore, reduce the next lower-body session rather than forcing the spreadsheet.</p>
    </section>`;
  $("#startNext").onclick=()=>startGym(nextWorkout);
  $("#logWeight").onclick=()=>weightModal();
  $("#logSnow").onclick=()=>snowModal();
}
function scoreRow(icon,name,n,target){
  return `<div class="score-row"><div class="score-name"><span>${icon}</span><span>${name}</span></div><div><span class="badge ${n>=target?"ok":""}">${Math.min(n,target)}/${target}</span></div></div>`;
}

async function renderTrain(){
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">Training</div><h1>Train</h1><div class="muted">Choose what you're actually doing today.</div></div></div>
    <div class="list">
      ${trainCard("A","🏋️",PLAN.workouts.A.name,PLAN.workouts.A.subtitle)}
      ${trainCard("B","🏋️",PLAN.workouts.B.name,PLAN.workouts.B.subtitle)}
      ${trainCard("snow","⛷️","Snozone","Technique + snow time")}
      ${trainCard("cardio","♥","Cardio","Easy aerobic or intervals")}
      ${trainCard("other","＋","Other activity","Walk, hike, extra session, anything useful")}
    </div>`;
  document.querySelectorAll("[data-start]").forEach(b=>b.onclick=()=>{
    const t=b.dataset.start;
    if(t==="A"||t==="B")startGym(t);
    if(t==="snow")snowModal();
    if(t==="cardio")cardioModal();
    if(t==="other")otherModal();
  });
}
function trainCard(id,icon,title,sub){
  return `<section class="card"><div class="item-head"><div><div class="session-type">${icon} ${id==="A"||id==="B"?"Strength":"Activity"}</div><h2 style="margin:5px 0">${title}</h2><div class="muted">${sub}</div></div><button class="btn small" data-start="${id}">Start</button></div></section>`;
}

async function startGym(which){
  const w=PLAN.workouts[which];
  const data=[];
  for(const ex of w.exercises){
    const last=await lastExercisePerformance(ex.key);
    const sug=progressionSuggestion(ex,last);
    const n=workoutSetsForPhase(ex);
    data.push({...ex,n,last,sug,sets:Array.from({length:n},()=>({weight:sug.weight||"",reps:"",rir:""}))});
  }
  S.editingSession={kind:"gym",workout:which,date:new Date().toISOString(),status:"complete",exercises:data};
  renderGymLogger();
}
function renderGymLogger(){
  const s=S.editingSession,w=PLAN.workouts[s.workout];
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">${currentPhase().name}</div><h1>${w.name}</h1><div class="muted">${w.subtitle}</div></div><button class="btn ghost small" id="cancel">Cancel</button></div>
    <div class="banner"><strong>Today's rule:</strong> ${currentPhase().id==="reentry"?"Leave 3–4 reps in reserve. This is re-entry, not a test.":"Progress performance before adding more work."}</div>
    <section class="card">
      ${s.exercises.map((ex,ei)=>exerciseHTML(ex,ei)).join("")}
    </section>
    <div class="field"><label>Session note</label><textarea id="sessionNote" placeholder="How did it feel? Anything to change next time?"></textarea></div>
    <div class="actions"><button class="btn" id="saveGym">Save workout</button><button class="btn warn" id="partialGym">Save as partial</button><button class="btn ghost" id="skipGym">Skip today</button></div>`;
  $("#cancel").onclick=()=>{S.editingSession=null;S.tab="today";render()};
  document.querySelectorAll(".set-input").forEach(i=>i.oninput=e=>{
    const {ei,si,field}=e.target.dataset;
    S.editingSession.exercises[+ei].sets[+si][field]=e.target.value;
  });
  $("#saveGym").onclick=()=>saveGym("complete");
  $("#partialGym").onclick=()=>saveGym("partial");
  $("#skipGym").onclick=()=>saveGym("skipped");
}
function exerciseHTML(ex,ei){
  const prev=ex.last?.length?ex.last.map(x=>`${x.weight||""}${x.weight?"×":""}${x.reps}`).join(" · "):(HISTORICAL[ex.key]?.join(" · ")||"No recent log");
  return `<div class="exercise">
    <div class="exercise-title"><div><h3>${ex.name}${ex.optional?' <span class="badge">optional</span>':""}</h3><div class="previous">Previous: ${prev}</div><div class="small" style="color:var(--accent2);margin-top:3px">${ex.sug.text}</div>${ex.note?`<div class="small muted" style="margin-top:4px">${ex.note}</div>`:""}</div><span class="badge">${ex.n} sets</span></div>
    ${ex.sets.map((x,si)=>`<div class="set-row"><span class="set-num">${si+1}</span><input class="set-input" data-ei="${ei}" data-si="${si}" data-field="weight" inputmode="decimal" placeholder="kg" value="${x.weight}"><input class="set-input" data-ei="${ei}" data-si="${si}" data-field="reps" inputmode="numeric" placeholder="reps"><input class="set-input" data-ei="${ei}" data-si="${si}" data-field="rir" inputmode="numeric" placeholder="RIR"><span class="small muted">✓</span></div>`).join("")}
  </div>`;
}
async function saveGym(status){
  const s=S.editingSession;s.status=status;s.note=$("#sessionNote")?.value||"";
  s.exercises=s.exercises.map(e=>({name:e.name,key:e.key,sets:e.sets}));
  await db.add("sessions",s); S.editingSession=null; S.tab="today"; render();
}

function shell(title,eyebrow,body){
  document.querySelector("#app").innerHTML=`<div class="topbar"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div><button class="btn ghost small" id="closeModal">Cancel</button></div>${body}`;
  $("#closeModal").onclick=()=>{S.tab="today";render()};
}
function snowModal(){
  const idx=Math.max(0,Math.floor((today()-START_DATE)/(14*86400000)))%PLAN.skiFocus.length;
  shell("Snozone","Snow session",`
    <section class="card"><div class="kicker">Suggested focus</div><h2>${PLAN.skiFocus[idx]}</h2><div class="muted">Treat this as training load, not free recovery.</div></section>
    <div class="field"><label>Duration (minutes)</label><input id="snowMin" type="number" value="60"></div>
    <div class="grid2"><div class="field"><label>Effort /10</label><input id="snowEffort" type="number" min="1" max="10" value="6"></div><div class="field"><label>Leg fatigue /10</label><input id="snowLegs" type="number" min="1" max="10" value="5"></div></div>
    <div class="field"><label>Technique focus</label><input id="snowFocus" value="${PLAN.skiFocus[idx]}"></div>
    <div class="field"><label>What clicked?</label><textarea id="snowGood"></textarea></div>
    <div class="field"><label>What struggled?</label><textarea id="snowBad"></textarea></div>
    <button class="btn block" id="saveSnow">Save Snozone session</button>`);
  $("#saveSnow").onclick=async()=>{await db.add("sessions",{kind:"snow",date:iso(new Date()),status:"complete",minutes:+$("#snowMin").value,effort:+$("#snowEffort").value,legFatigue:+$("#snowLegs").value,focus:$("#snowFocus").value,good:$("#snowGood").value,bad:$("#snowBad").value});S.tab="today";render()};
}
function cardioModal(){
  shell("Cardio","Aerobic work",`
    <div class="field"><label>Type</label><select id="cType"><option>Easy / Zone 2</option><option>Intervals</option><option>Walk</option><option>Bike</option><option>Elliptical</option><option>Other</option></select></div>
    <div class="grid2"><div class="field"><label>Minutes</label><input id="cMin" type="number" value="40"></div><div class="field"><label>Effort /10</label><input id="cEff" type="number" min="1" max="10" value="4"></div></div>
    <div class="field"><label>Notes</label><textarea id="cNote"></textarea></div>
    <button class="btn block" id="saveC">Save cardio</button>`);
  $("#saveC").onclick=async()=>{await db.add("sessions",{kind:"cardio",date:iso(new Date()),status:"complete",activity:$("#cType").value,minutes:+$("#cMin").value,effort:+$("#cEff").value,note:$("#cNote").value});S.tab="today";render()};
}
function otherModal(){
  shell("Other activity","Log reality",`
    <div class="field"><label>What did you do?</label><input id="oName" placeholder="e.g. 12 km hike"></div>
    <div class="field"><label>Minutes</label><input id="oMin" type="number" value="60"></div>
    <div class="field"><label>Notes</label><textarea id="oNote"></textarea></div>
    <button class="btn block" id="saveO">Save activity</button>`);
  $("#saveO").onclick=async()=>{await db.add("sessions",{kind:"other",date:iso(new Date()),status:"complete",activity:$("#oName").value,minutes:+$("#oMin").value,note:$("#oNote").value});S.tab="today";render()};
}
function weightModal(){
  shell("Log weight","Body trend",`
    <section class="card soft"><div class="muted">Individual weigh-ins are noise. The trend is what matters.</div></section>
    <div class="field"><label>Weight (kg)</label><input id="wKg" type="number" step=".1" value="102.5"></div>
    <button class="btn block" id="saveW">Save weight</button>`);
  $("#saveW").onclick=async()=>{await db.add("weights",{date:iso(new Date()),kg:+$("#wKg").value});S.tab="today";render()};
}

async function renderProgress(){
  const sessions=(await db.all("sessions")).sort((a,b)=>new Date(b.date)-new Date(a.date));
  const weights=(await db.all("weights")).sort((a,b)=>new Date(a.date)-new Date(b.date));
  const startW=weights[0]?.kg||102.5, latestW=weights.at(-1)?.kg;
  const snow=sessions.filter(s=>s.kind==="snow"&&s.status!=="skipped");
  const gyms=sessions.filter(s=>s.kind==="gym"&&s.status!=="skipped");
  const cardio=sessions.filter(s=>s.kind==="cardio"&&s.status!=="skipped");
  const weeks = adherenceWeeks(sessions);
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">Evidence, not vibes</div><h1>Progress</h1></div></div>
    <div class="grid3">
      <section class="card metric"><span>Gym</span><strong>${gyms.length}</strong></section>
      <section class="card metric"><span>Snow</span><strong>${snow.length}</strong></section>
      <section class="card metric"><span>Cardio</span><strong>${cardio.length}</strong></section>
    </div>
    <section class="card"><div class="item-head"><div><h2>Weight trend</h2><div class="muted">${latestW?`${(latestW-startW).toFixed(1)} kg since first log`:"Start logging to see the trend."}</div></div>${latestW?`<strong>${latestW.toFixed(1)} kg</strong>`:""}</div>${weightChart(weights)}</section>
    <section class="card"><h2>Weekly adherence</h2>${weeks.length?weeks.slice(-8).reverse().map(w=>`<div class="score-row"><span>${w.label}</span><span class="badge ${w.score>=80?"ok":""}">${w.score}%</span></div>`).join(""):`<div class="muted">Your completed sessions will build this view.</div>`}</section>
    <section class="card"><h2>Ski development</h2>${snow.length?snow.slice(0,5).map(s=>`<div class="item" style="margin-bottom:8px"><div class="item-head"><strong>${fmtDate(s.date)}</strong><span class="badge">${s.minutes||0} min</span></div><div class="small" style="color:var(--accent);margin-top:5px">${s.focus||"Ski session"}</div>${s.good?`<div class="small muted">Clicked: ${esc(s.good)}</div>`:""}</div>`).join(""):`<div class="muted">Log Snozone sessions to build your technical history.</div>`}</section>`;
}
function adherenceWeeks(sessions){
  const map={};
  sessions.forEach(s=>{
    const ws=weekStart(new Date(s.date)),key=ws.toISOString().slice(0,10);
    map[key]??={date:ws,strength:0,snow:0,cardio:0};
    if(s.status==="skipped")return;
    const t=sessionType(s);if(map[key][t]!=null)map[key][t]++;
  });
  return Object.values(map).sort((a,b)=>a.date-b.date).map(w=>{
    const done=Math.min(w.strength,2)+Math.min(w.snow,1)+Math.min(w.cardio,2);
    return {...w,label:`w/c ${fmtDate(w.date)}`,score:Math.round(done/5*100)};
  });
}
function weightChart(weights){
  if(weights.length<2)return `<div class="muted" style="padding:28px 0;text-align:center">Two weigh-ins are enough to start a trend.</div>`;
  const last=weights.slice(-20), vals=last.map(x=>x.kg),min=Math.min(...vals)-1,max=Math.max(...vals)+1,w=500,h=150,p=14;
  const pts=last.map((x,i)=>`${p+i*(w-2*p)/(last.length-1)},${h-p-(x.kg-min)*(h-2*p)/(max-min)}`).join(" ");
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#8fd3ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

async function renderPlan(){
  const p=currentPhase();
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">Programme</div><h1>Plan</h1><div class="muted">Stable framework. Progressive emphasis.</div></div></div>
    <section class="card"><div class="kicker">Default week</div><h2 style="margin-top:5px">2 strength · 1 snow · 2 cardio</h2><p class="muted">A and B are the baseline. Snozone is a lower-body exposure. A third gym day is optional, not owed.</p></section>
    <div class="section-title"><h2>Phases</h2></div>
    <section class="card">${PLAN.phases.map(x=>`<div class="phase ${x.id===p.id?"current":""}"><h3>${x.name}</h3><div class="small muted">${fmtDate(x.from)} → ${fmtDate(x.to)}</div><p>${x.goal}</p><div class="small muted">${x.rules.join(" · ")}</div></div>`).join("")}</section>
    <div class="section-title"><h2>Workout A</h2><span class="pill">Squat + unilateral</span></div>
    ${planWorkout("A")}
    <div class="section-title"><h2>Workout B</h2><span class="pill">Hamstrings + eccentric</span></div>
    ${planWorkout("B")}
    <section class="card soft"><div class="kicker">Volume principle</div><p style="margin-bottom:0">Established exercises can return toward 3 sets. BSS and step-downs do not automatically need 3. When ski-specific work increases later, substitute or reshape volume rather than endlessly adding more.</p></section>`;
}
function planWorkout(k){
  return `<section class="card">${PLAN.workouts[k].exercises.map(e=>`<div class="score-row"><div><strong>${e.name}</strong>${e.note?`<div class="small muted">${e.note}</div>`:""}</div><span class="badge">${workoutSetsForPhase(e)} × ${e.repMin}–${e.repMax}</span></div>`).join("")}</section>`;
}

async function renderMore(){
  const sessions=await db.all("sessions"),weights=await db.all("weights");
  document.querySelector("#app").innerHTML=`
    <div class="topbar"><div><div class="eyebrow">Data & controls</div><h1>More</h1></div></div>
    <section class="card"><h2>Backup</h2><p class="muted">All training data lives on this device. Export a backup occasionally.</p><div class="actions"><button class="btn secondary" id="export">Export JSON</button><label class="btn secondary" style="display:inline-block;color:var(--text);margin:0">Restore JSON<input type="file" id="restore" accept=".json" hidden></label></div></section>
    <section class="card"><h2>Data</h2><div class="score-row"><span>Sessions</span><strong>${sessions.length}</strong></div><div class="score-row"><span>Weight logs</span><strong>${weights.length}</strong></div><div class="score-row"><span>App version</span><strong>${APP_VERSION}</strong></div></section>
    <section class="card"><h2>Principles baked into this app</h2><p class="muted">Progress reps/load before chasing volume. Snozone counts as training. A/B remains full-body. Rehab volume stays deliberate. Ski-specific work is phased in instead of dumped on top.</p></section>
    <section class="card"><h2>Danger zone</h2><button class="btn danger" id="erase">Erase all local data</button></section>`;
  $("#export").onclick=async()=>{
    const data={version:APP_VERSION,exportedAt:iso(new Date()),sessions:await db.all("sessions"),weights:await db.all("weights")};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download=`ski-prep-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
  };
  $("#restore").onchange=async e=>{
    const f=e.target.files[0];if(!f)return;
    const data=JSON.parse(await f.text());
    if(!confirm("Restore this backup? Existing local sessions and weights will be replaced."))return;
    await db.clear("sessions");await db.clear("weights");
    for(const x of data.sessions||[]) {delete x.id;await db.add("sessions",x)}
    for(const x of data.weights||[]) {delete x.id;await db.add("weights",x)}
    alert("Backup restored.");render();
  };
  $("#erase").onclick=async()=>{if(confirm("Delete all local training data?")&&confirm("Really delete it?")){await db.clear("sessions");await db.clear("weights");render()}};
}

(async function(){
  await db.init();
  if((await db.all("weights")).length===0) await db.add("weights",{date:"2026-08-20T06:39:47.000Z",kg:102.5});
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
  render();
})();
