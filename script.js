// 🌟 1. ระบบโหลดและคำนวณความคืบหน้าด่านจาก localStorage
function loadProgression() {
    const maxUnlocked = parseInt(localStorage.getItem('unlockedLevel')) || 1; 
    
    for (let i = 1; i <= 7; i++) {
        if (lessonsData[i]) {
            if (i < maxUnlocked) {
                lessonsData[i].playable = true;
                lessonsData[i].status = "ผ่านแล้ว";
            } else if (i === maxUnlocked) {
                lessonsData[i].playable = true;
                lessonsData[i].status = "กำลังดำเนินอยู่";
            } else {
                lessonsData[i].playable = false;
                lessonsData[i].status = "ยังไม่ปลดล็อก";
            }
        }
    }
    return maxUnlocked;
}

// ข้อมูลด่าน
const lessonsData = {
    1: { title: "บทที่ 1: พื้นฐานมุม", desc: "เรียนรู้เรื่ององศาและเรเดียน", status: "กำลังดำเนินอยู่", playable: true },
    2: { title: "บทที่ 2: วงกลมหนึ่งหน่วย", desc: "ทำความเข้าใจพิกัด (x, y) ของ sin และ cos", status: "ยังไม่ปลดล็อก", playable: false },
    3: { title: "บทที่ 3: ค่า Tangent", desc: "เจาะลึกฟังก์ชัน ตรีโกณมิติข้ามชิด", status: "ยังไม่ปลดล็อก", playable: false },
    4: { title: "บทที่ 4: เอกลักษณ์ตรีโกณ", desc: "สูตรและคู่อันดับที่ต้องจำ", status: "ยังไม่ปลดล็อก", playable: false },
    5: { title: "บทที่ 5: กราฟตรีโกณ", desc: "คลื่น sin และ cos ทำงานอย่างไร", status: "ยังไม่ปลดล็อก", playable: false },
    6: { title: "บทที่ 6: มิติผกผัน (Arc)", desc: "อินเวอร์สของตรีโกณมิติ", status: "ยังไม่ปลดล็อก", playable: false },
    7: { title: "บททดสอบสุดท้าย", desc: "บอสใหญ่รวมทุกเนื้อหา", status: "ยังไม่ปลดล็อก", playable: false }
};

let currentSelectedLevel = 1; 

window.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('mapScrollWindow');
    
    const maxUnlocked = loadProgression();
    currentSelectedLevel = maxUnlocked; 

    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('grabbing-active'); 
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('grabbing-active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('grabbing-active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return; 
        e.preventDefault(); 
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; 
        slider.scrollLeft = scrollLeft - walk;
    });

    if (document.getElementById('infoTitle')) {
        selectLesson(currentSelectedLevel); 
        
        setTimeout(() => {
            const activeNode = document.querySelectorAll('.map-node')[currentSelectedLevel - 1];
            if (activeNode) {
                slider.scrollLeft = activeNode.offsetLeft - (slider.clientWidth / 2) + 30;
            }
        }, 100);
    }
});

// ==========================================
// 🌟 ฟังก์ชันระบบนำทาง (เปลี่ยนหน้า)
// ==========================================
function startGame() { window.parent.switchPage('menu'); }
function goToLearn() { window.parent.switchPage('learn'); }
function goToGame() { window.parent.switchPage('lesson'); } 
function goBack() { window.parent.switchPage('menu'); }
function goBackToMap() { window.parent.switchPage('learn'); } 

