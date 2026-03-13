# Blogger XML Parser Evasion Strategy

This document outlines a critical technique for preserving specific characters within the Blogger (Blogspot) XML template engine.

## 1. Core Concept

*   **Phenomenon:** The Blogger editor/parser automatically converts certain symbols (like `!`, `。`, `?`) into **numeric character references** (e.g., `&#65281;`) upon saving.
    
*   **Problem:** JavaScript logic, especially string comparisons (e.g., `if (status === "Done!")`), fails because the hardcoded string in the script is rewritten by the platform, causing logic breakdown.
    
*   **Solution:** Utilize `decodeURIComponent("%encoded_string")`. This bypasses the Blogger XML parser by masking the characters as URI-encoded strings, which are only decoded at runtime.
    

## 2. Implementation Pattern

### ❌ Incorrect (Subject to Auto-Replacement)

```
// Blogger will rewrite this to "Completed&#65281;"
const msg = "Completed！"; 
```

### ✅ Correct (Bypassing the Parser)

```
// Masked from the parser, decoded only during execution
const msg = decodeURIComponent("%E5%AE%8C%E4%BA%86%EF%BC%81"); // "完了！"
```

## 3. Translation Matrix (Standard Armament)

| 記号 | URIエンコード | 実装コード例 |
| :--- | :--- | :--- |
| ！ | %EF%BC%81 | decodeURIComponent("%EF%BC%81") |
| 。 | %E3%80%82 | decodeURIComponent("%E3%80%82") |
| 、 | %E3%80%81 | decodeURIComponent("%E3%80%81") |
| ： | %EF%BC%9A | decodeURIComponent("%EF%BC%9A") |

## 4. Management Strategy

Centralize all UI messages into a constant object using this encoding method. This not only prevents platform-induced bugs but also optimizes context input for AI-assisted development.
