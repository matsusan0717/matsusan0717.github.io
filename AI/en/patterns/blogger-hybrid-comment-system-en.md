# Building a Blogger Hybrid Comment System

## Overview

A hack to hide the standard Blogger comment section and implement "giscus" (utilizing GitHub Discussions) as the primary system, while maintaining a "Blogger Standard Pop-out Window" bypass for non-GitHub users.

## Implementation Points

*   **Giscus Integration**: Secures a modern discussion space.
    
*   **Strategic Hiding of Standard Features**: Uses `display: none !important;` to force-remove the default, heavy comment section.
    
*   **Pop-out Window Bypass**: Uses `window.open` to provide a lightweight, separate window for standard comments.
    
*   **Settings Adjustment**: By changing the Blogger "Comment Location" to "Pop-up window," inline display is brought under full control.
    

## Implementation Code

### 1. For Post Pages (item): giscus + Bypass Button

Insert this into your Blogger HTML theme where you want comments to appear (typically after `data:post.body`).

```
<b:if cond='data:blog.pageType == "item"'>
  <div id='custom-giscus-container' style='margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;'>
    <div style='display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;'>
      <h3 style='font-size: 1.2rem; margin: 0;'><i class='fa-solid fa-comments'/> Comments & Feedback</h3>
      <small>
        <a expr:href='"[https://www.blogger.com/comment-iframe.g?blogID=](https://www.blogger.com/comment-iframe.g?blogID=)" + data:blog.blogId + "&amp;postID=" + data:post.id + "&amp;isPopup=true"' 
           onclick='window.open(this.href, "blogger_comment", "width=600,height=600,scrollbars=yes,resizable=yes"); return false;' 
           style='color: #888; text-decoration: underline; cursor: pointer;'>
           <i class='fa-solid fa-comments'/> Comment without GitHub
        </a>
      </small>
    </div>
    <script async='async' crossorigin='anonymous' 
            data-category='Announcements' 
            data-category-id='DIC_kwDORj0uG84ClC7w' 
            data-repo='matsusan0717/my-digital-garden-comments' 
            src='[https://giscus.app/client.js](https://giscus.app/client.js)'></script>
  </div>
  <style>
    #comments { display: none !important; } /* Force hide standard comment section */
  </style>
</b:if>
```

### 2. For Static Pages (static_page): Button Hack

A style adjustment that highlights only the post button without displaying the comment list.

```
<b:if cond='data:blog.pageType == "static_page"'>
  <style>
    /* Remove unnecessary text like "0 comments" */
    #comments h4, #comments #Blog1_comments-block-wrapper, #comments #backlinks-container {
      display: none !important;
    }
    /* Redefine standard links as buttons */
    #comments .comment-footer a {
      display: inline-block !important;
      padding: 10px 20px;
      background-color: #24292f;
      color: #ffffff !important;
      border-radius: 6px;
      font-weight: bold;
      text-decoration: none;
    }
    /* Remove outer frame and center-align */
    #comments.card.cpadding {
      border: none !important;
      background: transparent !important;
      text-align: center;
    }
  </style>
</b:if>
```

## Core Design Philosophy

*   **Maintain Design Purity**: By using giscus as the primary system, design consistency is maintained. Standard Blogger UI elements that detract from the aesthetic are excluded from the main view.
    
*   **Consideration for Non-GitHub Users**: Avoids creating a barrier for users without accounts. Implemented as a "Pop-out (separate window)" route to avoid breaking the main design.
    
*   **Load Optimization**: By not loading the heavy standard comment section inline and only invoking the pop-out when needed, LCP (Largest Contentful Paint) is maximized.
