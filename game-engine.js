// 📌 日期鎖定與文字切換
    lockDate(type) {
        const id = type === 'exam' ? 'input-exam-date' : 'input-result-date';
        const btnId = type === 'exam' ? 'btn-lock-exam' : 'btn-lock-result';
        const val = document.getElementById(id).value;
        if (!val) { alert("請先選擇日期！"); return; }

        if (type === 'exam') {
            this.state.examDate = val;
            this.state.examDateLocked = true;
        } else {
            this.state.resultDate = val;
            this.state.resultDateLocked = true;
        }
        this.save();
        this.updateUI(); // 這會觸發 updateDateControls 把按鈕改為 "鎖定"
        alert("📌 日期已鎖定，非經人資許可不得修改！");
    },

    // 📌 申請更改日期 (文字切換為 "申請")
    requestChange() {
        const val = document.getElementById('input-change-date').value;
        if (!val) { alert("請選擇欲更改的日期！"); return; }
        
        // 這裡未來連動後台 API 送出申請
        alert("🚨 已送出申請，請私訊人資承辦，核准後將為您解鎖，會因此扣分喔！");
        
        const btn = document.getElementById('btn-lock-change');
        if (btn) {
            btn.disabled = true;
            btn.innerText = "申請";
            btn.style.opacity = "0.5";
        }
    },

    // 引擎的 updateDateControls 也請補上這段
    updateDateControls() {
        const b1 = document.getElementById('btn-lock-exam');
        if (b1 && this.state.examDateLocked) { b1.innerText = "鎖定"; b1.disabled = true; }
        
        const b2 = document.getElementById('btn-lock-result');
        if (b2 && this.state.resultDateLocked) { b2.innerText = "鎖定"; b2.disabled = true; }
    }
