
# Roadmap

This roadmap is completely subject to change and makes no guarantees.

- [x] Extraction and storage of data
  - [x] Creating a program that can authorize against the TRACE website.
  - [x] Hitting the endpoint that returns JSON metadata for all courses.
  - [x] Storing JSON metadata in a SQL database for caching.
  - [x] Using the metadata to download the class report data
    - [x] Downloading Excel sheets into memory
    - [x] Get individual question distributions from excel sheets.
    - [x] Mass downloading of memory
    - [x] Downloading PDFs into memory
    - [x] Get central tendencies from PDF files.
    - [x] Mass downloading of memory
  - [x] Storing information received above into a database.
- [ ] Frontend
  - [x] Setup basic webapp
    - [x] Implement express backend
    - [x] Implement basic react frontend
  - [ ] Reports
    - [ ] Drop in replacement for Reports
    - [ ] Links to professors and classes
  - [ ] Classes
    - [ ] Historical Data
    - [ ] Top professor
    - [ ] Most common professor
    - [ ] ???
  - [ ] Professors
    - [ ] Average rating
    - [ ] Best class
    - [ ] worst class
    - [ ] ???
- [ ] Move over to GraphQL
  - [ ] Clean up APIs
  - [ ] Remove unnecessary types
- [ ] Run in production
  - [ ] Fix things in production because I have no idea how to run things in production,
