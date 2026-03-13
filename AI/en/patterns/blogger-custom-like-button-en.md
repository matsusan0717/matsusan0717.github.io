# Pattern: Implementing a "Custom Like Button" with GAS and Google Sheets

## Issues

*   **Blogger lacks a built-in "Like" feature for easy reader reactions.**
    
*   **Drawbacks of existing options**: External widgets are heavy to load and offer low design customizability.
    
*   **Data opacity**: It is difficult to personally manage and analyze data on who reacted to which article.
    
*   **Cost**: Building a database server (such as Firebase) incurs operational and learning costs.
    

## Implementation (Practice)

### 1. Utilizing GAS as a "Serverless Database"

*   **Adopted Google Apps Script and Google Sheets as the backend instead of expensive servers.**
    
*   **Distinction between GET/POST**: Built a lightweight communication logic that fetches the current count via `fetch` (GET) on page load and increments the count via `POST` on click.
    
*   **URL Identifier**: Achieved individual count management for all articles with a common script by saving `location.href` as the key (ID) in the spreadsheet.
    

### 2. Interactive Frontend Presentation

*   **Implemented a comfortable micro-interaction using JavaScript and CSS, emphasizing the "pressed feeling."**
    
*   **State Management**: Disabled the button after one press to prevent double-clicking. Dynamically changed the `FontAwesome` class from an "outline heart" to a "filled heart."
    
*   **Animation**: Temporarily applied an `animate` class and added a visual "pop effect" using CSS `transform: scale()`, making the button appear to bounce.
    

### 3. Seamless Experience through Asynchronous Communication

*   **Updated data in the background without page transitions using the `fetch` API.**
    
*   **Instant Feedback**: Created a sense of "speed" for the user by updating the display (+1) on the JS side immediately (or right after success) without waiting for the full server response.
    

## Why it Works (Insights)

*   **"Reciprocity" and Motivation**: Visualizing reactions from readers becomes the greatest motivation for the author to continue writing.
    
*   **Ecosystem Construction**: By completing the system entirely within Google's toolset (Blogger + GAS + Spreadsheet), a "perfectly lightweight system" is achieved that can be maintained with a single Google account.
    
*   **Data as an Asset**: Since data accumulates in a spreadsheet, it is easy to personally aggregate and analyze which articles are popular.
