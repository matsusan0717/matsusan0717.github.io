# Blogger Pagination Implementation Patterns

## Overview

Technical essentials for replacing Blogger's standard "Newer/Older Posts" links with numbered navigation.

## Core Knowledge

*   **Feed Retrieval**: Use `/feeds/posts/summary?alt=json`.
    
*   **Challenge**: When using OR searches (`label:A|label:B`), the total count becomes inaccurate.
    
*   **Solution**: Set `max-results` to approximately 50 instead of 0 during fetch, and supplement using `entry.length`.
    

## Tips for AI Prompting

Instruct the AI to "Maintain consistency with the existing pager function while preserving chronological order using the updated-max parameter" to prevent infinite loops.

# PATTERN: Blogger Client-Side Smart Pagination

**APPLIES_TO**

*   Blogger index pages
    
*   Label pages
    
*   Search pages
    
*   Monthly archive pages
    

### PROBLEM

Blogger's standard pagination has the following constraints:

*   Difficult UI customization
    
*   Weak page number navigation
    
*   Inconsistent behavior across labels / search / monthly archives
    
*   Decreased discoverability as post counts increase
    

Furthermore, because standard Blogger navigation depends on the template structure, it is difficult to:

*   Change designs
    
*   Improve UI
    
*   Extend navigation
    

### SOLUTION

Utilize the Blogger JSON Feed to generate pagination on the client side. By processing the following via JavaScript during page transitions:

*   Total post count retrieval
    
*   Current page calculation
    
*   Page number generation
    

A completely custom pagination UI can be achieved.

### TECHNIQUES

#### Feed API

`/feeds/posts/summary?alt=json`

**Retrieved Data**

*   `openSearch$totalResults`
    
*   `entry.published`
    

Through this, calculate:

*   Total post count
    
*   Page boundaries
    

#### Pagination Logic

**Page Calculation** `totalPage = ceil(totalPosts / maxResults)` `currentPage = floor(start / maxResults) + 1`

**Display Range Control** `maxResults = 7` `dispPage = 2`

This generates smart navigation where:

*   Only pages around the current page are displayed
    
*   The first and last pages are always visible
    
*   The middle sections are truncated with `...`
    

#### Archive Compatibility

For monthly archives, use `published-min` and `published-max` to build pagination targeting only the posts within that specific month.

#### Search Compatibility

For search pages, append `?q=keyword` during feed retrieval to generate pagination targeting only the search results.

#### DOM Manipulation

If the existing Blogger pager does not exist, automatically generate it via JavaScript. Target: `#blog-pager`

After generation, dynamically insert:

*   Page numbers
    
*   Prev / Next
    
*   Truncation dots
    

#### Post Visibility Control

Since Blogger may load extra posts into the page, monitor `.post-outer` within the DOM and hide posts where: `index >= maxResults`

Through this:

*   Strictly control the number of posts displayed per page
    
*   Prevent layout collapse on archive pages
    

#### UX Enhancements

The pagination UI is fully customizable via CSS.

**Features**

*   Capsule-style navigation
    
*   Prev / Next buttons
    
*   Active page highlighting
    
*   Mobile responsive support
    
*   Font Awesome arrow icons
    

### INSIGHT

Blogger pagination originally depends on a **server-side structure**. In this pattern, it is replaced with **data-driven navigation** through: `Feed Retrieval` → `Total Count Calculation` → `Page Number Generation` → `DOM Rendering`

This enables:

*   Elimination of template dependency
    
*   Complete UI freedom
    
*   Compatibility with all page types
    

### REUSE

This pagination pattern is applicable to:

*   Blog Top
    
*   Label lists
    
*   Search results
    
*   Monthly archives
    
*   Custom post lists
