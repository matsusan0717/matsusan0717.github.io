# Pattern: Dynamic In-feed Cards using Blogger JSON Feed

## Issues

The following problems occur when trying to guide readers to the next article after they finish reading:

*   **Obsolescence of Static Links**: Manually placed related article links tend to become "old information" over time.
    
*   **Design Mismatch**: Standard Blogger related post widgets offer low design flexibility, making it difficult to match the tone and manner of the article body.
    
*   **Maintenance Cost**: It is unrealistic to update links in past articles every time a new post is written.
    

## Implementation (Practice)

### 1. Asynchronous Utilization of Blogger Feed API

Leveraged Blogger's hidden powerful feature, `feeds/posts/default?alt=json-in-script`, to fetch data on the client side.

*   **Random Extraction of Latest Articles**: Randomly selects one post from the latest 10 (`max-results=10`) using JavaScript. This prevents returning visitors from getting bored by changing the suggestion each time.
    
*   **Cache Avoidance**: Appends a timestamp (`t=${new Date().getTime()}`) to the end of the URL to ensure the latest feed information is always retrieved.
    

### 2. Modern UI with "Diagonal Cuts"

A design that stands out from existing templates by using CSS `transform: skewX()`.

*   **Responsive Transform**: Switches between vertical stacking on mobile and horizontal stacking using `row-reverse` on PC. On PC, the background of the text area is cut diagonally, creating rhythm at the boundary with the image.
    
*   **Image High-Quality Processing**: Uses regular expressions (`.replace(/\/s[0-9]+(-c)?/, '/w600')`) to dynamically replace Blogger thumbnail URLs with clear, high-quality images (`w600`).
    

### 3. Context-Preserving Snippet Generation

*   **Clean Summaries**: Completely removes HTML tags using regular expressions to extract pure text only. Displays readable snippets that feel natural even when placed within the article body.
    

## Why it Works (Insights)

*   **Automatic Freshness of Internal Links**: Once the script is installed, new articles automatically flow as in-feed content, ensuring the path from old articles to the latest ones never dies.
    
*   **Visual "Breather"**: In long articles, inserting a sophisticatedly designed card heals the reader's visual fatigue and guides their gaze to the next point of interest.
    
*   **Safety within the Domain**: Since no external recommendation widgets are used, it is completely unaffected by privacy policy concerns or external server downtime.
