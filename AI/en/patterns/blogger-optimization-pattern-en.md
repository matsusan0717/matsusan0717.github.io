# Case Study: Overcoming Blogger Constraints to Build Modern UX

## Pattern 1: Dynamic UX Enhancement via "Retrofitting"

### Challenges

Blogger’s legacy architecture lacks native modern features:

*   **Lack of UX**: No built-in Table of Contents (ToC), reading progress indicators, or interactive elements.
    
*   **Performance Issues**: No automated WebP conversion or dynamic image resizing.
    
*   **Systemic Distortion**: Unnatural date formats in Japanese and unstable search result counts.
    

### Implementation Details

*   **JS-Injected UX**: Retrofitting features by scanning the DOM without complicating the XML template.
    
    *   **ToC Generation**: Automatically extracting H2/H3 tags, assigning IDs, and implementing ScrollSpy.
        
    *   **Progress Bar**: Calculating scroll position relative to article height to display a top progress bar.
        
*   **Dynamic URL/Parameter Rewriting**:
    
    *   **Image Optimization**: Using regex to rewrite image URLs with `/w750-rw/` to force WebP delivery at optimal widths.
        
    *   **Search Control**: Forcing `max-results=7` on all label links to stabilize layout and prevent grid breaking.
        
*   **Normalization**:
    
    *   **Date Formatting**: Reordering "Month DD, YYYY" into "YYYY/MM/DD" using regex.
        
    *   **Dynamic SVG**: Real-time calculation of SVG coordinates to draw radar charts from plain data (e.g., `<dd>` tags).
        

## Pattern 2: Reconstructing Advanced Pagination via Blogger API

### Challenges

Standard pagination only allows relative "Next/Previous" movement:

*   **Poor Usability**: Users cannot jump directly to specific pages.
    
*   **Inconsistent Display Counts**: Archive and search pages ignore custom counts, breaking grid designs.
    
*   **Missing Metadata**: No native way to retrieve total post counts for dynamic UI building.
    

### Implementation Details

*   **Feed API (JSON) Integration**: Fetching `/feeds/posts/summary` with `max-results=0` to retrieve `openSearch$totalResults` for accurate post counts.
    
*   **Dynamic Paging Navigation**: Calculating total pages based on a fixed `maxResults` (e.g., 7) and rendering numbered links with `...` truncation.
    
*   **Precision Jumps via `updated-max`**: Identifying the first post of a target page via API and redirecting using its timestamp (`published`) as a URL parameter.
    
*   **Forced Filtering**: A two-step control using URL parameters and `display: none !important` via JS to strictly maintain the 7-post limit on archive pages.
    

## Pattern 3: External Integration and UX Sophistication

### Challenges

Advanced operations that are difficult to solve within Blogger alone:

*   **Dynamic Data Usage**: Limitations in implementing rankings or related posts using only static templates.
    
*   **Behavior Visualization**: Going beyond Google Analytics to score engagement (read rates/stay time).
    
*   **Performance vs. Revenue**: Preventing layout shifts from auto-ads while optimizing AdSense delivery.
    

### Implementation Details

*   **GAS (Google Apps Script) Backend**:
    
    *   **Engagement Logging**: Calculating stay time and scroll rates via `visibilitychange` and `navigator.sendBeacon`, then sending data to GAS for custom scoring.
        
    *   **Ranking Display**: Fetching aggregated JSON from GAS to render stylized ranking tables.
        
*   **Asynchronous Related Posts**: Generating random related post cards by calling the Feed API asynchronously, optimized with high-quality WebP thumbnails.
    
*   **Archive Widget Customization**: Injecting expand/collapse logic for yearly archives and using `removeChild` to physically remove posts exceeding the 7-item limit.
    
*   **Ad Optimization**: Using `MutationObserver` to detect and remove Google Auto-Ads instantly, and lazy-loading the AdSense script 2 seconds after `window.load` to protect LCP.
    

## Insights

*   **Zero-Server Sophistication**: Utilizing GAS as a serverless backend allows for database-like features without maintenance costs.
    
*   **Minimal Template Dependency**: By focusing on JS-driven "retrofitting," these features remain portable and easy to maintain even when switching themes.
    
*   **Data-Driven UX**: Replacing rigid server-side constraints with "frontend intelligence" ensures design consistency and improves site-wide navigation.
