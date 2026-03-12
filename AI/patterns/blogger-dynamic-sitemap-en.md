# Dynamic Sitemap: Auto-Labeling Index Generator

A dynamic pattern that utilizes the Blogger API to automatically categorize and display all posts by labels. This implementation bridges the gap between Blogger's legacy structure and a modern, data-driven UX.

## 🧠 Logic: The "Auto-Garden" Approach
Instead of relying on standard Blogger lists, this pattern reconstructs data on the client-side to provide:

- **Zero Maintenance:** The sitemap updates automatically as you publish new posts.
- **Label-First Navigation:** A structure that prioritizes user interest, grouping content into intuitive hierarchies.
- **High-Speed Fetching:** Direct integration with Google Blogger API (v3) for real-time performance.

## 🛠 Technical Highlights
- **Smart Thumbnail Extraction:** Uses a Regex-based logic to scavenge the first `<img>` tag from post content, ensuring a visual-rich index.
- **Dynamic Grouping:** Implements a `labelMap` object to sort posts asynchronously, creating a structured H3-category layout.
- **Blogger API v3 Integration:** Demonstrates how to handle `maxResults` and API key authentication within a serverless environment.

## 🚨 Implementation Justice
In the Blogger XML environment, special characters are often auto-encoded (The "Character Entity" Mire). To ensure this code works:
1. Wrap the script properly or host it externally as `custom.js`.
2. Ensure your `API_KEY` has the correct restrictions for your domain.

---
**Back to [Matsusan's Digital Garden](https://blogger.matsusanjpn.com/)**
