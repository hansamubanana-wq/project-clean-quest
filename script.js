// 変数
let videoStream = null;
let isScanning = false;

function showScreen(screenId) {
    if (isScanning && screenId !== 'scan-screen') stopScan();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// === QRスキャン処理 ===
function startScan() {
    showScreen('scan-screen');
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const statusText = document.getElementById('scan-status');

    isScanning = true;
    statusText.innerText = "カメラを起動中...";

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(stream => {
            videoStream = stream;
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(err => {
            console.error(err);
            statusText.innerText = "カメラ許可が必要です";
        });

    function tick() {
        if (!isScanning) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            statusText.innerText = "QRコードを合わせてください";
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

            if (code) {
                if (code.data === "QUEST-START-303") {
                    stopScan();
                    // ★ここを変更！alertじゃなくてポップアップを表示
                    showSuccessModal(code.data); 
                } 
            }
        }
        requestAnimationFrame(tick);
    }
}

function stopScan() {
    isScanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    const video = document.getElementById('camera-preview');
    video.srcObject = null;
    if(document.getElementById('scan-screen').classList.contains('active')){
         showScreen('home-screen');
    }
}

// === 新しい通知機能 ===
function showSuccessModal(code) {
    const overlay = document.getElementById('success-overlay');
    overlay.style.display = 'flex';
    // ホーム画面に戻しておく
    showScreen('home-screen');
    
    // ホーム画面のボタンを「進行中」に変える演出
    const btn = document.querySelector('.primary');
    btn.innerHTML = '⚔️ クエスト進行中';
    btn.style.backgroundColor = '#00cc66';
    btn.style.borderColor = '#009944';
    btn.style.boxShadow = 'none';
    btn.onclick = null;
}

function closeSuccess() {
    document.getElementById('success-overlay').style.display = 'none';
}

// 掃除アクション
function cleanRoom() {
    const room = document.getElementById('target-room');
    if (room.classList.contains('target')) {
        // 確認も明るい雰囲気なら標準confirmでもいいけど、とりあえずそのまま
        if(confirm("【確認】\n掃除完了報告を送信しますか？")) {
            room.classList.remove('target');
            room.classList.add('cleared');
            room.innerHTML = '303<br><span style="font-size:0.7rem">✨浄化済</span>';
            
            // ゲージMAX演出
            document.querySelector('.hp-fill').style.width = '100%';
            document.querySelector('.mission-title').innerText = '🎉 浄化完了！';
            
            // 報酬ゲットポップアップへ誘導してもいいかも
            setTimeout(() => {
                alert("エリア浄化！\n獲得経験値: 100 XP");
            }, 500);
        }
    }
}

function getReward() {
    document.getElementById('popup-overlay').style.display = "flex";
}

function closePopup() {
    document.getElementById('popup-overlay').style.display = "none";
}