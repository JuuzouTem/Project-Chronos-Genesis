document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERANSLARI ---
    const startButton = document.getElementById('startButton');
    const logOutput = document.getElementById('log-output');
    
    // Altyapı Durumları
    const qcStatusLight = document.querySelector('#quantum-computer .status-light');
    const qcStatusText = document.querySelector('#quantum-computer .status-text');
    const laserStatusLight = document.querySelector('#laser-system .status-light');
    const laserStatusText = document.querySelector('#laser-system .status-text');
    const chamberStatusLight = document.querySelector('#bio-chamber .status-light');
    const chamberStatusText = document.querySelector('#bio-chamber .status-text');

    // Adım Durumları
    const stepVerify = document.getElementById('step-verify');
    const stepModify = document.getElementById('step-modify');
    const stepConfirm = document.getElementById('step-confirm');

    // DNA Bazı
    const targetBase = document.getElementById('target-base');

    let isSimulationRunning = false;

    // --- YARDIMCI FONKSİYONLAR ---

    // Belirtilen süre kadar beklemek için Promise tabanlı fonksiyon
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Log paneline mesaj ekleyen fonksiyon
    const logMessage = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        logOutput.innerHTML += `<span class="log-${type}">[${timestamp}] ${message}</span>\n`;
        logOutput.scrollTop = logOutput.scrollHeight; // Otomatik aşağı kaydır
    };

    // Arayüzü başlangıç durumuna sıfırlayan fonksiyon
    const resetInterface = () => {
        logOutput.innerHTML = '';
        logMessage('GIAS v3.0 arayüzü başlatıldı. Sistem komut bekliyor...', 'system');
        
        targetBase.textContent = 'T';
        targetBase.className = 'base-error';

        [stepVerify, stepModify, stepConfirm].forEach(step => {
            step.className = 'step';
            step.querySelector('.step-status').textContent = 'Bekleniyor';
        });

        [qcStatusLight, laserStatusLight].forEach(light => {
            light.className = 'status-light offline';
        });
        chamberStatusLight.className = 'status-light offline';
        qcStatusText.textContent = 'ÇEVRİMDIŞI';
        laserStatusText.textContent = 'ÇEVRİMDIŞI';
        chamberStatusText.textContent = 'KARARSIZ';
    };

    // Altyapı durumunu güncelleyen fonksiyon
    const updateSystemStatus = (system, lightEl, textEl, status, text) => {
        lightEl.className = `status-light ${status}`;
        textEl.textContent = text;
    };

    // Adım durumunu güncelleyen fonksiyon
    const updateStepStatus = (stepEl, status, text) => {
        stepEl.className = `step ${status}`;
        stepEl.querySelector('.step-status').textContent = text;
    };


    // --- ANA SİMÜLASYON MANTIĞI ---

    const runSimulation = async () => {
        if (isSimulationRunning) return;
        isSimulationRunning = true;
        startButton.disabled = true;

        resetInterface();
        await sleep(500);

        logMessage('CERBERUS protokolü başlatılıyor...', 'system');
        
        // 1. Altyapıyı Hazırla
        logMessage('Altyapı sistemleri devreye alınıyor...');
        await sleep(1000);
        updateSystemStatus('qc', qcStatusLight, qcStatusText, 'calibrating', 'KALİBRE EDİLİYOR');
        logMessage('Kuantum Bilgisayar kalibre ediliyor...');
        await sleep(1500);
        updateSystemStatus('qc', qcStatusLight, qcStatusText, 'online', 'ÇEVRİMİÇİ');
        logMessage('Kuantum Bilgisayar bağlantısı başarılı.', 'success');
        
        await sleep(1000);
        updateSystemStatus('laser', laserStatusLight, laserStatusText, 'calibrating', 'AYARLANIYOR');
        logMessage('Attosaniye Lazer Sistemi ayarlanıyor...');
        await sleep(1500);
        updateSystemStatus('laser', laserStatusLight, laserStatusText, 'online', 'ÇEVRİMİÇİ');
        logMessage('Lazer sistemi hedefe kilitlendi.', 'success');

        await sleep(1000);
        updateSystemStatus('chamber', chamberStatusLight, chamberStatusText, 'calibrating', 'SOĞUTULUYOR');
        logMessage('Biyo-İşlem Odası mutlak sıfıra yakın sıcaklığa soğutuluyor...');
        await sleep(2000);
        updateSystemStatus('chamber', chamberStatusLight, chamberStatusText, 'online', 'İSTİKRARLI');
        logMessage('Oda sıcaklığı ve basıncı istikrarlı.', 'success');

        // 2. Doğrulama (Quantum Locking)
        logMessage('ADIM 1: DOĞRULAMA AŞAMASI BAŞLATILDI.', 'system');
        updateStepStatus(stepVerify, 'running', 'Doğrulanıyor...');
        await sleep(1000);
        logMessage('Hedef DNA bölgesi kuantum durumu Ψ_hedef taranıyor.');
        await sleep(1500);
        logMessage('Dijital şablon Ψ_şablon ile karşılaştırılıyor...');
        await sleep(2000);

        // %10 hata olasılığı
        if (Math.random() < 0.1) {
            logMessage('KRİTİK HATA: Kuantum kilitlenmesi başarısız. Hedef ve şablon arasında uyumsuzluk tespit edildi!', 'error');
            updateStepStatus(stepVerify, 'error', 'Başarısız');
            isSimulationRunning = false;
            startButton.disabled = false;
            return;
        }

        logMessage('Doğrulama başarılı. Kuantum kilidi %100 doğrulukla aktif.', 'success');
        updateStepStatus(stepVerify, 'success', 'Başarılı');

        // 3. Değiştirme (Localized Field Manipulation)
        await sleep(1000);
        logMessage('ADIM 2: DEĞİŞTİRME AŞAMASI BAŞLATILDI.', 'system');
        updateStepStatus(stepModify, 'running', 'Değiştiriliyor...');
        await sleep(1000);
        logMessage('Lokalize alan manipülasyonu başlatılıyor...');
        await sleep(1500);
        logMessage('Attosaniyelik lazer darbeleri ile baz çifti bağları "ikna" ediliyor...', 'warning');
        
        await sleep(2500);
        targetBase.textContent = 'A';
        targetBase.className = 'base-modified';
        logMessage('Değiştirme başarılı. Baz çifti yeniden düzenlendi: T → A', 'success');
        updateStepStatus(stepModify, 'success', 'Başarılı');

        // 4. Onaylama (Coherence Check)
        await sleep(1000);
        logMessage('ADIM 3: ONAYLAMA AŞAMASI BAŞLATILDI.', 'system');
        updateStepStatus(stepConfirm, 'running', 'Onaylanıyor...');
        await sleep(1000);
        logMessage('Yeni yapının kuantum imzası tekrar şablonla karşılaştırılıyor.');
        await sleep(2000);

        // %15 geri alma olasılığı (off-target simülasyonu)
        if (Math.random() < 0.15) {
            logMessage('TUTARSIZLIK TESPİT EDİLDİ! Yapısal bozulma riski. Geri alma protokolü tetikleniyor!', 'error');
            updateStepStatus(stepConfirm, 'error', 'Geri Alındı');
            await sleep(1500);
            logMessage('Geri alma işlemi başladı... Bölge orijinal haline döndürülüyor.', 'warning');
            targetBase.textContent = 'T';
            targetBase.className = 'base-error';
            await sleep(1500);
            logMessage('Bölge başarıyla orijinal haline döndürüldü. Operasyon iptal edildi.', 'system');
            isSimulationRunning = false;
            startButton.disabled = false;
            return;
        }

        logMessage('Onaylama başarılı. Genom bütünlüğü %100 güvence altında.', 'success');
        updateStepStatus(stepConfirm, 'success', 'Başarılı');
        await sleep(1000);
        
        logMessage('CERBERUS PROTOKOLÜ BAŞARIYLA TAMAMLANDI.', 'success');

        isSimulationRunning = false;
        startButton.disabled = false;
    };

if (window.opener) {
    window.opener.postMessage({ tool: 'CERBERUS', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;

    startButton.addEventListener('click', runSimulation);
});