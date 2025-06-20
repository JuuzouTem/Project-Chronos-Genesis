document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENTLERİ ---
    const dayCounter = document.getElementById('day-counter');
    const phaseName = document.getElementById('phase-name');
    const cellCount = document.getElementById('cell-count');
    const dnaIntegrity = document.getElementById('dna-integrity');
    const telomeraseStatus = document.getElementById('telomerase-status');
    const dependencyTreeContainer = document.getElementById('dependency-tree');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const completionMessage = document.getElementById('completion-message');

    // --- SİMÜLASYON PARAMETRELERİ ---
    const SIM_SPEED_MS = 300; // Her gün arasındaki milisaniye (daha hızlı simülasyon için düşürün)
    const TOTAL_DAYS = 45;

    // --- GÖREV VERİTABANI (BAĞIMLILIK AĞACI) ---
    // status: 'pending', 'active', 'completed'
    // dependencies: Bu görevin başlaması için tamamlanması gereken görevlerin ID'leri
    const tasks = [
        // Faz 1: Hücresel Çoğalma (Gün 1-10)
        { id: 1, name: 'Büyüme Faktörü Kokteyli Salgılama', startDay: 1, duration: 10, dependencies: [], status: 'pending', phase: 1 },
        { id: 2, name: 'Telomeraz Aktivatörünü Etkinleştir', startDay: 1, duration: 10, dependencies: [], status: 'pending', phase: 1 },
        { id: 3, name: 'Hızlı Hücre Bölünmesi Protokolü', startDay: 2, duration: 8, dependencies: [1, 2], status: 'pending', phase: 1 },

        // Faz 2: Paralel Organogenez (Gün 11-30)
        { id: 4, name: 'Hox Geni Aktivasyon Serumları Hazırlanıyor', startDay: 11, duration: 2, dependencies: [3], status: 'pending', phase: 2 },
        { id: 5, name: 'Kardiyovasküler Sistem Başlatma (Kalp Tüpü)', startDay: 13, duration: 10, dependencies: [4], status: 'pending', phase: 2, visualId: 'organ-cardiovascular' },
        { id: 6, name: 'Merkezi Sinir Sistemi Başlatma (Nöral Plak)', startDay: 13, duration: 12, dependencies: [4], status: 'pending', phase: 2, visualId: 'organ-nervous' },
        { id: 7, name: 'İskelet Sistemi Temeli (Somit Oluşumu)', startDay: 15, duration: 15, dependencies: [4], status: 'pending', phase: 2, visualId: 'organ-skeletal' },
        { id: 8, name: 'Solunum Sistemi Başlangıcı (Akciğer Tomurcuğu)', startDay: 18, duration: 10, dependencies: [4], status: 'pending', phase: 2, visualId: 'organ-respiratory' },
        { id: 9, name: 'Surfaktan Üreten Genlerin Aktivasyonu', startDay: 25, duration: 5, dependencies: [8], status: 'pending', phase: 2 },

        // Faz 3: Sistem Entegrasyonu ve Test (Gün 31-45)
        { id: 10, name: 'Sinir Büyüme Faktörü (NGF) Salgılama', startDay: 31, duration: 10, dependencies: [6, 7], status: 'pending', phase: 3 },
        { id: 11, name: 'Nöral "Kablolama": Sinir-Kas Bağlantıları', startDay: 33, duration: 10, dependencies: [10], status: 'pending', phase: 3 },
        { id: 12, name: 'Kalp Odacıklarının Olgunlaşması', startDay: 31, duration: 5, dependencies: [5], status: 'pending', phase: 3 },
        { id: 13, name: 'Dolaşım Sistemi Test Pompalaması', startDay: 36, duration: 5, dependencies: [12, 11], status: 'pending', phase: 3 },
        { id: 14, name: 'Akciğer Alveollerinin Olgunlaşması', startDay: 32, duration: 8, dependencies: [9], status: 'pending', phase: 3 },
        { id: 15, name: 'Sistem Kalibrasyonu ve Son Kontroller', startDay: 41, duration: 5, dependencies: [13, 14], status: 'pending', phase: 3 },
    ];

    let simulationState = {};
    let simulationInterval = null;

    // --- SİMÜLASYON YÖNETİMİ ---
    function initializeSimulation() {
        simulationState = {
            currentDay: 0,
            phase: 'BAŞLATILMADI',
            metrics: {
                cellCount: 0,
                dnaIntegrity: 100
            },
            tasks: JSON.parse(JSON.stringify(tasks)) // Görevlerin derin bir kopyasını oluştur
        };
        completionMessage.style.display = 'none';
        startBtn.disabled = false;
        startBtn.textContent = 'Simülasyonu Başlat';
        updateUI();
    }

    function startSimulation() {
        if (simulationInterval) { // Pause logic
            clearInterval(simulationInterval);
            simulationInterval = null;
            startBtn.textContent = 'Devam Et';
        } else { // Start/Resume logic
            startBtn.textContent = 'Durdur';
            simulationInterval = setInterval(tick, SIM_SPEED_MS);
        }
    }

    function resetSimulation() {
        clearInterval(simulationInterval);
        simulationInterval = null;
        initializeSimulation();
    }

    // --- ANA SİMÜLASYON DÖNGÜSÜ ---
    function tick() {
        simulationState.currentDay++;

        updatePhase();
        updateMetrics();
        processTasks();
        updateUI();

        if (simulationState.currentDay >= TOTAL_DAYS) {
            endSimulation();
        }
    }

    function endSimulation() {
        clearInterval(simulationInterval);
        simulationInterval = null;
        startBtn.disabled = true;
        completionMessage.style.display = 'block';
         // Tüm görevlerin tamamlandığından emin ol
        simulationState.tasks.forEach(task => {
            if(task.status !== 'completed') task.status = 'completed';
        });
        updateUI();
    }

    // --- MANTIK GÜNCELLEMELERİ ---
    function updatePhase() {
        const day = simulationState.currentDay;
        if (day >= 31) {
            simulationState.phase = 'SİSTEM ENTEGRASYONU & TEST';
        } else if (day >= 11) {
            simulationState.phase = 'PARALEL ORGANOGENEZ';
        } else if (day >= 1) {
            simulationState.phase = 'HÜCRESEL ÇOĞALMA';
        }
    }

    function updateMetrics() {
        const day = simulationState.currentDay;
        const metrics = simulationState.metrics;
        
        // Hücre Sayısı
        if (day <= 10) {
            metrics.cellCount = Math.floor(Math.pow(10, day / 1.5));
        } else if (day > 10 && day <= 30) {
             metrics.cellCount = Math.floor(Math.pow(10, 10 / 1.5)) + Math.floor(Math.pow(10, 5) * (day - 10));
        }
        
        // DNA Bütünlüğü (Telomeraz sayesinde %100'e yakın kalır)
        if (day > 1 && day <= 10) {
            metrics.dnaIntegrity = 99.9;
        } else {
            metrics.dnaIntegrity = 100;
        }
    }
    
    function processTasks() {
        simulationState.tasks.forEach(task => {
            if (task.status === 'pending') {
                const dependenciesMet = task.dependencies.every(depId => {
                    const dependentTask = simulationState.tasks.find(t => t.id === depId);
                    return dependentTask.status === 'completed';
                });

                if (dependenciesMet && simulationState.currentDay >= task.startDay) {
                    task.status = 'active';
                }
            } else if (task.status === 'active') {
                if (simulationState.currentDay >= task.startDay + task.duration) {
                    task.status = 'completed';
                }
            }
        });
    }


    // --- ARAYÜZ GÜNCELLEMELERİ ---
    function updateUI() {
        // Durum Paneli
        dayCounter.textContent = `${simulationState.currentDay} / ${TOTAL_DAYS}`;
        phaseName.textContent = simulationState.phase;
        cellCount.textContent = simulationState.metrics.cellCount.toLocaleString('tr-TR');
        dnaIntegrity.textContent = `${simulationState.metrics.dnaIntegrity}%`;

        const telomeraseTask = simulationState.tasks.find(t => t.id === 2);
        if (telomeraseTask.status === 'active') {
            telomeraseStatus.textContent = 'AKTİF';
            telomeraseStatus.classList.add('active');
        } else {
            telomeraseStatus.textContent = 'PASİF';
            telomeraseStatus.classList.remove('active');
        }
        
        renderDependencyTree();
        updateVisuals();
    }

    function renderDependencyTree() {
        dependencyTreeContainer.innerHTML = '';
        simulationState.tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `task ${task.status}`;
            
            const completionDay = task.startDay + task.duration;
            
            taskEl.innerHTML = `
                <div class="task-name">${task.name}</div>
                <div class="task-details">Plan: Gün ${task.startDay} - ${completionDay} | Durum: ${task.status.toUpperCase()}</div>
            `;
            dependencyTreeContainer.appendChild(taskEl);
        });
    }

    function updateVisuals() {
        simulationState.tasks.forEach(task => {
            if(task.visualId) {
                const organGroup = document.getElementById(task.visualId);
                if(organGroup) {
                    if (task.status === 'active' || task.status === 'completed') {
                         organGroup.classList.add('active');
                    } else {
                         organGroup.classList.remove('active');
                    }
                }
            }
        });

        // Temel form, Faz 1'de belirginleşir
        const baseForm = document.getElementById('base-form');
        if (simulationState.currentDay > 2) {
            baseForm.classList.add('active');
        } else {
            baseForm.classList.remove('active');
        }
    }

if (window.opener) {
    window.opener.postMessage({ tool: 'CHRONOS_ENGINE', status: 'success' }, '*');
}
// --- BİTİŞ ---

isSimulationRunning = false;
startButton.disabled = false;

    // --- OLAY DİNLEYİCİLERİ ---
    startBtn.addEventListener('click', startSimulation);
    resetBtn.addEventListener('click', resetSimulation);

    // --- BAŞLANGIÇ ---
    initializeSimulation();
});