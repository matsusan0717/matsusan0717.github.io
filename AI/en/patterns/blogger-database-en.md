# PATTERN: Blogger GAS Music Database

## APPLIES_TO

- Blogger
- Google Apps Script
- Google Spreadsheet
- Client-side database UI

---

# OVERVIEW

A client-side search system that displays music data in a **card-based UI**,  
using **Google Spreadsheet as the database** on a Blogger site.

Data is retrieved via the **Google Apps Script Web App API**, and JavaScript is used to perform:

- Filtering
- Searching
- Sorting
- UI rendering

The system also includes a **like feature (THUMBSUP)** that writes data back to the spreadsheet via GAS.

---

# DATA STRUCTURE

Data is managed using **Google Spreadsheet**.

## Main Columns

```
Jacket
Track
Title
Artist
Spotify
Vocal
Cho
Album Name
Release Date
Catalog Number
Lyrics
Composition
Arrangement
Alias
S/U
Unit Members
Notes
Format
THUMBSUP
```

## Column Roles

| Column | Purpose |
|---|---|
| Jacket | Card image |
| Title | Song title |
| Artist | Performer |
| Spotify | Spotify link |
| Vocal | Main vocal |
| Cho | Chorus |
| S/U | Solo or Unit |
| Unit Members | Unit composition |
| Release Date | Year filter |
| Catalog Number | Blogger search key |
| THUMBSUP | Like count |

---

# DATA FETCH

Data is retrieved from a **GAS Web App API**.

```
https://script.google.com/macros/s/xxxxx/exec
```

## Request

```javascript
fetch(GAS_WEB_APP_URL)
```

After retrieval:

```javascript
allData = data.map(item => ({
  ...item,
  THUMBSUP: Number(item["THUMBSUP"]) || 0
}))
```

---

# CARD UI RENDERING

Data is rendered as **card UI components**.

## Card Structure

- Jacket image
- Title
- Album
- Release date
- Catalog number
- Lyrics
- Composition
- Arrangement
- Vocal
- Chorus
- Notes
- Spotify link
- Like button

## DOM Rendering

```javascript
renderCards(data)
```

## Features

- Responsive design
- Vertical layout on mobile
- Spotify icon display

---

# FILTER SYSTEM

A **client-side filtering system** with multiple conditions.

## Filters

- Year
- Member
- Solo / Unit
- Chorus
- Album
- Keyword

## State Management

```javascript
currentFilters = {
  year,
  searchTerm,
  selectedMembers,
  suType,
  selectedAlbum
}
```

## Filtering Process

```javascript
applyFilters()
```

---

# MEMBER FILTER LOGIC

Member search uses **AND logic**.

Example

```
Ryoko Shinohara + Chisa Kawamura
```

Implementation

```javascript
selectedMembers.every()
```

Search fields

- Artist
- Alias
- Vocal
- Unit members
- Chorus

---

# KEYWORD SEARCH

Keyword search uses

```
Space-separated AND search
```

Example

```
Ryoko Shinohara live
```

Implementation

```javascript
keywords.every(keyword =>
  textToSearch.includes(keyword)
)
```

Search target fields

- Title
- Artist
- Vocal
- Chorus
- Lyrics
- Composition
- Arrangement
- Catalog number
- Notes
- Album name

---

# YEAR FILTER

Years are **automatically generated** from the release date.

Processing

```javascript
populateYearFilter()
```

Algorithm

```
Remove duplicates with Set
↓
Sort
↓
Generate select options
```

---

# ALBUM LINK FILTER

Clicking an album name filters songs from the **same album**.

Attribute used

```
data-album-name
```

Click event

```javascript
currentFilters.selectedAlbum = albumName
```

---

# THUMBS UP SYSTEM

The like system uses the **GAS POST API**.

## Request

```javascript
fetch(GAS_WEB_APP_URL, {
  method: "POST",
  body: FormData
})
```

## Parameter

```
hinban
```

## GAS-side Processing

```
THUMBSUP++
```

## UI Update

```javascript
countSpan.textContent = result.newThumbsUp
```

---

# UI COMPONENTS

## Interface Structure

- Year filter
- Search form
- Member checkboxes
- Solo / Unit radio buttons
- Card list

## UX Features

- Custom checkboxes
- Custom radio buttons
- Loading spinner
- Reset button

---

# BLOGGER INTEGRATION

Clicking the title triggers a **Blogger internal search**.

URL

```
/search?q=CatalogNumber
```

This enables navigation:

```
Song DB → Related Articles
```

---

# SPOTIFY INTEGRATION

If a Spotify link exists, a **Spotify icon** is displayed.

```
target="_blank"
```

---

# PERFORMANCE DESIGN

All processing is **client-side**.

Server-side flow

```
GAS
↓
JSON retrieval
```

After that

```
Browser-side processing
```

Advantages

- Independent from Blogger templates
- Flexible DB search UI
- Fast rendering speed

---

# UX FEATURES

- Card UI
- Filter search
- AND search
- Album link filtering
- Like feature
- Spotify integration
- Mobile responsive

---

# INSIGHT

Blogger is not originally designed for **database-style sites**.

This pattern uses the following architecture:

```
Spreadsheet
↓
GAS API
↓
JSON
↓
Client-side rendering
```

This enables Blogger to function as a **lightweight CMS while supporting a database UI**.

---

# REUSE

This pattern can be reused for:

- Music databases
- Book databases
- Movie databases
- Product catalogs
- Archive sites
- Collection management
