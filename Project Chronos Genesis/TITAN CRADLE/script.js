document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');

    const statAge = document.getElementById('stat-age');
    const statHeight = document.getElementById('stat-height');
    const statMass = document.getElementById('stat-mass');
    const progressMuscle = document.getElementById('progress-muscle');
    const progressBone = document.getElementById('progress-bone');
    const statMetabolism = document.getElementById('stat-metabolism');
    const statGH = document.getElementById('stat-gh');
    const statRepair = document.getElementById('stat-repair');
    const systemStatus = document.getElementById('system-status');
    const logList = document.getElementById('log-list');
    
    const humanSilhouette = document.getElementById('human-silhouette');
    const exoFrame = document.getElementById('exo-frame');

    // Simülasyon Durumu ve Parametreleri
    let simulationInterval;
    let isRunning = false;
    let time = 0;

    // --- GÜNCELLENMİŞ BAŞLANGIÇ VERİLERİ ---
    const initialState = {
        age: 1.0,        // Başlangıç yaşı: 1
        height: 75,      // 1 yaşındaki bir bebeğin ortalama boyu (cm)
        mass: 9.5,       // 1 yaşındaki bir bebeğin ortalama kilosu (kg)
        muscleMass: 10,  // Başlangıç kas kütlesi oranı (%)
        boneDensity: 40, // Gelişmekte olan kemik yoğunluğu (%)
        metabolism: 100,
        ghLevel: 'DÜŞÜK',
        currentProtocol: 'SİSTEM BAŞLATILIYOR',
        logMessagesSent: {}
    };

    let simState = { ...initialState };

    // Simülasyon Ana Döngüsü
    function runSimulation() {
        simulationInterval = setInterval(() => {
            time++;
            
            // Fiziksel Yaşı Artır (Her saniye ~1 ay artar)
            // 10 yıllık süreci (120 ay) ~24 saniyede tamamlar
            simState.age += 1 / 12;

            // Hormonal Orkestrasyon ve Büyüme
            const hormoneWave = Math.sin(time * 0.1); 
            if (simState.age < 11) { // Büyüme 11 yaşına kadar devam edecek
                 // --- GÜNCELLENMİŞ BÜYÜME ORANLARI ---
                 if (hormoneWave > 0.5) {
                    simState.ghLevel = 'YÜKSEK PİK';
                    simState.height += 0.8; // Hızlı boy artışı
                    simState.mass += 0.4;   // Hızlı kütle artışı
                 } else if (hormoneWave > -0.5) {
                    simState.ghLevel = 'NORMAL';
                    simState.height += 0.5;
                    simState.mass += 0.25;
                 } else {
                    simState.ghLevel = 'DÜŞÜK';
                    simState.height += 0.2;
                    simState.mass += 0.1;
                 }
            } else {
                simState.ghLevel = 'BAZAL SEVİYE';
            }

            // Metabolik Hızlandırıcı
            simState.metabolism = 400 + Math.sin(time * 0.2) * 100;

            // Kas ve Kemik Gelişimi
            if(simState.muscleMass < 85) simState.muscleMass += 0.6;
            if(simState.boneDensity < 90) simState.boneDensity += 0.45;

            // Olayları Kontrol Et ve Günlüğe Kaydet
            checkAndLogEvents();
            updateDOM();

            // --- GÜNCELLENMİŞ BİTİŞ KOŞULU ---
            if (simState.age >= 11.0) {
                endSimulation();
            }

        }, 200); // Her 200ms'de bir döngü
    }

    // Olayları Kontrol Et ve Günlüğe Kaydet
    function checkAndLogEvents() {
        // --- GÜNCELLENMİŞ ZAMANLAMALAR ---
        if (simState.age > 3 && simState.age < 6) {
            simState.currentProtocol = "PROTOKOL: TEMEL MOTOR BECERİLERİ";
            if (!simState.logMessagesSent['motor_sim']) {
                addLog("Exo-Frame, temel motor becerilerini (yürüme, çömelme) simüle ediyor. Alt ekstremite kemik ve kas gelişimi öncelikli.");
                simState.logMessagesSent['motor_sim'] = true;
            }
        } else if (simState.age >= 7 && simState.age < 10) {
            simState.currentProtocol = "PROTOKOL: İLERİ FİZİKSEL KOORDİNASYON";
             if (!simState.logMessagesSent['coord_dev']) {
                addLog("Odak, dinamik koordinasyon ve gövde stabilitesine kaydırıldı. Omurga ve destek kasları güçlendiriliyor.");
                simState.logMessagesSent['coord_dev'] = true;
            }
        }

        if (simState.boneDensity > 85 && !simState.logMessagesSent['bone_density_target']) {
            addLog("UYARI: Kemik yoğunluğu gelişim hedefi %85'i aştı. Mikro-kırık onarım faktörleri artırıldı.");
            simState.logMessagesSent['bone_density_target'] = true;
        }
    }

    // Arayüzü Güncelle
    function updateDOM() {
        statAge.textContent = `${simState.age.toFixed(1)} yıl`;
        statHeight.textContent = `${simState.height.toFixed(0)} cm`;
        statMass.textContent = `${simState.mass.toFixed(1)} kg`;
        
        progressMuscle.style.width = `${simState.muscleMass}%`;
        progressBone.style.width = `${simState.boneDensity}%`;
        
        statMetabolism.textContent = `${simState.metabolism.toFixed(0)}%`;
        statGH.textContent = simState.ghLevel;
        systemStatus.textContent = simState.currentProtocol;

        // --- GÜNCELLENMİŞ GÖRSEL BÜYÜME FORMÜLÜ ---
        // 1-11 yaş arası (10 yıllık süreç) için görsel büyüme
        // Başlangıç boyu 100px, 10 yıl boyunca 250px büyüyecek (her yıl 25px)
        const heightScale = 100 + (simState.age - 1) * 25; 
        humanSilhouette.style.height = `${Math.min(heightScale, 350)}px`;
    }

    function addLog(message) {
        const li = document.createElement('li');
        li.textContent = message;
        logList.appendChild(li);
        logList.scrollTop = logList.scrollHeight; 
    }

    function endSimulation() {
        clearInterval(simulationInterval);
        isRunning = false;
        systemStatus.textContent = "PROTOKOL TAMAMLANDI";
        addLog("Çocukluk evresi fiziksel olgunlaşması tamamlandı. Sistem bekleme moduna geçiyor.");
        pauseBtn.disabled = true;
        exoFrame.classList.remove('active');
    }

    // Kontrol Butonları
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        exoFrame.classList.add('active');
        addLog("TITAN CRADLE protokolü başlatıldı. Biyo-jel doygunluğu ve metabolik hızlandırıcılar aktif.");
        runSimulation();
    });

    pauseBtn.addEventListener('click', () => {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(simulationInterval);
        startBtn.textContent = "Devam Et";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        systemStatus.textContent = "SİSTEM DURAKLATILDI";
        exoFrame.classList.remove('active');
        addLog("Simülasyon manuel olarak duraklatıldı.");
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(simulationInterval);
        isRunning = false;
        time = 0;
        simState = { ...initialState };
        updateDOM();
        
        startBtn.textContent = "Protokolü Başlat";
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        exoFrame.classList.remove('active');

        logList.innerHTML = '<li>Simülasyon sıfırlandı ve başlatılmaya hazır.</li>';
        systemStatus.textContent = "BEKLEMEDE";
    });

if (window.opener) {
    window.opener.postMessage({ tool: 'TITAN_CRADLE', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;

    // İlk durumu arayüze yansıt
    updateDOM();
});