# Case Study: Overcoming Blogger Constraints to Build Modern UX

## Pattern 1: Dynamic UX Enhancement via "Retrofitting"

### Challenges

*   **Lack of UX**: No built-in Table of Contents (ToC), reading progress indicators, or interactive elements.
    
*   **Performance Issues**: No automated WebP conversion or dynamic image resizing.
    
*   **Systemic Distortion**: Unnatural date formats in Japanese and unstable search result counts.
    

### Implementation Details

*   **JS-Injected UX**: Retrofitting features by scanning the DOM without complicating the XML template.
    
*   **Dynamic URL/Parameter Rewriting**:
    
    *   **Image Optimization**: Using regex to rewrite image URLs with `/w750-rw/` for WebP delivery.
        
    *   **Search Control**: Forcing `max-results=7` on all label links to stabilize layout.
        
*   **Normalization**:
    
    *   **Date Formatting**: Reordering dates into "YYYY/MM/DD" using regex.
        
    *   **Dynamic SVG**: Real-time calculation of SVG coordinates for radar charts.
        

## Pattern 2: Reconstructing Advanced Pagination via Blogger API

### Challenges

*   **Poor Usability**: Users cannot jump directly to specific pages.
    
*   **Inconsistent Display Counts**: Archive/search pages ignore custom counts, breaking grid designs.
    
*   **Missing Metadata**: No native way to retrieve total post counts.
    

### Implementation Details

*   **Feed API Integration**: Fetching `openSearch$totalResults` via JSON feed for accurate post counts.
    
*   **Dynamic Paging Navigation**: Calculating total pages and rendering numbered links with truncation.
    
*   **Precision Jumps**: Using the `published` timestamp of the target page's first article as an `updated-max` parameter for accurate redirection.
    

## Pattern 3: External Integration and UX Sophistication

### Challenges

*   **Dynamic Data Usage**: Difficulty in implementing rankings with static templates.
    
*   **Behavior Visualization**: Need for custom engagement scoring (read rates/stay time).
    
*   **Performance vs. Revenue**: Auto-ads causing layout shifts.
    

### Implementation Details

*   **GAS (Google Apps Script) Backend**:
    
    *   **Engagement Logging**: Sending stay time and scroll rates to GAS via `navigator.sendBeacon`.
        
    *   **Ranking Display**: Rendering stylized ranking tables from GAS-aggregated JSON.
        
*   **Ad Optimization**: Using `MutationObserver` to detect/remove Auto-Ads and lazy-loading AdSense scripts 2 seconds after load.
    

## Pattern 4: Sidebar Visual Effects and Dynamic Status

### Challenges

*   **Lack of Immersion**: Static profile sections fail to convey the creator's personality.
    
*   **Weak Social Integration**: Standard buttons lack visual synergy with site themes.
    
*   **Lack of "Live" Info**: No way to share real-time activities (e.g., current music).
    

### Implementation Details

*   **3D Parallax Profile**: Utilizing `perspective` and `preserve-3d` for an immersive header that rotates via keyframe animations.
    
*   **Interactive Social Buttons**: CSS animations that transform buttons upon hover, using brand-specific colors and Font Awesome icons.
    
*   **Real-time Music Player**: Integrating Last.fm API to show the current track.
    
    *   **Vinyl UI**: CSS `.is-playing` class triggers a rotating record animation.
        
    *   **Image Proxy**: Using `images.weserv.nl` to optimize and stabilize API-delivered album art.
        

## Pattern 5: Dynamic Content Control and Sticky UX

### Challenges

*   **Space Competition**: "Popular" vs. "Recent" posts competing for vertical space.
    
*   **Dead Space**: Sidebar becomes empty as users scroll down long articles.
    
*   **Navigation Gaps**: No way to track progress or jump sections from the sidebar.
    

### Implementation Details

*   **Lava Lamp Tab Widget**: Consolidating multiple widgets into a single area with smooth tab transitions.
    
*   **Intelligent Sticky Bundle**:
    
    *   **Auto-ToC**: Detecting `h2/h3` tags to generate a highlighted table of contents.
        
    *   **Footer Collision Avoidance**: Dynamically calculating stop positions to prevent overlap with the footer.
        
*   **Page-Specific Logic**: Prioritizing ToC on article pages while emphasizing random posts on index pages to boost discovery.
    

## Pattern 6: Final UX Refinements and Utility

### Challenges

*   **Barriers to Code Use**: Manual selection of code blocks is tedious and error-prone.
    
*   **Lack of Progress Awareness**: Users lose sense of position in long-form content.
    
*   **Navigation Burden**: Manual scrolling back to top is a friction point.
    

### Implementation Details

*   **Code Copy Utility**: Dynamically injecting "Copy" buttons into detected code blocks with visual feedback via `navigator.clipboard`.
    
*   **Content-Linked Progress Bar**: A top-fixed bar that tracks scroll progress specifically within the `.post-body` area using `getBoundingClientRect()`.
    
*   **Faded "Back to Top"**: A smooth-scroll button that fades in/out based on scroll depth to minimize distraction.
    

## Insights

*   **Converting Static to Dynamic**: Adding movement and real-time data signals that the blog is an "active" medium.
    
*   **Removing Friction**: Eliminating small stressors (like code copying) builds professional trust.
    
*   **Psychological Completion Support**: Progress meters act as guides, significantly increasing the completion rate of long-form articles.
