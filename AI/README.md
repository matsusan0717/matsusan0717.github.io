# Blogger 限界突破プロジェクト：Patterns & Principles

Bloggerという「枯れた」と思われがちなプラットフォームを、モダンなWeb体験の実験場へと変えるカスタマイズ・コードとその設計思想のアーカイブです。

## 🚀 Concept: "Limited Platform, Unlimited Creativity"

「Bloggerだからできない」を、「Bloggerでもここまでできる」へ。
サーバーレス、メンテナンスフリーというBloggerの利点を活かしつつ、外部API（GAS, Last.fm）やモダンなライブラリ（GSAP, html2canvas）を組み合わせることで、静的なブログを動的なアプリケーションへと昇華させることを目的としています。

---

## 🧠 Principles（設計思想）


実装の背後にある「思考のOS」です。AIとの共創における行動指針として機能します。

- **[完成は静止画である](./principles/concept-of-quality.md):** 変化を前提とした「現時点の最適解」を追求する。
- **[等価交換のデザイン](./principles/concept-of-quality.md):** ユーザビリティを拡張するための美学。
- **[実装正義と限界突破](./principles/development-attitude.md):** 「動けばヨシ！」の精神で、プラットフォームの制約を遊び場に変える。

---

## 🛠 Patterns（実装ライブラリ）


即戦力のカスタマイズ・パーツ群。すべてBlogger環境での動作を確認済みです。

### Interactive Components
- **[自作いいねボタン (GAS連動)](./patterns/blogger-custom-like-button.md):** スプレッドシートをDB化した、サーバーレスなリアクション機能。
- **[アルバムチャート・ジェネレーター](./patterns/blogger-music-chart-generator.md):** Last.fm APIと連携し、自分だけの音楽チャートを画像生成するツール。

### Navigation & UX
- **[動的インフィード・ブログカード](./patterns/blogger-dynamic-infeed-card.md):** 最新記事をランダムに召喚し、記事内での回遊率を劇的に高める仕組み。
- **[GSAPヒーロースライダー](./patterns/blogger-gsap-slider.md):** ブログの第一印象を決定づける、滑らかでモダンな視覚演出。（※以前作成したスライダーのパスを想定）

---

## 🛠 How to Use
1. **PrinciplesをAIに読み込ませる:** LLM（ChatGPTやGemini等）に `principles/` の内容を学習させることで、私の好みにパーソナライズされたコード生成が可能になります。
2. **Patternsを適用する:**
   各Markdown内のコードをBloggerのHTML編集画面、またはガジェットに追加してください。

## ✍️ Author
**まつさん**
Bloggerの可能性を掘り下げる、自称「Blogger魔法使い」。
「AIの限界は、自分の言語化の限界と同じ場所にある」を信条に、日々コードと洞察をアップデート中。
