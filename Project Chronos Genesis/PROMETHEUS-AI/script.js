document.addEventListener('DOMContentLoaded', () => {
    // --- Element Seçimleri ---
    const startBtn = document.getElementById('start-simulation-btn');
    const resetBtn = document.getElementById('reset-btn');
    const controlPanel = document.getElementById('control-panel');
    const simulationStages = document.getElementById('simulation-stages');
    const resultsPanel = document.getElementById('results-panel');
    const logOutput = document.getElementById('log-output');

    // Aşama Panelleri
    const stageSynthesis = document.getElementById('stage-synthesis');
    const stageEvolution = document.getElementById('stage-evolution');
    const stageIntegration = document.getElementById('stage-integration');
    
    // Durum ve İlerleme Elementleri
    const synthesisStatus = document.getElementById('synthesis-status');
    const synthesisProgress = document.getElementById('synthesis-progress');
    const geneSequenceOutput = document.getElementById('gene-sequence-output');

    const evolutionStatus = document.getElementById('evolution-status');
    const evolutionProgress = document.getElementById('evolution-progress');

    const integrationStatus = document.getElementById('integration-status');
    const integrationProgress = document.getElementById('integration-progress');

    // Sonuç Elementleri
    const proteinViewerDiv = document.getElementById('protein-viewer');
    const finalGeneCode = document.getElementById('final-gene-code');
    const geneProperties = document.getElementById('gene-properties');

    // --- Simülasyon Fonksiyonları ---

    // Log konsoluna mesaj yazdırır
    const log = (message, type = 'info') => {
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        p.className = `log-${type}`;
        logOutput.appendChild(p);
        logOutput.scrollTop = logOutput.scrollHeight;
    };

    // Zaman gecikmesi için yardımcı fonksiyon
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Rastgele bir gen dizilimi oluşturur
    const generateGeneSequence = (length) => {
        const bases = 'ATCG';
        let sequence = '';
        for (let i = 0; i < length; i++) {
            sequence += bases.charAt(Math.floor(Math.random() * bases.length));
        }
        return sequence;
    };

    // Metni yavaşça yazdırır (daktilo efekti)
    const typeWriter = async (element, text, speed = 1) => {
        element.innerHTML = "";
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await sleep(speed);
        }
    };
    
    // İlerleme çubuğunu doldurur
    const runProgressBar = async (progressBarElem, duration) => {
        const steps = 100;
        const stepTime = duration / steps;
        for (let i = 0; i <= steps; i++) {
            progressBarElem.style.width = `${i}%`;
            await sleep(stepTime);
        }
    };

    // --- Aşamalar ---

    async function runSynthesis() {
        stageSynthesis.classList.add('visible');
        log('Aşama 1: Yaratıcı Sentez başlatıldı.', 'process');
        
        synthesisStatus.textContent = "Gezegensel veri gölüne bağlanılıyor...";
        await sleep(1500);
        
        synthesisStatus.textContent = "Üretken Çekişmeli Ağlar (GANs) kalibre ediliyor...";
        runProgressBar(synthesisProgress, 5000);
        await sleep(2000);
        
        log('GAN Jeneratör/Diskriminatör kaybı optimize ediliyor...', 'info');
        synthesisStatus.textContent = "Kavramsal biyolojik kurallar derleniyor...";
        await sleep(2500);
        
        synthesisStatus.textContent = "Potansiyel gen dizilimleri 'hayal ediliyor'...";
        const tempGene = generateGeneSequence(500);
        await typeWriter(geneSequenceOutput, tempGene);
        log('İlk potansiyel gen adayı G-PRO-v0.1 oluşturuldu.', 'success');
    }

    async function runEvolution() {
        stageEvolution.classList.add('visible');
        log('Aşama 2: Sanal Evrim başlatıldı.', 'process');
        
        evolutionStatus.textContent = 'Kuantum kimya simülatörleri etkinleştiriliyor...';
        await sleep(2000);
        
        evolutionStatus.textContent = 'Ultra-gerçekçi sanal hücre ortamı oluşturuluyor...';
        runProgressBar(evolutionProgress, 6000);
        await sleep(2500);
        log('Sanal ortam stabil. Konak metabolomik verileri yüklendi.', 'info');
        
        evolutionStatus.textContent = 'Milyonlarca varyant evrimsel baskı altında test ediliyor...';
        await sleep(3500);
        
        log('Evrimsel stabilite ve toksisite testleri tamamlandı.', 'success');
        evolutionStatus.textContent = 'En uygun varyant seçildi.';
    }

    async function runIntegration() {
        stageIntegration.classList.add('visible');
        log('Aşama 3: Entegrasyon Planlama başlatıldı.', 'process');
        
        integrationStatus.textContent = 'Konak genom (İnsan Ref. GRCh38) analiz ediliyor...';
        await sleep(2000);
        
        integrationStatus.textContent = 'Epigenetik ve kromatin erişilebilirlik haritaları taranıyor...';
        runProgressBar(integrationProgress, 4000);
        await sleep(2500);
        log('Güvenli liman bölgeleri (Safe Harbor Sites) belirlendi.', 'info');
        
        integrationStatus.textContent = 'Optimal entegrasyon vektörü ve yöntemi hesaplanıyor.';
        await sleep(1500);
        
        log('Entegrasyon haritası oluşturuldu: Chr 8, 8q24.21.', 'success');
        integrationStatus.textContent = 'Entegrasyon planı tamamlandı.';
    }

    function showResults() {
        resultsPanel.classList.remove('hidden');
        resultsPanel.classList.add('visible');
        log('Simülasyon başarıyla tamamlandı. Sonuçlar gösteriliyor.', 'success');

        // 3D Protein Görüntüleyiciyi Başlat (3Dmol.js)
        // Örnek olarak Mavi Floresan Proteini (PDB: 2VWW) kullanıyoruz
        let viewer = $3Dmol.createViewer(proteinViewerDiv);
        $3Dmol.download("pdb:2VWW", viewer, {
            multimodel: true,
            modelspec: {
                split: true
            }
        }, function() {
            viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
            viewer.render();
            viewer.zoomTo();
        });

        // Nihai Gen Kodunu ve Özelliklerini Göster
        const finalGene = generateGeneSequence(1250);
        finalGeneCode.textContent = finalGene;

        geneProperties.innerHTML = `
            <li><strong>Uzunluk:</strong> ${finalGene.length} baz çifti</li>
            <li><strong>Tahmini Protein Ağırlığı:</strong> 41.6 kDa</li>
            <li><strong>İfade Verimliliği (Sanal):</strong> %98.7</li>
            <li><strong>Toksisite (Sanal):</strong> Düşük (<0.01%)</li>
            <li><strong>Evrimsel Stabilite:</strong> Yüksek (Yarı Ömür > 1000 nesil)</li>
            <li><strong>Hedef Fonksiyon:</strong> Mavi Pigment (λmax ≈ 620nm)</li>
        `;
    }

    // --- Ana Simülasyon Akışı ---
    const startSimulation = async () => {
        // Arayüzü sıfırla ve hazırla
        startBtn.disabled = true;
        controlPanel.style.opacity = '0.5';
        simulationStages.classList.remove('hidden');
        [stageSynthesis, stageEvolution, stageIntegration].forEach(s => {
            s.classList.remove('visible');
            s.querySelector('.progress-bar').style.width = '0%';
        });
        resultsPanel.classList.add('hidden');
        logOutput.innerHTML = '';
        
        const targetFunction = document.getElementById('target-function').value;
        log(`Yeni görev alındı. Hedef: "${targetFunction}"`, 'warning');

        await sleep(1000);
        await runSynthesis();
        
        await sleep(1000);
        await runEvolution();

        await sleep(1000);
        await runIntegration();
        
        await sleep(1000);
        showResults();
    };

    const resetSimulation = () => {
        startBtn.disabled = false;
        controlPanel.style.opacity = '1';
        simulationStages.classList.add('hidden');
        resultsPanel.classList.add('hidden');
        log('Sistem sıfırlandı. Yeni görev bekleniyor.', 'info');
    };

    // --- Olay Dinleyicileri ---
    startBtn.addEventListener('click', startSimulation);
    resetBtn.addEventListener('click', resetSimulation);

if (window.opener) {
    window.opener.postMessage({ tool: 'PROMETHEUS_AI', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;

});