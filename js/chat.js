  const GAS_URL = "https://script.google.com/macros/s/AKfycbwaPDBr2mZRGNeKdMTzNyo67KSwHj6WPAt5sdRauXV2xgUz13T5mvaDY8EbzY7Qem2w/exec";
  const userName = "ゲスト";

  const chatbox = document.getElementById("chatbox");
  const input = document.getElementById("chatMessage");
  const sendBtn = document.getElementById("sendBtn");

  // URLをリンクに変換
  function linkify(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, url => `<a href="${url}" target="_blank" style="color: #1a0dab;">${url}</a>`);
  }

  // メッセージ表示
  function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.style.display = "flex";
    bubble.style.margin = "5px 0";
    bubble.style.alignItems = "flex-start";

    const messageBox = document.createElement("div");
    messageBox.style.maxWidth = "70%";
    messageBox.style.padding = "6px 10px";
    messageBox.style.borderRadius = "10px";
    messageBox.style.lineHeight = "1.4";
    messageBox.style.wordWrap = "break-word";
    messageBox.innerHTML = linkify(text);

    if (sender === "まつゆう") {
      // 左寄せ + アイコン → コメント
      bubble.style.flexDirection = "row";
      bubble.style.justifyContent = "flex-start";

      const icon = document.createElement("img");
      icon.src = "https://blogger.googleusercontent.com/img/a/AVvXsEhZUTKt2n7kbiwKYhxcYBjSUlsiIsw97IrK7Lel7slVO_k0ZbNFfoY3EIkLFXE2NoHHnRLMH5gx7kNsJOeIoNW7SzhZc0olHx9fkLLszflto_M-kG0hhRd3sGtMB0OFZGib2KQW3MriXzh4FceVtrHoqq_dt0mK6E3ZJ4zj74x-b8w1rrgbrtYt7HgCbho=s536";
      icon.style.width = "24px";
      icon.style.height = "24px";
      icon.style.borderRadius = "50%";
      icon.style.marginRight = "6px";

      messageBox.style.background = "#ffffff";

      bubble.appendChild(icon);
      bubble.appendChild(messageBox);
    } else {
      // 右寄せ風 + コメント → アイコン
      bubble.style.flexDirection = "row-reverse";
      bubble.style.justifyContent = "flex-start";

      const icon = document.createElement("i");
      icon.className = "fa-solid fa-user";
      icon.style.marginLeft = "6px";
      icon.style.color = "#888";
      icon.style.fontSize = "16px";

      messageBox.style.background = "#dcf8c6";

      bubble.appendChild(icon);
      bubble.appendChild(messageBox);
    }

    chatbox.appendChild(bubble);
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  // メッセージ取得
  async function loadMessages() {
    try {
      const res = await fetch(GAS_URL);
      const data = await res.json();
      chatbox.innerHTML = "";
      data.forEach(item => {
        addMessage(item.message, item.name);
      });
    } catch (e) {
      console.error("読み込み失敗", e);
    }
  }

  // メッセージ送信
  async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;
    try {
      await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ name: userName, message: msg })
      });
      input.value = "";
      loadMessages();
    } catch (e) {
      alert("送信に失敗しました");
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  loadMessages();
  setInterval(loadMessages, 5000);
