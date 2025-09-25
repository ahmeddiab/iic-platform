
// Navigation
document.querySelectorAll('.tab').forEach(t=>{
  t.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const id = t.getAttribute('href').replace('#','');
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  });
});

// Rates table (official sample)
const RATES = {
  "خصوصي_4": { risk: 0.02975, liability: 0.00525, terror: 0.012 },
  "خصوصي_6": { risk: 0.031875, liability: 0.005625, terror: 0.014 },
  "خصوصي_8": { risk: 0.034, liability: 0.006, terror: 0.016 }
};

function calcPremium(categoryKey, price, includeTerror=false){
  const r = RATES[categoryKey];
  if(!r) return null;
  const base = price * r.risk + price * r.liability;
  const terror = includeTerror ? (price/2) * r.terror : 0;
  return { base: Math.round(base), terror: Math.round(terror), total: Math.round(base + terror) };
}

function formatIQD(n){
  return n.toLocaleString('ar-IQ');
}

document.getElementById('btnCalc').addEventListener('click', ()=>{
  const cat = document.getElementById('category').value;
  const price = parseFloat(document.getElementById('price').value || '0');
  const terror = document.getElementById('terror').checked;
  if(!price || price<=0){ alert('الرجاء إدخال السعر السوقي'); return; }
  const res = calcPremium(cat, price, terror);
  if(!res){ alert('فئة غير معروفة'); return; }
  document.getElementById('result').innerText =
    'قسط الخطر + المسؤولية: ' + formatIQD(res.base) + ' دينار' + '\n' +
    (terror ? ('قسط الإرهاب: ' + formatIQD(res.terror) + ' دينار\n') : '') +
    'الإجمالي المسترشد به: ' + formatIQD(res.total) + ' دينار';

  // Link to Google Form prefill (put your form link)
  const formUrl = document.getElementById('gform').src || '';
  if(formUrl){
    const u = new URL(formUrl);
    // Example of adding params; adjust entry.123 to match your form fields if needed
    u.searchParams.set('price', price);
    u.searchParams.set('category', cat);
    document.getElementById('linkQuote').href = u.toString();
  } else {
    document.getElementById('linkQuote').href = '#';
  }
});

// Load branches
async function loadBranches(){
  try{
    const res = await fetch('/data/branches.json');
    return await res.json();
  }catch(e){ return []; }
}

// Haversine distance in km
function distKm(lat1, lon1, lat2, lon2){
  const toRad = d=> d*Math.PI/180;
  const R = 6371;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}

document.getElementById('btnLocate').addEventListener('click', async ()=>{
  const listEl = document.getElementById('branchList');
  listEl.innerHTML = '... جاري تحديد الموقع';
  const branches = await loadBranches();
  if(!navigator.geolocation){
    listEl.innerHTML = 'المتصفح لا يدعم تحديد الموقع. اعرض جميع الفروع أدناه:';
    renderBranches(branches);
    return;
  }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    branches.forEach(b=>{
      if(b.lat && b.lng){
        b.distance = distKm(latitude, longitude, b.lat, b.lng);
      } else {
        b.distance = null;
      }
    });
    branches.sort((a,b)=> (a.distance ?? 1e9) - (b.distance ?? 1e9));
    renderBranches(branches);
  }, err=>{
    listEl.innerHTML = 'تعذّر تحديد الموقع. اعرض جميع الفروع أدناه:';
    renderBranches(branches);
  });
});

function renderBranches(arr){
  const listEl = document.getElementById('branchList');
  listEl.innerHTML = '';
  arr.forEach(b=>{
    const item = document.createElement('div');
    item.className = 'branch';
    const dist = (typeof b.distance === 'number') ? ` — ≈ ${b.distance.toFixed(1)} كم` : '';
    item.innerHTML = `
      <strong>${b.name}${dist}</strong>
      <span>هاتف: <a href="tel:${b.phone}">${b.phone}</a></span>
      <div>
        <a class="btn-alt" href="${b.maps}" target="_blank">افتح على الخرائط</a>
      </div>
    `;
    listEl.appendChild(item);
  });
}

// Simple router if hash present
window.addEventListener('hashchange', ()=>{
  const id = location.hash.replace('#','') || 'calc';
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
  const th = document.querySelector(`.tab[href="#${id}"]`);
  if(th) th.classList.add('active');
});

// Set your official Google Form link here (embed URL)
document.addEventListener('DOMContentLoaded', ()=>{
  const gform = document.getElementById('gform');
  // TODO: ضع رابط التضمين الرسمي للاستمارة هنا
  gform.src = '';
});
