# Pattern: Dynamic Sitemap via Asynchronous Fetch

## Challenges
As a Blogger site grows, "past assets" tend to get buried under new content.

- **Standard Limitations:** Labels and archive gadgets aren't enough to provide a bird's-eye view of the entire blog.
- **Manual Overhead:** Manually updating a sitemap for every new post is inefficient and prone to errors.
- **Fragmented UX:** Forcing users to click through multiple pages to find content discourages deep exploration.

## Implementation (What I Did)
1. **Leveraging Blogger Feed API**
   - Used JavaScript `fetch` to retrieve the site's RSS feed (`/feeds/posts/summary`).
   - Built logic to handle metadata like titles, dates, and URLs for all posts as a consolidated data set.

2. **Dynamic Frontend Rendering**
   - Iterated through the fetched data to dynamically generate HTML list elements (`<ul>`).
   - Implemented sorting and grouping by labels to improve information architecture.

3. **Lightweight Asynchronous Loading**
   - Ensured the sitemap loads asynchronously to avoid blocking the main page rendering, providing a smooth user experience.

## Insights (Why it Works)
- **The "Self-Growing" Garden:** Once implemented, the sitemap grows automatically with every new post, requiring zero maintenance.
- **Mapping Knowledge:** Visitors can instantly grasp the "landscape" of the blog, breathing new life into older articles.
- **Visualizing Heritage:** Seeing a complete list of one's work serves as a powerful motivator and a clear record of the gardener's journey.

---
**Back to the History:**
[Blogger Customization History | Materiapollo](https://blogger.matsusanjpn.com/2026/03/blogger-customization-history.html)
