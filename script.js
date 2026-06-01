// 🌟 1. ข้อมูลด่านจำลองในระบบ
const lessonsData = {
    1: { title: "บทที่ 1: พื้นฐานมุม", desc: "เรียนรู้เรื่ององศาและเรเดียน", status: "ผ่านแล้ว", playable: true },
    2: { title: "บทที่ 2: วงกลมหนึ่งหน่วย", desc: "ทำความเข้าใจพิกัด (x, y) ของ sin และ cos", status: "กำลังดำเนินอยู่", playable: true },
    3: { title: "บทที่ 3: ค่า Tangent", desc: "เจาะลึกฟังก์ชัน ตรีโกณมิติข้ามชิด", status: "ยังไม่ปลดล็อก", playable: false },
    4: { title: "บทที่ 4: เอกลักษณ์ตรีโกณ", desc: "สูตรและคู่อันดับที่ต้องจำ", status: "ยังไม่ปลดล็อก", playable: false },
    5: { title: "บทที่ 5: กราฟตรีโกณ", desc: "คลื่น sin และ cos ทำงานอย่างไร", status: "ยังไม่ปลดล็อก", playable: false },
    6: { title: "บทที่ 6: มิติผกผัน (Arc)", desc: "อินเวอร์สของตรีโกณมิติ", status: "ยังไม่ปลดล็อก", playable: false },
    7: { title: "บททดสอบสุดท้าย", desc: "บอสใหญ่รวมทุกเนื้อหา", status: "ยังไม่ปลดล็อก", playable: false }
};

let currentSelectedLevel = 2; // เริ่มต้นที่ด่าน 2 ตาม HTML เดิม

// ฟังก์ชันสำหรับหน้า Start -> Menu
function startGame() { window.parent.switchPage('menu'); }

// ฟังก์ชันสำหรับหน้า Menu -> Learn
function goToLearn() { window.parent.switchPage('learn'); }

// ฟังก์ชันสำหรับหน้า Learn -> Menu
function goBack() { window.parent.switchPage('menu'); }

// ฟังก์ชันเลื่อนแผนที่ ซ้าย-ขวา
function scrollMap(amount) {
    const scrollWindow = document.getElementById('mapScrollWindow');
    if (scrollWindow) {
        scrollWindow.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

// 🌟 2. ฟังก์ชันเลือกด่าน (เปลี่ยนให้แสดงแค่ปุ่ม Select บนมือถือ ไม่เด้งป๊อปอัพทันที)
function selectLesson(level) {
    currentSelectedLevel = level;
    const lesson = lessonsData[level];
    
    if (lesson) {
        // อัปเดตข้อความในกล่องข้อมูลเตรียมไว้
        document.getElementById('infoTitle').innerText = lesson.title;
        document.getElementById('infoDesc').innerText = lesson.desc;
        document.getElementById('infoStatus').innerText = lesson.status;
        
        const statusElement = document.getElementById('infoStatus');
        if (level === 2) statusElement.style.color = "#38bdf8"; 
        else if (lesson.playable) statusElement.style.color = "#4ade80"; 
        else statusElement.style.color = "#ef4444"; 

        const startBtn = document.getElementById('btnStartLesson');
        startBtn.className = lesson.playable ? "btn-start-active" : "btn-start-disabled";

        // 📍 เปลี่ยนข้อความบนปุ่ม Select ให้เปลี่ยนตามด่านที่เลือก
        const btnSelectNode = document.getElementById('btnSelectNode');
        if (btnSelectNode) {
            btnSelectNode.innerText = `ดูข้อมูล: ${lesson.title}`;
        }

        // จัดการไฮไลท์สีวงกลมด่านบนแผนที่
        const allNodes = document.querySelectorAll('.map-node');
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

// 📍 3. ฟังก์ชันเปิด Pop-up (จะทำงานเมื่อกดปุ่ม Select เท่านั้น)
function openPopup() {
    const infoSection = document.getElementById('infoSection');
    if (infoSection) {
        infoSection.classList.add('show-popup');
    }
}

// 📍 4. ฟังก์ชันปิด Pop-up
function closePopup() {
    const infoSection = document.getElementById('infoSection');
    if (infoSection) {
        infoSection.classList.remove('show-popup');
    }
}

function startCurrentLesson() {
    alert("เริ่มเข้าสู่: " + lessonsData[currentSelectedLevel].title);
}