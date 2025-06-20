document.addEventListener('DOMContentLoaded', () => {

    // DOM Elemanlarını Seçme
    const statusDisplay = document.getElementById('system-status');
    const aiLog = document.getElementById('ai-log');
    const triggerBtn = document.getElementById('trigger-anomaly');
    const heartbeatSound = document.getElementById('heartbeat-sound');

    // Başlangıç Ayarları
    let isSimulationRunning = false;
    let isAnomalyActive = false;

    // Hayati Veri Tanımları ve Referansları
    // DEĞİŞİKLİK 1: Her veri için optimal bir aralık (optimalRange) eklendi.
    const vitals = {
        o2: { el: document.querySelector('#vital-o2'), base: 99.5, range: 0.4, min: 0, max: 100, unit: '%', optimalRange: [96, 100], warningRange: [92, 96] },
        glucose: { el: document.querySelector('#vital-glucose'), base: 85, range: 2, min: 0, max: 200, unit: 'mg/dL', optimalRange: [70, 110], warningRange: [60, 70] },
        neural: { el: document.querySelector('#vital-neural'), base: 98, range: 1, min: 0, max: 100, unit: '%', optimalRange: [95, 100], warningRange: [90, 95] },
        hormone: { el: document.querySelector('#vital-hormone'), base: 12.5, range: 0.5, min: 0, max: 30, unit: 'ng/mL', optimalRange: [8, 18], warningRange: [5, 8] },
        amnio: { el: document.querySelector('#vital-amnio'), base: 10, range: 0.2, min: 0, max: 20, unit: 'mmHg', optimalRange: [8, 12], warningRange: [6, 8] },
        heartbeat: { el: document.querySelector('#vital-heartbeat'), base: 145, range: 4, min: 0, max: 200, unit: 'bpm', optimalRange: [120, 160], warningRange: [100, 120] },
    };

    // AI Günlüğüne Mesaj Ekleme Fonksiyonu
    function log(message, type = 'system') {
        const p = document.createElement('p');
        p.className = `log-entry ${type}`;
        p.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        aiLog.appendChild(p);
        aiLog.scrollTop = aiLog.scrollHeight;
    }

    // Arayüzü Güncelleme Fonksiyonu
    function updateUI() {
        if (!isAnomalyActive) {
            for (const key in vitals) {
                const vital = vitals[key];
                const fluctuation = (Math.random() - 0.5) * vital.range;
                let newValue = vital.base + fluctuation;
                updateVital(key, newValue);
            }
        }
    }
    
    // Tek bir hayati veriyi güncelle
    function updateVital(key, value) {
        const vital = vitals[key];
        const valEl = vital.el.querySelector('.value');
        const barEl = vital.el.querySelector('.bar');
        
        valEl.textContent = value.toFixed(1);
        
        const percentage = (value / vital.max) * 100;
        barEl.style.width = `${percentage}%`;

        // DEĞİŞİKLİK 2: Bar rengi artık mutlak yüzdeye göre değil, tanımlanan optimal aralığa göre ayarlanıyor.
        if (value >= vital.optimalRange[0] && value <= vital.optimalRange[1]) {
            barEl.style.backgroundColor = 'var(--optimal-color)';
        } else if (value >= vital.warningRange[0] && value < vital.optimalRange[0]) {
            barEl.style.backgroundColor = 'var(--warning-color)';
        } else {
            barEl.style.backgroundColor = 'var(--critical-color)';
        }
    }

    // Sistem Durumunu Değiştirme
    function setSystemStatus(status, text) {
        statusDisplay.className = `status-${status}`;
        statusDisplay.textContent = `SİSTEM DURUMU: ${text}`;
    }

    // Anomali Simülasyonu
    function simulateAnomaly() {
        if (isAnomalyActive) return;
        isAnomalyActive = true;
        triggerBtn.disabled = true;

        const anomalyTypes = [
            { key: 'glucose', name: 'Hipoglisemi', drop: 40, fixMsg: 'Yoğun glikoz çözeltisi salgılanıyor...' },
            { key: 'o2', name: 'Hipoksi', drop: 88, fixMsg: 'Bio-Interface üzerinden oksijen transferi artırıldı...' },
            { key: 'neural', name: 'Nöral Desenkronizasyon', drop: 85, fixMsg: 'Amniyotik matrisin iyon dengesi ayarlanıyor...' },
            { key: 'heartbeat', name: 'Fetal Bradikardi', drop: 90, fixMsg: 'Sakinleştirici nöropeptitler salgılandı, ritm stabilize ediliyor...' }
        ];

        const anomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];

        log(`UYARI: ${anomaly.name} anomali sinyali algılandı!`, 'critical');
        setSystemStatus('critical', 'ANOMALİ TESPİT EDİLDİ');
        updateVital(anomaly.key, anomaly.drop);

        setTimeout(() => {
            log(`MÜDAHALE: ${anomaly.fixMsg}`, 'warning');
            setSystemStatus('warning', 'SİSTEM KALİBRE EDİLİYOR');

            // DEĞİŞİKLİK 3: Döngünün takılmasını önlemek için mantık tamamen yeniden yazıldı.
            let recoveringValue = anomaly.drop; // Döngü için yuvarlanmamış, hassas değer.
            const targetVal = vitals[anomaly.key].base;

            const recoveryInterval = setInterval(() => {
                // Hedefe ulaşıldı mı kontrolü
                if (Math.abs(recoveringValue - targetVal) < 0.1) {
                    clearInterval(recoveryInterval);
                    updateVital(anomaly.key, targetVal); // Son değeri hedefe tam olarak ayarla
                    log('BAŞARILI: Parametreler nominal seviyeye döndü. Sistem stabil.', 'info');
                    setSystemStatus('optimal', 'OPTİMAL');
                    isAnomalyActive = false;
                    triggerBtn.disabled = false;
                    return; // Döngüden çık
                }

                // Değeri hedefe doğru yavaşça artır/azalt
                const step = (targetVal - recoveringValue) * 0.1; // Oransal artış
                recoveringValue += step;
                
                // Arayüzü yuvarlanmamış değerle güncelle
                updateVital(anomaly.key, recoveringValue);

            }, 100); // Her 100ms'de bir düzeltme adımı

        }, 2000);
    }

    // Simülasyonu Başlatma
    function startSimulation() {
        if (isSimulationRunning) return;
        isSimulationRunning = true;
        
        heartbeatSound.play().catch(e => console.error("Ses çalınamadı:", e));
        
        log('GAIA POD simülasyonu başlatılıyor...');
        setInterval(updateUI, 1500);
        triggerBtn.addEventListener('click', simulateAnomaly);

        triggerBtn.style.opacity = '0';
        setTimeout(() => {
            triggerBtn.style.transition = 'opacity 1s';
            triggerBtn.style.opacity = '1';
        }, 2000);
    }

    document.body.addEventListener('click', startSimulation, { once: true });

if (window.opener) {
    window.opener.postMessage({ tool: 'GAIA_POD', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;
    
});