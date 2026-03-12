# Dynamic Sitemap: Auto-Labeling Index Generator (English Version)

A dynamic pattern that utilizes the Blogger API to automatically categorize and display all posts by labels.

## 🧠 Logic: The "Auto-Garden" Approach
Instead of relying on standard Blogger lists, this pattern reconstructs data on the client-side to provide:

- **Zero Maintenance:** No need to update the sitemap manually as you add new posts.
- **Label-First Navigation:** A structure that allows readers to browse by specific interests or categories.
- **High-Speed Fetching:** Direct integration with Google Blogger API (v3) for real-time updates.

## ⚙️ Key Technical Points
- **Asynchronous Fetch:** Uses `async/await` for smooth data retrieval.
- **Regex-based Thumbnail Extraction:** Safely extracts the first image from the post content as a thumbnail.
- **Label Mapping:** Groups posts dynamically by their labels, creating an intuitive H3-based hierarchy.

## ✍️ Usage for AI
When asking an AI to customize this sitemap, provide this file and specify:
*"I want to modify the layout of the 'toc-item' while keeping the current label-based grouping logic."*
