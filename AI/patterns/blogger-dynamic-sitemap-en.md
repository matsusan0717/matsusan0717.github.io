# Pattern: Dynamic Sitemap with Anchor-linked Navigation

## Challenges
As the number of posts grows, a simple list becomes an "information flood," making it harder for readers to find specific content.

- **Information Overload:** Listing everything in a flat structure obscures the big picture.
- **Lack of Navigation:** No way to instantly jump to specific categories without reloading pages.
- **Visual Clutter:** Poorly managed whitespace leads to reader fatigue.

## Implementation (What I Did)
1. **Dynamic Navigation Layer**
   - Extracted unique labels from the dataset and rendered them as an "Anchor Navigation" at the top of the page.
2. **Anchor Jumping & Smooth Scrolling**
   - Dynamically assigned IDs to `<h3>` headers and implemented `scroll-behavior: smooth` for a seamless user experience.
3. **"Wabi-Sabi" Spacing Design**
   - Fine-tuned `margin-top` and `margin-bottom` to balance the connection and independence of the navigation bar.
   - Added `scroll-margin-top` to ensure headers don't stick too close to the browser edge after jumping.

## Insights (Why it Works)
- **Overview before Detail:** By providing a map (label list) before the terrain (post list), cognitive load is drastically reduced.
- **The Beauty of Pixels:** Subtle adjustments to whitespace define the overall "class" and readability of the site.
- **Autonomous Growth:** The system grows by itself—every new post automatically updates both the navigation and the list, creating a "self-sustaining garden."

---
**Back to the History:**
[Blogger Customization History | Materiapollo](https://blogger.matsusanjpn.com/2026/03/blogger-customization-history.html)
