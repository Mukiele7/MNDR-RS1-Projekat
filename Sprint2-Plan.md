# Sprint 2 - Advanced Features (30 bodova)
**Trajanje:** December 1 - January 15  
**Cilj:** Implementacija naprednih funkcionalnosti za poboljšanje korisničkog iskustva

---

## 🎯 Epic 1: UI/UX Enhancement Features (12 bodova)

### Feature 1.1: Table Sorting Functionality (3 boda)
**Parent Epic:** UI/UX Enhancement

#### Tasks:
- [ ] **Backend:** Add sorting parameters to GetMajstoriQuery (Ime, Specijalnost, Ocjena, Cijena)
- [ ] **Backend:** Add sorting parameters to GetOglasQuery (Datum, Kategorija, Cijena)
- [ ] **Backend:** Add sorting parameters to GetUgovoreQuery (DatumKreiranja, Status, Cijena)
- [ ] **Frontend:** Implement MatSort for Majstori table component
- [ ] **Frontend:** Implement MatSort for Oglasi list component
- [ ] **Frontend:** Implement MatSort for Ugovori table component
- [ ] **Testing:** Test all sorting combinations

**Estimate:** 4-5 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 1.2: Favorites System for Majstori (2 boda)
**Parent Epic:** UI/UX Enhancement

#### Tasks:
- [ ] **Backend:** Create OmiljeniMajstor entity (KupacID, MajstorID, DatumDodavanja)
- [ ] **Backend:** Create AddFavoriteCommand + Handler
- [ ] **Backend:** Create RemoveFavoriteCommand + Handler
- [ ] **Backend:** Create GetFavoriteMajstoriQuery + Handler
- [ ] **Backend:** Add FavoritesController endpoints
- [ ] **Frontend:** Create favorites.service.ts
- [ ] **Frontend:** Add favorite button/icon on Majstor card
- [ ] **Frontend:** Create "Moji Omiljeni Majstori" page
- [ ] **Testing:** Test add/remove favorite functionality

**Estimate:** 3 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 1.3: Autocomplete Search for Majstori (2 boda)
**Parent Epic:** UI/UX Enhancement

#### Tasks:
- [ ] **Backend:** Update GetMajstoriQuery to support partial name search
- [ ] **Backend:** Add search suggestions endpoint (top 5 results)
- [ ] **Frontend:** Install Angular Material Autocomplete
- [ ] **Frontend:** Implement mat-autocomplete in search field
- [ ] **Frontend:** Add debounce for search requests (300ms)
- [ ] **Frontend:** Display suggestions with avatar + specijalnost
- [ ] **Testing:** Test autocomplete performance

**Estimate:** 3 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 1.4: Image Zoom Functionality (2 boda)
**Parent Epic:** UI/UX Enhancement

#### Tasks:
- [ ] **Frontend:** Install ngx-image-zoom or similar library
- [ ] **Frontend:** Implement zoom on Majstor profile images
- [ ] **Frontend:** Implement zoom on Oglas gallery images
- [ ] **Frontend:** Add zoom controls (+ / - buttons)
- [ ] **Testing:** Test zoom on different image sizes

**Estimate:** 2 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 1.5: Carousel/Slideshow for Portfolio (2 boda)
**Parent Epic:** UI/UX Enhancement

#### Tasks:
- [ ] **Frontend:** Install ngx-carousel or Angular Material carousel
- [ ] **Frontend:** Create carousel component for Majstor portfolio
- [ ] **Frontend:** Add navigation arrows (prev/next)
- [ ] **Frontend:** Add dots indicator
- [ ] **Frontend:** Add auto-play option (optional)
- [ ] **Styling:** Responsive design for mobile
- [ ] **Testing:** Test carousel on different screen sizes

**Estimate:** 3 hours  
**Assigned To:** Muhamed Muslimić

---

## 🎯 Epic 2: Media Management (5 bodova)

### Feature 2.1: Image Gallery System (5 bodova)
**Parent Epic:** Media Management

#### Tasks:
- [ ] **Backend:** Create PortfolioSlika entity (MajstorID, SlikaURL, Opis, Datum)
- [ ] **Backend:** Create UploadPortfolioSlikaCommand + Handler
- [ ] **Backend:** Create DeletePortfolioSlikaCommand + Handler
- [ ] **Backend:** Create GetPortfolioSlikeQuery + Handler
- [ ] **Backend:** Add PortfolioController endpoints
- [ ] **Backend:** Implement file validation (size, type)
- [ ] **Frontend:** Create portfolio-gallery.component.ts
- [ ] **Frontend:** Implement multi-file upload with preview
- [ ] **Frontend:** Create gallery grid view (responsive)
- [ ] **Frontend:** Add lightbox for full-size image view
- [ ] **Frontend:** Add delete functionality for own images
- [ ] **Testing:** Test upload multiple files
- [ ] **Testing:** Test gallery pagination

**Estimate:** 6 hours  
**Assigned To:** Muhamed Muslimić