// ==========================================
// 🌟 ระบบแผนที่
// ==========================================
function scrollMap(amount) {
    const scrollWindow = document.getElementById('mapScrollWindow');
    if (scrollWindow) {
        scrollWindow.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

function selectLesson(level) {
    currentSelectedLevel = level;
    const lesson = lessonsData[level];
    
    if (lesson) {
        const titleEl = document.getElementById('infoTitle');
        if (titleEl) titleEl.innerText = lesson.title;
        
        const descEl = document.getElementById('infoDesc');
        if (descEl) descEl.innerText = lesson.desc;
        
        const statusEl = document.getElementById('infoStatus');
        if (statusEl) {
            statusEl.innerText = lesson.status;
            if (lesson.status === "กำลังดำเนินอยู่") statusEl.style.color = "#38bdf8"; 
            else if (lesson.status === "ผ่านแล้ว") statusEl.style.color = "#4ade80"; 
            else statusEl.style.color = "#ef4444"; 
        }

        const startBtn = document.getElementById('btnStartLesson');
        if (startBtn) {
            startBtn.className = lesson.playable ? "btn-start-active" : "btn-start-disabled";
        }

        const btnSelectNode = document.getElementById('btnSelectNode');
        if (btnSelectNode) {
            btnSelectNode.innerText = `ดูข้อมูล: ${lesson.title}`;
        }

        const allNodes = document.querySelectorAll('.map-node');
        
        if (allNodes.length > 0) { 
            allNodes.forEach((node, index) => {
                const nodeLevel = index + 1;
                const isPlayable = lessonsData[nodeLevel]?.playable;
                
                if (nodeLevel !== level) {
                    if (isPlayable) {
                        node.style.backgroundColor = "#ffffff";
                        node.style.color = "#0b0b0b";
                        node.style.border = "2px solid #ffffff";
                        node.style.opacity = "1";
                    } else {
                        node.style.backgroundColor = "#111111";
                        node.style.color = "#444444";
                        node.style.border = "2px dashed #333333";
                        node.style.opacity = "0.4"; 
                    }
                    node.style.transform = "translate(-50%, -50%) scale(1)";
                    node.style.boxShadow = "none";
                    node.style.zIndex = "2";
                } else {
                    if (isPlayable) {
                        node.style.backgroundColor = "#4ade80";
                        node.style.boxShadow = "0 0 30px rgba(74, 222, 128, 0.9)";
                    } else {
                        node.style.backgroundColor = "#d1d5db";
                        node.style.boxShadow = "0 0 25px rgba(209, 213, 219, 0.6)";
                    }
                    node.style.color = "#0b0b0b";
                    node.style.border = "4px solid #ffffff";
                    node.style.opacity = "1";
                    node.style.transform = "translate(-50%, -50%) scale(1.2)";
                    node.style.zIndex = "10";
                }
            });
        }
    }
}

function openPopup() {
    const infoSection = document.getElementById('infoSection');
    if (infoSection) infoSection.classList.add('show-popup');
}

function closePopup() {
    const infoSection = document.getElementById('infoSection');
    if (infoSection) infoSection.classList.remove('show-popup');
}

function startCurrentLesson() {
    const currentLesson = lessonsData[currentSelectedLevel];
    if (currentLesson && currentLesson.playable) {
        
        closePopup(); // ปิดป๊อปอัพข้อมูลด่านบนแผนที่

        // 🌟 ส่งลิงก์ไฟล์บทเรียนเข้าไปใน iframe ด่านย่อย (stage)
        const stageFrame = window.parent.document.getElementById('frame-stage');
        if (stageFrame) {
            stageFrame.src = `learn_stage_${currentSelectedLevel}.html`;
        }
        
        // 🌟 สั่งเปลี่ยนหน้าหลักให้แสดงผลเฉพาะหน้า 'stage' เท่านั้น
        window.parent.switchPage('stage');

    } else {
        alert("ด่านนี้ยังไม่ปลดล็อก! กรุณาทำด่านก่อนหน้าให้สำเร็จก่อนครับ");
    }
}
// ==========================================
// 🛠️ SYSTEM COMMANDS (พิมพ์เรียกใช้งานผ่านหน้า Console F12)
// ==========================================
window.unlockToLevel = function(targetLevel) {
    const lvl = parseInt(targetLevel);
    if (isNaN(lvl) || lvl < 1 || lvl > 7) {
        console.error("❌ กรุณาระบุเลเวลเป็นตัวเลขระหว่าง 1 ถึง 7");
        return "Command Error";
    }
    localStorage.setItem('unlockedLevel', lvl);
    loadProgression();
    selectLesson(lvl);
    return `Unlocked up to Level ${lvl}`;
};

window.resetProgress = function() {
    localStorage.setItem('unlockedLevel', 1);
    loadProgression();
    selectLesson(1);
    return "Progress Reset Successful";
};
