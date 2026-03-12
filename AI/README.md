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
- **[GSAPヒーロースライダー](./patterns/blogger-dynamic-homepage.md):** ブログの第一印象を決定づける、滑らかでモダンな視覚演出。

---

## 🛠 How to Use
1. **PrinciplesをAIに読み込ませる:** LLM（ChatGPTやGemini等）に `principles/` の内容を学習させることで、私の好みにパーソナライズされたコード生成が可能になります。
2. **Patternsを適用する:**
   各Markdown内のコードをBloggerのHTML編集画面、またはガジェットに追加してください。

## ✍️ Author
**まつさん**
Bloggerの可能性を掘り下げる、自称「Blogger=デジタルガーデン庭師」。
「AIの限界は、自分の言語化の限界と同じ場所にある」を信条に、Bloggerという広大な庭にコードと洞察の種をまき、日々新しい体験を育て続けています。

# Blogger Limit-Break Project: Patterns & Principles

An archive of customization code and architectural philosophies designed to transform Blogger—a platform often perceived as "legacy"—into a modern experimental playground for web experiences.

## 🚀 Concept: "Limited Platform, Unlimited Creativity"

Moving from "It can't be done on Blogger" to "Look how much is possible on Blogger."
By leveraging Blogger’s strengths as a serverless, maintenance-free platform and combining it with external APIs (GAS, Last.fm) and modern libraries (GSAP, html2canvas), this project aims to sublimate static blogs into dynamic applications.

---

## 🧠 Principles

The "Operating System of Thought" behind every implementation. These serve as behavioral guidelines for co-creation with AI.

- **[Completion is a Still Image](./principles/concept-of-quality.md):** Pursuing the "optimal solution for now" under the assumption of continuous change.
- **[Design of Equivalent Exchange](./principles/concept-of-quality.md):** Aesthetics dedicated to expanding usability.
- **[Implementation Justice & Breaking Boundaries](./principles/development-attitude.md):** Transforming platform constraints into a playground with a "Functionality First" mindset.

---

## 🛠 Patterns

A collection of ready-to-use customization components, all verified to work within the Blogger environment.

### Interactive Components
- **[Custom Like Button (GAS-Linked)](./patterns/blogger-custom-like-button.md):** A serverless reaction feature using Google Sheets as a database.
- **[Album Chart Generator](./patterns/blogger-music-chart-generator.md):** A tool that interfaces with the Last.fm API to generate personalized music chart images.

### Navigation & UX
- **[Dynamic In-feed Blog Cards](./patterns/blogger-dynamic-infeed-card.md):** A system that randomly summons latest posts to drastically increase internal site circulation.
- **[GSAP Hero Slider](./patterns/blogger-dynamic-homepage.md):** Smooth, modern visual effects that define the blog's first impression.

---

## ⚙️ How to Use
1. **Feeding Principles to AI:** By providing the content of the `principles/` directory to an LLM (such as ChatGPT or Gemini), you can enable code generation personalized to my specific preferences and style.
2. **Applying Patterns:** Copy the code within each Markdown file and add it to your Blogger HTML editor or Layout gadgets.

## ✍️ Author
**Matsusan**
A self-proclaimed "Blogger Digital Garden Architect" exploring the hidden potential of the platform.
Guided by the belief that "The limits of AI are found at the same place as the limits of one's own verbalization," I continue to sow seeds of code and insight in the vast garden of Blogger, nurturing new experiences every day.
