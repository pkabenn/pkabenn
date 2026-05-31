// ==========================================
// 1. ฟังก์ชันสำหรับเปลี่ยนหน้า (พร้อมระบบสำรองกันพัง)
// ==========================================
function startGame() {
    if (window.parent && typeof window.parent.switchPage === 'function') {
        window.parent.switchPage('menu'); // เปลี่ยนแบบทันที (SPA)
    } else {
        window.location.href = 'menu.html'; // ระบบสำรอง: เปลี่ยนหน้าแบบปกติ
    }
}

function goToLearn() {
    if (window.parent && typeof window.parent.switchPage === 'function') {
        window.parent.switchPage('learn');
    } else {
        window.location.href = 'learn.html';
    }
}

function goBack() {
    if (window.parent && typeof window.parent.switchPage === 'function') {
        window.parent.switchPage('menu');
    } else {
        window.location.href = 'menu.html';
    }
}

function goToGame() {
    alert("กำลังเข้าสู่หมวด: 🎮 เล่นเกมท้าทาย (อยู่ระหว่างพัฒนา)");
}

// ==========================================
// 2. ฟังก์ชันระบบแผนที่และการแสดงผลในหน้า Learn
// ==========================================
let currentSelectedLevel = 1; // ตั้งค่าเริ่มต้นให้ด่าน 1

const lessonsData = {
    1: { title: "บทที่ 1: องศาและเรเดียน", desc: "เริ่มต้นการเดินทางด้วยพื้นฐานการวัดมุม...", status: "🔓 ปลดล็อกแล้ว", playable: true },
    2: { title: "บทที่ 2: วงกลมหนึ่งหน่วย", desc: "แกนหลักของตรีโกณมิติ...", status: "✨ ด่านปัจจุบัน", playable: true },
    3: { title: "บทที่ 3: ฟังก์ชันไซน์และโคไซน์", desc: "เจาะลึกความสัมพันธ์...", status: "🔒 ยังไม่ปลดล็อก", playable: false },
    4: { title: "บทที่ 4: กราฟของฟังก์ชันตรีโกณ", desc: "ศึกษารูปร่างลอนคลื่น...", status: "🔒 ยังไม่ปลดล็อก", playable: false },
    5: { title: "บทที่ 5: เอกลักษณ์ตรีโกณมิติ", desc: "รวบรวมสูตรลัด...", status: "🔒 ยังไม่ปลดล็อก", playable: false },
    6: { title: "บทที่ 6: สมการตรีโกณมิติ", desc: "ด่านสุดท้ายก่อนบอสใหญ่...", status: "🔒 ยังไม่ปลดล็อก", playable: false },
    7: { title: "FINAL BOSS: ล่าขุมทรัพย์ตรีโกณ", desc: "บททดสอบมหาโหด...", status: "🔒 ยังไม่ปลดล็อก", playable: false }
};

// 🌟 ฟังก์ชันใหม่: ควบคุมลูกศรซ้าย-ขวา เพื่อเปลี่ยนด่าน
function navigateLesson(step) {
    let newLevel = currentSelectedLevel + step;
    
    // ล็อกไว้ไม่ให้กดต่ำกว่าด่าน 1 หรือเกินด่าน 7
    if (newLevel < 1) newLevel = 1;
    if (newLevel > 7) newLevel = 7;
    
    selectLesson(newLevel);
}