---

## 🎯 Epic 3: Location & Mapping (6 bodova)

### Feature 3.1: Map Integration with Markers (3 boda)
**Parent Epic:** Location & Mapping

#### Tasks:
- [ ] **Backend:** Add Latitude/Longitude fields to Majstor entity
- [ ] **Backend:** Update CreateMajstorCommand to include location
- [ ] **Backend:** Update GetMajstoriQuery to return location data
- [ ] **Frontend:** Install Leaflet (npm install leaflet)
- [ ] **Frontend:** Create map.component.ts
- [ ] **Frontend:** Initialize Leaflet map
- [ ] **Frontend:** Add markers for all Majstori on map
- [ ] **Frontend:** Custom marker icons by Kategorija
- [ ] **Frontend:** Click on marker shows Majstor info popup
- [ ] **Frontend:** Link from popup to Majstor profile
- [ ] **Testing:** Test map with multiple markers

**Estimate:** 6 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 3.2: Routes and Distance Calculation (3 boda)
**Parent Epic:** Location & Mapping

#### Tasks:
- [ ] **Backend:** Create CalculateDistanceQuery (from user location to Majstor)
- [ ] **Backend:** Implement Haversine formula for distance calculation
- [ ] **Backend:** Return distance in kilometers
- [ ] **Frontend:** Get user's current location (Geolocation API)
- [ ] **Frontend:** Display distance on Majstor cards
- [ ] **Frontend:** Add "Show Route" button on map
- [ ] **Frontend:** Use Leaflet Routing Machine for route display
- [ ] **Frontend:** Show estimated travel time
- [ ] **Testing:** Test route calculation

**Estimate:** 4 hours  
**Assigned To:** Muhamed Muslimić

---

## 🎯 Epic 4: Real-Time Communication (11 bodova)

### Feature 4.1: SignalR Backend Setup (4 boda)
**Parent Epic:** Real-Time Communication

#### Tasks:
- [ ] **Backend:** Install Microsoft.AspNetCore.SignalR NuGet package
- [ ] **Backend:** Create ChatHub class
- [ ] **Backend:** Configure SignalR in Program.cs
- [ ] **Backend:** Implement SendMessage method in Hub
- [ ] **Backend:** Implement user connection tracking
- [ ] **Backend:** Create SignalR authentication/authorization
- [ ] **Backend:** Store messages in database via RazgovorPoruka
- [ ] **Backend:** Implement GetConnectionIdForUser method
- [ ] **Testing:** Test Hub connectivity

**Estimate:** 8 hours  
**Assigned To:** Muhamed Muslimić

---

### Feature 4.2: SignalR Frontend + Typing Indicator (7 bodova)
**Parent Epic:** Real-Time Communication

#### Tasks:
- [ ] **Frontend:** Install @microsoft/signalr npm package
- [ ] **Frontend:** Create signalr.service.ts
- [ ] **Frontend:** Implement HubConnection setup
- [ ] **Frontend:** Connect to ChatHub on app initialization
- [ ] **Frontend:** Update razgovor.component.ts for real-time messages
- [ ] **Frontend:** Implement SendMessage via SignalR
- [ ] **Frontend:** Implement ReceiveMessage listener
- [ ] **Frontend:** Add auto-scroll to latest message
- [ ] **Frontend:** Implement "User is typing..." indicator
- [ ] **Frontend:** Send typing notification on keypress (debounced)
- [ ] **Frontend:** Display typing indicator in chat UI
- [ ] **Frontend:** Add online/offline status indicator
- [ ] **Styling:** Real-time message animations
- [ ] **Testing:** Test chat between two users
- [ ] **Testing:** Test typing indicator

**Estimate:** 8 hours  
**Assigned To:** Muhamed Muslimić

---

## 📊 Summary

| Epic | Features | Bodova | Estimate |
|------|----------|--------|----------|
| UI/UX Enhancement | 5 | 12 | 15-17h |
| Media Management | 1 | 5 | 6h |
| Location & Mapping | 2 | 6 | 10h |
| Real-Time Communication | 2 | 11 | 16h |
| **TOTAL** | **10** | **34** | **47-49h** |

---

## 📝 Definition of Done
- [ ] Backend code implemented with proper error handling
- [ ] Frontend UI implemented and styled
- [ ] All endpoints tested via Postman/HTTP file
- [ ] Frontend-Backend integration working
- [ ] No console errors or warnings
- [ ] Code committed with descriptive messages
- [ ] Sprint demo prepared

---

## 🎯 Sprint Goals
1. Poboljšanje korisničkog interfejsa (Sortiranje, Favorites, Autocomplete)
2. Implementacija naprednih media funkcionalnosti (Gallery, Carousel, Zoom)
3. Integracija mapa za prikaz i pronalaženje majstora
4. Real-time chat komunikacija između kupaca i majstora

**Prioritet:** Sortiranje → Favorites → Gallery → Maps → SignalR
