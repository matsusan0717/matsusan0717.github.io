# Custom "Like" Button Implementation: GAS + Spreadsheet

This document details the strategy for implementing a lightweight, self-hosted reaction system for Blogger using Google Apps Script (GAS) and Google Sheets.

## 1. Core Concept

*   **Problem:** Blogger lacks a built-in reaction/like feature. Third-party widgets are often heavy, non-customizable, and store data on external servers.
    
*   **Solution:** Build a serverless backend using GAS as the API layer and Google Sheets as the database.
    
*   **Identification:** Use `location.href` as the unique ID to manage individual counts for every article with a single script.
    

## 2. Implementation Architecture

### Backend: Google Apps Script (GAS)

The script handles asynchronous requests via `doGet` and `doPost`.

*   **GET:** Retrieves the current count for a specific URL.
    
*   **POST:** Increments the count in the spreadsheet.
    

### Frontend: Lightweight JavaScript & CSS

*   **Asynchronous Fetch:** Updates counts without page reloads using the `fetch` API.
    
*   **Immediate Feedback:** Optimistic UI updates (incrementing the display count before the server responds) ensure a "snappy" user experience.
    

## 3. Interaction & Visual Patterns

### ❌ Ineffective Pattern

Static buttons with no feedback or relying on heavy external libraries.

### ✅ Effective Pattern (The "Interactive Heart")

```
// State Management: Toggle classes and disable on click
const likeBtn = document.getElementById("like-button");
likeBtn.addEventListener("click", () => {
    likeBtn.classList.add("animated-pop"); // Trigger CSS Scale animation
    likeBtn.disabled = true; // Prevent double-clicking
    // Change icon from regular to solid using FontAwesome classes
    icon.classList.replace("far", "fas"); 
});
```

## 4. Why This Works (Insights)

*   **Reciprocity Principle:** Visualizing reader reactions serves as the primary motivation for consistent writing.
    
*   **Zero-Cost Ecosystem:** By staying within the Google environment (Blogger + GAS + Sheets), the entire system remains maintenance-free and accessible via a single Google account.
    
*   **Data as Asset:** All reaction data is stored in a spreadsheet, allowing for easy, independent analysis of popular content without needing complex database tools.
    

## 5. Implementation Matrix

| Feature        | Technology                  | Benefit                             |
|----------------|----------------------------|-------------------------------------|
| Database       | Google Sheets              | Transparent data management / Zero cost |
| API Layer      | Google Apps Script         | Serverless execution / No hosting required |
| UI/UX          | CSS `transform: scale()`    | Satisfying "micro-interaction"      |
| Communication  | Fetch API (CORS)           | Seamless, non-blocking updates      |