// 🌟 ฟังก์ชันเลือกด่าน (อัปเกรดให้มีไฮไลต์และเลื่อนจออัตโนมัติ)
// 🌟 ฟังก์ชันเลือกด่าน (อัปเกรด: จัดการสีวงกลม ปลดล็อก/ล็อก อัตโนมัติ)
// 🌟 ฟังก์ชันเลือกด่าน (อัปเกรด: แยกสีเขียว/เทาอ่อน ตอนลูกศรชี้)
function selectLesson(level) {
    currentSelectedLevel = level;
    const lesson = lessonsData[level];
    
    if (lesson) {
        // 1. อัปเดตข้อความด้านขวา
        document.getElementById('infoTitle').innerText = lesson.title;
        document.getElementById('infoDesc').innerText = lesson.desc;
        document.getElementById('infoStatus').innerText = lesson.status;
        
        const statusElement = document.getElementById('infoStatus');
        if (level === 2) statusElement.style.color = "#38bdf8"; 
        else if (lesson.playable) statusElement.style.color = "#4ade80"; 
        else statusElement.style.color = "#ef4444"; 

        const startBtn = document.getElementById('btnStartLesson');
        startBtn.className = lesson.playable ? "btn-start-active" : "btn-start-disabled";

        // 2. จัดการระบายสีและสถานะของวงกลมทุกด่านบนแผนที่
        const allNodes = document.querySelectorAll('.map-node');
        allNodes.forEach((node, index) => {
            const nodeLevel = index + 1;
            const isPlayable = lessonsData[nodeLevel].playable; // เช็กว่าด่านนี้เล่นได้ไหม
            
            // --- กรณีที่ 1: วงกลมที่ "ไม่ได้ถูกเลือก" ---
            if (nodeLevel !== level) {
                if (isPlayable) {
                    // ด่านปลดล็อกแล้ว (สีขาวปกติ)
                    node.style.backgroundColor = "#ffffff";
                    node.style.color = "#0b0b0b";
                    node.style.border = "2px solid #ffffff";
                    node.style.opacity = "1";
                } else {
                    // ด่านที่ล็อกอยู่ (สีดำ ขอบเส้นประ จางลง)
                    node.style.backgroundColor = "#111111";
                    node.style.color = "#444444";
                    node.style.border = "2px dashed #333333";
                    node.style.opacity = "0.4"; 
                }
                
                // คืนค่าขนาดปกติ
                node.style.transform = "translate(-50%, -50%) scale(1)";
                node.style.boxShadow = "none";
                node.style.zIndex = "2";
                
            } 
            // --- กรณีที่ 2: วงกลมที่ "กำลังถูกเลือกอยู่" (เป้าหมายของลูกศร) ---
            else {
                if (isPlayable) {
                    // 🟢 ถ้าเล่นได้ -> ให้เป็นสีเขียวเด่นๆ
                    node.style.backgroundColor = "#4ade80";
                    node.style.boxShadow = "0 0 30px rgba(74, 222, 128, 0.9)";
                } else {
                    // ⚪ ถ้ายังล็อกอยู่ -> ให้เป็นสีเทาอ่อน (รู้ว่าเลือกอยู่ แต่ยังเข้าไม่ได้)
                    node.style.backgroundColor = "#d1d5db"; // สีเทาอ่อน
                    node.style.boxShadow = "0 0 25px rgba(209, 213, 219, 0.6)"; // แสงสีเทา
                }

                // เอฟเฟกต์ที่ใช้ร่วมกันตอนถูกเลือก (ขยายใหญ่ขึ้น)
                node.style.color = "#0b0b0b";
                node.style.border = "4px solid #ffffff";
                node.style.opacity = "1";
                node.style.transform = "translate(-50%, -50%) scale(1.2)";
                node.style.zIndex = "10";
                
                // 3. สั่งให้แผนที่เลื่อนไปตรงกลางด่านที่เลือกอัตโนมัติ
                const scrollWindow = document.getElementById('mapScrollWindow');
                if (scrollWindow) {
                    const nodeLeft = node.offsetLeft;
                    const windowWidth = scrollWindow.clientWidth;
                    scrollWindow.scrollTo({
                        left: nodeLeft - (windowWidth / 2) + 30,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
}
function startCurrentLesson() {
    if (currentSelectedLevel && lessonsData[currentSelectedLevel].playable) {
        alert("🎮 กำลังนำคุณเข้าสู่ " + lessonsData[currentSelectedLevel].title);
    }
}

// 🌟 สั่งให้หน้าเว็บเลือกด่านที่ 1 อัตโนมัติเมื่อเปิดหน้า Learn ขึ้นมา
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('mapScrollWindow')) {
        setTimeout(() => selectLesson(1), 100); 
    }
});