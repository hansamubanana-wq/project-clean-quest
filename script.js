// グローバル変数（スキャン停止用）
let videoStream = null;
let isScanning = false;

function showScreen(screenId) {
    // 画面切り替え時にスキャン中なら停止する
    if (isScanning && screenId !== 'scan-screen') {
        stopScan();
    }
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// === カメラ起動＆QRスキャン処理 ===
function startScan() {
    showScreen('scan-screen');
    const video = document.getElementById('camera-preview');
    const canvas = document.getElementById('qr-canvas');
    const context = canvas.getContext('2d');
    const statusText = document.getElementById('scan-status');

    isScanning = true;
    statusText.innerText = "カメラへのアクセスを求めています...";

    // カメラ起動
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }) // 外側カメラ優先
        .then(stream => {
            videoStream = stream;
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(tick);
        })
        .catch(err => {
            console.error(err);
            statusText.innerText = "カメラの起動に失敗しました。\n(HTTPS接続または許可が必要です)";
            statusText.style.color = "red";
        });

    // スキャンループ
    function tick() {
        if (!isScanning) return; // 停止フラグが立っていたら終了

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            statusText.innerText = "QRコードを枠内に合わせてください";
            
            // キャンバスに現在の映像を描画
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // QR解析
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            });

            if (code) {
                // 何かQRが見つかった場合
                console.log("Found QR code", code.data);

                // ★ここで「QUEST-START-303」という文字か判定
                if (code.data === "QUEST-START-303") {
                    stopScan(); // スキャン停止
                    
                    // 成功演出
                    alert("ACCESS GRANTED.\n認証コード: " + code.data + "\nクエストを開始します。");
                    showScreen('home-screen');
                    
                    // 認証成功したらホーム画面のメッセージを変える等の演出を入れてもいい
                    const btn = document.querySelector('.primary');
                    btn.innerHTML = '<span class="icon">✅</span> クエスト進行中';
                    btn.style.borderColor = "#00ff00";
                    btn.style.color = "#00ff00";
                    btn.onclick = null; // ボタンを押せなくする
                } 
            }
        }
        
        // 次のフレームへ
        requestAnimationFrame(tick);
    }
}

// スキャン停止処理
function stopScan() {
    isScanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    // ホームに戻すかどうかは状況によるが、基本は呼び出し元で制御
    const video = document.getElementById('camera-preview');
    video.srcObject = null;
    
    // キャンセルボタンで戻った場合のため
    if(document.getElementById('scan-screen').classList.contains('active')){
         showScreen('home-screen');
    }
}

// 掃除完了アクション
function cleanRoom() {
    const room = document.getElementById('target-room');
    if (room.classList.contains('target')) {
        if(confirm("【警告】\n303教室の浄化を開始しますか？")) {
            room.classList.remove('target');
            room.style.background = "#004400";
            room.style.borderColor = "#00ff00";
            room.innerHTML = '<span class="room-num" style="color:#00ff00">303</span><span class="room-label">浄化完了</span>';
            
            document.querySelector('.hp-fill').style.width = '100%';
            document.querySelector('.hp-fill').style.background = '#00ff00';
            
            alert("✨ MISSION COMPLETE! ✨\n獲得経験値: 100 XP");
        }
    }
}

function getReward() {
    document.getElementById('popup-overlay').style.display = "flex";
}

function closePopup() {
    document.getElementById('popup-overlay').style.display = "none";
}