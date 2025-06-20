document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT REFERANSLARI ---
    const behaviorSelect = document.getElementById('behavior-select');
    const modulationTypeRadios = document.getElementsByName('modulation_type');
    const intensitySlider = document.getElementById('intensity-slider');
    const intensityValue = document.getElementById('intensity-value');
    const initiateButton = document.getElementById('initiate-procedure');
    const logOutput = document.getElementById('log-output');
    const brainMap = document.getElementById('brain-map');
    const nanobotStream = document.getElementById('nanobot-stream');
    const statusOverlay = document.getElementById('status-overlay');
    const resultsDisplay = document.getElementById('results-display');
    const resultText = document.getElementById('result-text');

    // --- OLAY DİNLEYİCİLERİ ---
    intensitySlider.addEventListener('input', () => {
        intensityValue.textContent = `${intensitySlider.value}%`;
    });

    initiateButton.addEventListener('click', runSimulation);

    // --- YARDIMCI FONKSİYONLAR ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const logMessage = (message, className = 'log-info') => {
        const p = document.createElement('p');
        p.textContent = message;
        p.className = className;
        logOutput.appendChild(p);
        logOutput.scrollTop = logOutput.scrollHeight; // Otomatik aşağı kaydır
    };

    const clearPreviousRun = () => {
        logOutput.innerHTML = '';
        brainMap.querySelectorAll('.neuron').forEach(n => n.remove());
        resultsDisplay.style.display = 'none';
        resultText.textContent = '';
        statusOverlay.textContent = 'SİSTEM BEKLEMEDE';
        statusOverlay.style.opacity = '0.5';
    };
    
    // --- SİMÜLASYON ANA FONKSİYONU ---
    async function runSimulation() {
        // 1. Arayüzü kilitle ve temizle
        initiateButton.disabled = true;
        clearPreviousRun();
        await sleep(500);

        // 2. Kullanıcı girdilerini al
        const targetBehavior = behaviorSelect.options[behaviorSelect.selectedIndex].text;
        const modulationTypeValue = document.querySelector('input[name="modulation_type"]:checked').value;
        const intensity = intensitySlider.value;
        
        logMessage('Prosedür başlatılıyor...', 'log-system');
        await sleep(1000);

        // --- AŞAMA 1: HARİTALAMA ---
        statusOverlay.textContent = 'HARİTALAMA...';
        statusOverlay.style.opacity = '1';
        logMessage(`AŞAMA 1: NÖRAL HARİTALAMA BAŞLATILDI`);
        logMessage(`Hedef: ${targetBehavior} ile ilişkili nöron ağları taranıyor...`, 'log-warning');
        
        // Rastgele pozisyonlarda "nöron" elementleri oluştur
        const neuronCount = Math.floor(Math.random() * 5) + 8; // 8-12 arası nöron
        const neurons = [];
        for (let i = 0; i < neuronCount; i++) {
            const neuron = document.createElement('div');
            neuron.className = 'neuron';
            neuron.style.top = `${Math.random() * 80 + 10}%`; // %10 ile %90 arasında
            neuron.style.left = `${Math.random() * 80 + 10}%`;
            brainMap.appendChild(neuron);
            neurons.push(neuron);
        }

        await sleep(2000);
        
        neurons.forEach(n => n.classList.add('active'));
        logMessage('Hedef nöron grupları başarıyla haritalandı ve izole edildi.', 'log-success');
        await sleep(1500);

        // --- AŞAMA 2: HEDEFLEME ---
        statusOverlay.textContent = 'HEDEFLEME...';
        logMessage('AŞAMA 2: NANOBOT HEDEFLEME BAŞLATILDI');
        logMessage('Programlanmış nanobotlar kan dolaşımına enjekte ediliyor...');
        await sleep(1000);
        logMessage('Odaklanmış sonik alan aktive edildi. Nanobotlar hedefe yönlendiriliyor.', 'log-warning');
        
        // Nanobot akış animasyonunu tetikle
        for(let i=0; i<30; i++) {
            const nanobot = document.createElement('div');
            nanobot.className = 'nanobot';
            nanobot.style.top = `${Math.random() * 100}%`;
            nanobot.style.animationDelay = `${Math.random() * 1.5}s`;
            nanobotStream.appendChild(nanobot);
        }
        
        await sleep(2500);
        nanobotStream.innerHTML = ''; // Animasyon sonrası temizle
        logMessage('Nanobotlar hedef nöronlara başarıyla ulaştı.', 'log-success');
        await sleep(1500);
        
        // --- AŞAMA 3: MODÜLASYON ---
        statusOverlay.textContent = 'MODÜLASYON...';
        logMessage('AŞAMA 3: EPİGENETİK MODÜLASYON BAŞLATILDI');
        const cargoType = modulationTypeValue === 'Susturma' ? 'Susturucu (Metil Grubu)' : 'Güçlendirici (Asetil Grubu)';
        logMessage(`Epigenetik kargo bırakılıyor: ${cargoType}`, 'log-warning');

        await sleep(2000);
        neurons.forEach(n => n.classList.add('modulated')); // Nöronların rengini değiştir
        logMessage('Epigenetik işaretleyiciler hedeflenen gen bölgelerine yerleştirildi.', 'log-success');
        await sleep(1000);
        
        // --- SONUÇLAR ---
        statusOverlay.textContent = 'PROSEDÜR TAMAMLANDI';
        logMessage('Modülasyon tamamlandı. Nöral aktivite stabil.', 'log-system');
        
        // Sonuç metnini oluştur
        let resultVerb = modulationTypeValue === 'Susturma' ? 'azaltıldı' : 'artırıldı';
        let resultNoun = modulationTypeValue === 'Susturma' ? 'baskılandı' : 'güçlendirildi';
        resultText.textContent = `${targetBehavior} ile ilişkili nöral devrenin aktivasyonu %${intensity} oranında ${resultVerb}. Davranışsal eğilim kalıcı fakat geri döndürülebilir şekilde ${resultNoun}.`;

        resultsDisplay.style.display = 'block';
        logOutput.scrollTop = logOutput.scrollHeight;

        // Arayüzü tekrar aktif et
        initiateButton.disabled = false;
    }

if (window.opener) {
    window.opener.postMessage({ tool: 'MORPHEUS_LENS', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;

});