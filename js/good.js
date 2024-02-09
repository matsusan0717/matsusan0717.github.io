//<![CDATA[
  window.addEventListener('DOMContentLoaded', () => {

    // 送信フォーム、フォーム送信後の処理のための iframe を取得
    const form = document.querySelector('.like-form');
    const iframe = document.querySelector('.like-iframe');

    // フラグ初期化
    let submitted = false;

    // 送信が完了したらフラグを立てる
    form.addEventListener('submit', () => {
      submitted = true;
    });

    // iframe の読み込みが完了したら実行
    iframe.addEventListener('load', () => {

      // 送信完了後の処理
      if(submitted){

        // 送信ボタン取得
        const button = document.querySelector('.like-button');

        // いいねボタン無効化、内部アイコンクラス変更
        button.disabled = true;
        button.querySelector('i').classList.remove('fa-regular');
        button.querySelector('i').classList.add('fa-solid');

        // 送信メッセージ表示
        alert('いいねありがとうございました！！');
      }
    });
  });
//]]>
