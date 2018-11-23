# TRACE Evaluation Anaylsis
### Spilling the TEA

TEA is a tool to help analyze ApplyWeb's TRACE reviews.

## Roadmap
- [ ] Extraction and storage of data
  - [x] Creating a program that can authorize against the TRACE website.
  - [x] Hitting the endpoint that returns JSON metadata for all courses.
  - [x] Storing JSON metadata in a SQL database for caching.
  - [ ] Using the metadata to download the class report data
    - [x] Downloading Excel sheets into memory
    - [x] Get individual question distributions from excel sheets.
    - [ ] Mass downloading of memory
    - [x] Downloading PDFs into memory
    - [x] Get central tendencies from PDF files.
    - [ ] Mass downloading of memory
  - [ ] Storing information received above into a database.
- [ ] Manipulation of data
  - [ ] Normalize section ratings against an overall class central tendency
  - [ ] Transform data from flat row data into nested documents (perhaps querying a relational database generated above and generating a document-based NoSQL one instead)?
  - [ ] ???
- [ ] Analysis on data
  - [ ] ???
- [ ] Visualizing data
  - [ ] Create a webapp?

## Workflow

Currently, TRACE reviews are authenticated via SAML. To access reviews, we need to first authenticate our application against the university's SAML. After we have authenticated our application, we start looking at how many reports we need to fetch. TEA caches the metadata after we fetch it, so we don't hit ApplyWeb's endpoint every time we run this. If the cache doesn't have as many reports as live data, we'll fetch as many as we need. (Currently brokenish).

## Configuration

TEA will accept either a username and password passed as `TEA_USERNAME` and `TEA_PASSWORD` as environment variables or as `username` and `password` fields in `config.toml`. If you choose to use the `.toml` file, you must either create the config yourself or try running the program once without the aforementioned environment variables. It will create the config file for you.
