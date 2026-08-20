
const plan = window.SKI_PLAN.weeks;
const state = JSON.parse(localStorage.getItem("skiPrepState") || '{"status":{},"notes":{},"week":1}');
const $ = s => document.querySelector(s);

function save(){ localStorage.setItem("skiPrepState", JSON.stringify(state)); }

function sessionKey(wi, si){ return `w${wi+1}s${si}`; }

function renderWeek(){
  const wIndex = state.week - 1;
  const w = plan[wIndex];

  $("#weekSelect").value = state.week;
  $("#weekMeta").innerHTML = `
    <h2>Week ${w.week}: ${w.title}</h2>
    <p>${w.focus}</p>
    ${w.weight ? `<p><strong>Weight trend:</strong> ${w.weight}</p>` : ""}
  `;

  const list = $("#sessionList");
  list.innerHTML = "";
  w.sessions.forEach((s, si) => {
    const key = sessionKey(wIndex, si);
    const status = state.status[key] || "";
    const el = document.createElement("article");
    el.className = `session ${status}`;
    el.innerHTML = `
      <div class="session-top">
        <div>
          <div class="badge">${s.day} · ${s.type}</div>
          <h3>${s.name}</h3>
        </div>
        <div class="badge">${status ? status.toUpperCase() : "PLANNED"}</div>
      </div>
      <ul class="details">${s.details.map(d=>`<li>${d}</li>`).join("")}</ul>
      <div class="actions">
        <button class="doneBtn">Done</button>
        <button class="skipBtn">Skip</button>
        <button class="clearBtn">Clear</button>
      </div>
    `;
    const [done, skip, clear] = el.querySelectorAll("button");
    done.onclick = () => { state.status[key]="done"; save(); render(); };
    skip.onclick = () => { state.status[key]="skipped"; save(); render(); };
    clear.onclick = () => { delete state.status[key]; save(); render(); };
    list.appendChild(el);
  });

  $("#weekNotes").value = state.notes[`w${state.week}`] || "";
  $("#weekNotes").oninput = e => {
    state.notes[`w${state.week}`] = e.target.value;
    save();
  };

  renderHonesty(wIndex);
}

function renderStats(){
  const keys = Object.keys(state.status);
  const done = keys.filter(k => state.status[k] === "done").length;
  const skipped = keys.filter(k => state.status[k] === "skipped").length;
  const total = plan.reduce((sum,w)=>sum+w.sessions.length,0);
  const touched = done + skipped;
  const pct = total ? Math.round(done/total*100) : 0;

  $("#doneCount").textContent = done;
  $("#skipCount").textContent = skipped;
  $("#ringText").textContent = pct + "%";
  $("#ring").style.background = `conic-gradient(var(--accent) ${pct}%, #252933 ${pct}%)`;

  let streak = 0;
  for(let i=0;i<plan.length;i++){
    const statuses = plan[i].sessions.map((_,si)=>state.status[sessionKey(i,si)]);
    const touchedAll = statuses.every(Boolean);
    const doneAny = statuses.some(v=>v==="done");
    if(touchedAll && doneAny) streak++; else break;
  }
  $("#streakCount").textContent = streak;
}

function renderHonesty(wIndex){
  const statuses = plan[wIndex].sessions.map((_,si)=>state.status[sessionKey(wIndex,si)]);
  const done = statuses.filter(v=>v==="done").length;
  const skipped = statuses.filter(v=>v==="skipped").length;
  const untouched = statuses.filter(v=>!v).length;
  let text = "Complete sessions, skip them when life happens, but don't leave them untouched.";
  if (untouched === 0 && skipped === 0) text = "Perfect week. Every planned session completed.";
  else if (untouched === 0) text = `Week closed out: ${done} done, ${skipped} skipped. Honest tracking beats pretending.`;
  else if (done > 0) text = `${done} done, ${skipped} skipped, ${untouched} still waiting. Keep the week alive.`;
  else text = `${untouched} sessions are still untouched. Start with one.`;
  $("#honestyText").textContent = text;
}

function render(){
  renderWeek();
  renderStats();
}

function init(){
  const select = $("#weekSelect");
  plan.forEach(w=>{
    const o = document.createElement("option");
    o.value = w.week;
    o.textContent = `Week ${w.week} · ${w.title}`;
    select.appendChild(o);
  });
  select.onchange = e => { state.week = Number(e.target.value); save(); render(); };
  $("#resetBtn").onclick = () => {
    if(confirm("Reset all progress and notes?")){
      localStorage.removeItem("skiPrepState");
      location.reload();
    }
  };
  render();
}

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
init();
