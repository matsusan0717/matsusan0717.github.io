# Pattern: "Portal-style" Transformation and Dynamic Effects for Blogger Top Page

## Issues

The standard Blogger top page merely lists posts chronologically, posing the following challenges:

*   **Fixed First Impression**: Since the same posts always remain at the top, the sense of "freshness" for returning visitors is low.
    
*   **Lack of Information Hierarchy**: Important articles, essays to be read, and the latest customization history are all listed equally, leading to weak user guidance.
    
*   **Insufficient Visual Impact**: Static images and text alone struggle to catch the eye of users accustomed to modern, rich UIs.
    

## Implementation (Practice)

### 1. "Random Hero Unit" to Manage Expectations

Implemented an AB-test-style hero area where the displayed content changes with each access.

*   **Dynamic Lottery Logic**: Uses JavaScript to randomly select one "winner" from multiple `.random-unit` elements (Winner-takes-all method).
    
*   **Diagonal Cut Design**: Applied `clip-path: polygon` to break the standard grid and provide a modern visual effect.
    

### 2. "High-End Interactive Slider" using GSAP

Built a professional-grade slider fully utilizing the timeline features of GSAP (GreenSock).

*   **Asynchronous Rendering**: Holds article data (arrays) on the JS side and dynamically generates the DOM. Includes a "loading screen" that fades in after image preloading is complete.
    
*   **Advanced Animation**: Controls card movement, scaling, wrapping to the back, and progress bar synchronization in 0.1-second increments.
    
*   **UX Consideration**: In addition to auto-play, implemented a timer reset (`handleNav`) upon detecting user interaction to reduce the stress of the slide moving unexpectedly.
    

### 3. Media Integration (Spotify, etc.)

Added "sound" and "lifestyle" contexts to the blog.

*   **Optimization of Embedding**: Seamlessly placed iframes (Spotify) between article lists to showcase the author's personality from multiple angles.
    

## Why it Works (Insights)

*   **Creating "Serendipity"**: The random post feature reactivates traffic to high-quality past articles (the long tail) that tend to get buried.
    
*   **Increased Dwell Time**: Moving sliders and embedded music provide an "experience" beyond mere text browsing, contributing to lower bounce rates.
    
*   **Unlocking Potential as a CMS**: Proves that even on a restricted platform like Blogger, combining external libraries (GSAP) with creative CSS can achieve a level of freedom comparable to a Headless CMS.
