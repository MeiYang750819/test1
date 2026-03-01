/* ================================================================
   【 ⚙️ GAME ENGINE - 完整邏輯版 】
   ================================================================ */
const GameEngine = {
    state: {
        score: 0,
        items: ['👕 粗製布衣'],
        location: '⛺ 新手村',
        status: '📦 檢整裝備中',
        achievements: [],
        weaponType: null,
        currentTrial: 0,
        examDate: null,      
        examDateLocked: false,
        resultDate: null,    
        resultDateLocked: false,
        // 預留後台帶入數據
        appointmentTime: "等待公會發布...", 
        appointmentLocation: "等待公會發布..."
    },

    ranks: [
        { min: 101, title: "💎 SS級 神話級玩家" },
        { min: 96,  title: "🌟 S級 傳說級玩家" },
        { min: 80,  title: "🟢 A級 菁英玩家" },
        { min: 60,  title: "🥇 B級 穩健玩家" },
        { min: 40,  title: "🥈 C級 潛力玩家" },
        { min: 30,  title: "🥉 D級 基礎學徒" },
        { min: 20,  title: "❌ E級 建議汰換" }, 
        { min: 2,   title: "🌱 實習小萌新" },
        { min: 0,   title: "🥚 報到新手村" }
    ],

    armorPath: ['👕 粗製布衣', '🧥 強化布衫', '🥋 實習皮甲', '🦺 輕型鎖甲', '🛡️ 鋼鐵重甲', '💠 秘銀胸甲', '🛡️ 聖光戰鎧', '🌟 永恆守護鎧'],
    weaponPaths: {
        '🗡️ 精鋼短劍': '⚔️ 騎士長劍', '⚔️ 騎士長劍': '⚔️ 破甲重劍', '⚔️ 破甲重劍': '🗡️ 聖光戰劍', '🗡️ 聖光戰劍': '👑 王者之聖劍',
        '🏹 獵人短弓': '🏹 精靈長弓', '🏹 精靈長弓': '🏹 迅雷連弓', '🏹 迅雷連弓': '🏹 追風神弓', '🏹 追風神弓': '☄️ 破曉流星弓',
        '🔱 鐵尖長槍': '🔱 鋼鐵戰矛', '🔱 鋼鐵戰矛': '🔱 破陣重矛', '🔱 破陣重矛': '🔱 龍膽銀槍', '🔱 龍膽銀槍': '🐉 滅世龍吟槍'
    },

    trialsData: {
        1: { baseProg: 10, loc: '🏰 登錄公會', scoreGain: 5 },
        2: { baseProg: 25, loc: '📁 裝備盤點', scoreGain: 5 },
        3: { baseProg: 40, loc: '🛡️ 裝備鑑定所', scoreGain: 10 },
        4: { baseProg: 60, loc: '🎒 出征準備營', scoreGain: 10 },
        5: { baseProg: 80, loc: '💼 契約祭壇', scoreGain: 10 },
        6: { baseProg: 90, loc: '👑 榮耀殿堂', scoreGain: 10 }
    },

    init() {
        try {
            const saved = localStorage.getItem('hero_progress');
            if (saved) { 
                this.state = Object.assign({}, this.state, JSON.parse(saved));
            }
        } catch (e) { localStorage.removeItem('hero_progress'); }
        setTimeout(() => { this.updateUI(true); }, 50);
    },

    save() { localStorage.setItem('hero_progress', JSON.stringify(this.state)); },

    reset() { localStorage.removeItem('hero_progress'); location.reload(); },

    // 📌 日期鎖定
    lockDate(type) {
        const id = type === 'exam' ? 'input-exam-date' : 'input-result-date';
        const val = document.getElementById(id).value;
        if (!val) { alert("請先選擇日期！"); return; }
        if (type === 'exam') { this.state.examDate = val; this.state.examDateLocked = true; } 
        else { this.state.resultDate = val; this.state.resultDateLocked = true; }
        this.save(); this.updateUI();
        alert("📌 日期已鎖定，非經人資許可不得修改！");
    },

    // 📌 申請更改日期 (警告機制)
    requestChange() {
        alert("🚨 已送出申請，請私訊人資承辦，核准後將為您解鎖，會因此扣分喔！");
    },

    completeTrial(event, trialNum) {
        if (this.state.currentTrial >= trialNum) { alert("⚠️ 此階段任務已完成，請繼續前進！"); return; }
        if (trialNum > 1 && this.state.currentTrial < trialNum - 1) { alert("⚠️ 勿著急，請先完成前一個階段任務！"); return; }

        const tData = this.trialsData[trialNum];
        this.state.currentTrial = trialNum;
        this.state.location = tData.loc;
        this.state.score += tData.scoreGain;
        
        // 防具升級
        const currentArmor = this.state.items.find(i => this.armorPath.includes(i));
        if (currentArmor) {
            const idx = this.armorPath.indexOf(currentArmor);
            if (idx < this.armorPath.length - 1) {
                this.state.items = this.state.items.map(i => i === currentArmor ? this.armorPath[idx + 1] : i);
            }
        }

        // 武器升級
        if (trialNum >= 3 && this.state.weaponType) {
            const nextW = this.weaponPaths[this.state.weaponType];
            if (nextW) {
                this.state.items = this.state.items.map(i => i === this.state.weaponType ? nextW : i);
                this.state.weaponType = nextW; 
            }
        }

        this.save();
        this.updateUI(true);
    },

    updateUI(isInit = false) {
        const rank = this.ranks.find(r => this.state.score >= r.min) || this.ranks[this.ranks.length - 1];
        
        const rEl = document.getElementById('rank-text');
        const sEl = document.getElementById('status-tag');
        if (rEl) rEl.innerHTML = `<span style="color:#fbbf24;">戰力：</span><span>${rank.title}</span>　｜　<span style="color:#fbbf24;">關卡：</span><span>${this.state.location}</span>`;
        if (sEl) sEl.innerHTML = `<span style="color:#8ab4f8;">道具：</span><span>${this.state.items.join(' ')}</span>　｜　<span style="color:#8ab4f8;">狀態：</span><span>${this.state.status}</span>`;
        
        document.getElementById('score-text').innerText = this.state.score + "分";
        document.getElementById('score-fill').style.width = Math.min(this.state.score, 100) + "%";

        const hiddenBonus = Math.min(10, this.state.achievements.length * 5);
        const baseProg = this.state.currentTrial > 0 ? this.trialsData[this.state.currentTrial].baseProg : 0;
        const currentProg = Math.min(100, baseProg + hiddenBonus);
        document.getElementById('prog-val').innerText = currentProg + "%";
        document.getElementById('prog-fill').style.width = currentProg + "%";

        // 更新日期
        const d1 = document.getElementById('input-exam-date');
        const b1 = document.getElementById('btn-lock-exam');
        if (d1) {
            d1.value = this.state.examDate || "";
            if (this.state.examDateLocked) { d1.disabled = true; b1.disabled = true; b1.innerText = "🔒"; }
        }

        // 更新第四關預載數據
        const timeEl = document.getElementById('dyn-apt-time');
        const locEl = document.getElementById('dyn-apt-loc');
        if (timeEl) timeEl.innerText = this.state.appointmentTime;
        if (locEl) locEl.innerText = this.state.appointmentLocation;

        this.updateButtonStyles();
    },

    updateButtonStyles() {
        const trials = [1, 2, 3, 4, 5, 6];
        trials.forEach(n => {
            const btn = document.getElementById(`btn-trial-${n}`);
            if (!btn) return;
            if (this.state.currentTrial >= n) {
                btn.disabled = true;
                btn.style.opacity = "0.6";
                if (n === 3) btn.innerText = "📝 已提交裝備";
                else if (n === 6) btn.innerText = "👑 已完成榮耀";
                else btn.innerText = "✓ 已完成試煉";
            }
        });
    }
};
window.addEventListener('load', () => GameEngine.init());
