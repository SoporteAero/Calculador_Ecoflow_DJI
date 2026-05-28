
const ecoflows = [
    // --- Serie EcoFlow RIVER ---
    { n: "RIVER 2", wh: 256, wM: 300 },
    { n: "RIVER 3", wh: 230, wM: 300 },
    { n: "RIVER 2 MAX", wh: 512, wM: 500 },
    { n: "RIVER 2 PRO", wh: 768, wM: 800 },

    // --- Serie EcoFlow DELTA ---
    { n: "DELTA 2", wh: 1024, wM: 1800 },
    { n: "DELTA 3", wh: 1024, wM: 1800 },
    { n: "DELTA 2 MAX", wh: 2048, wM: 2400 },
    { n: "DELTA PRO", wh: 3600, wM: 3600 },
    { n: "DELTA 3 PRO", wh: 4096, wM: 4000 },

    // --- Serie DJI Power ---
    { n: "DJI Power 500", wh: 512, wM: 1000 },
    { n: "DJI Power 1000 (V1)", wh: 1024, wM: 2200 },
    { n: "DJI Power 1000 V2", wh: 1024, wM: 2600 },
    { n: "DJI Power 2000", wh: 2048, wM: 3000 }
];

const db = [
    { eq: "DJI Mavic 3 Enterprise", modo: "Cargador 100W", wh: 77, w: 85, hub: false },
    { eq: "DJI Mavic 3 Enterprise", modo: "Puerto USB-C", wh: 77, w: 75, hub: false },
    { eq: "Matrice 4", modo: "Cargador 100W", wh: 99.5, w: 100, hub: false },
    { eq: "Matrice 4", modo: "Puerto USB-C", wh: 99.5, w: 103, hub: false },
    { eq: "RC Pro Enterprise", modo: "Cargador 100W", wh: 36, w: 30, hub: false },
    { eq: "RC Plus 1", modo: "Cargador 100W", wh: 46.8, w: 37, hub: false },
    { eq: "RC Plus 2", modo: "Cargador 100W", wh: 46.8, w: 40, hub: false },
    { eq: "RTK 3", modo: "Encendida", wh: 46.8, w: 25, hub: false },
    { eq: "RTK 3", modo: "Apagada", wh: 46.8, w: 20, hub: false },
    { eq: "Starlink V2", modo: "Uso Estándar (80W)", wh: 0, w: 80, hub: false },
    { eq: "Dock 3", modo: "Standby", wh: 0, w: 490, hub: false },
    { eq: "Dock 3", modo: "Cargando Dron", wh: 149.9, w: 800, hub: false },
    { eq: "BS65 (M350)", modo: "Normal", wh: 526.4, w: 626, hub: true },
    { eq: "BS65 (M350)", modo: "Rápida", wh: 526.4, w: 648, hub: true },
    { eq: "BS30 (M30)", modo: "Normal", wh: 263.2, w: 437, hub: true },
    { eq: "BS30 (M30)", modo: "Rápida", wh: 263.2, w: 456, hub: true },
    { eq: "BS100 (M400)", modo: "Normal c/ruido", wh: 977, w: 1222, hub: true },
    { eq: "BS100 (M400) (Silencioso)", modo: "Normal s/ruido", wh: 977, w: 543, hub: true },
    { eq: "BS100 (M400)", modo: "Rápida c/ruido", wh: 977, w: 1227, hub: true },
    { eq: "BS100 (M400) (Silencioso)", modo: "Rápida s/ruido", wh: 977, w: 547, hub: true }
];

const sEco = document.getElementById('sel-eco');
const sEq = document.getElementById('sel-eq');
const sModo = document.getElementById('sel-modo');
const cRC = document.getElementById('chk-rc');
const cWB = document.getElementById('chk-wb37');
const pAcc = document.getElementById('panel-accesorios');

ecoflows.forEach(e => sEco.add(new Option(e.n, e.n)));
const eqsUnicos = [...new Set(db.map(x => x.eq))];
eqsUnicos.forEach(e => sEq.add(new Option(e, e)));

function update() {
    const eqSel = db.filter(x => x.eq === sEq.value);
    sModo.innerHTML = "";
    eqSel.forEach(m => sModo.add(new Option(m.modo, m.modo)));
    pAcc.style.display = eqSel[0].hub ? "block" : "none";
    calc();
}

function calc() {
    const eco = ecoflows.find(e => e.n === sEco.value);
    const item = db.find(d => d.eq === sEq.value && d.modo === sModo.value);
    
    if(!item) return;

    let totalWh = item.wh;
    let totalW = item.w;

    if (item.hub) {
        if (cRC.checked) { totalWh += 46.8; totalW += 40; }
        if (cWB.checked) { totalWh += 37; totalW += 30; } 
    }

    const rRec = document.getElementById('res-recargas');
    const rTie = document.getElementById('res-tiempo');
    const rAle = document.getElementById('res-alerta');
    const lCic = document.getElementById('label-ciclos');

    if (totalWh <= 1) {
        lCic.innerText = "Autonomía continua:";
        rRec.innerText = (eco.wh / totalW).toFixed(1) + " horas";
        rTie.innerText = "N/A";
    } else {
        lCic.innerText = "Recargas posibles:";
        rRec.innerText = (eco.wh / totalWh).toFixed(2) + " ciclos";
        rTie.innerText = Math.round((totalWh / totalW) * 60) + " minutos";
    }

    if (totalW > eco.wM) {
        rAle.innerText = "¡SOBRECARGA!";
        rAle.className = "value status-error";
    } else {
        rAle.innerText = "[OK] Operación Segura";
        rAle.className = "value status-ok";
    }
}

sEq.addEventListener('change', update);
[sEco, sModo, cRC, cWB].forEach(el => el.addEventListener('change', calc));
update();
