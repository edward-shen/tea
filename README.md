# TRACE Evaluation Anaylsis
## Spilling the TEA

Extraction and storage of data
  Creating a program that can authorize against the TRACE website.
  Hitting the endpoint that returns JSON metadata for all courses.
  Using the metadata to download the class report in an excel spreadsheet (It does not appear that I can download the data in an simpler format).
  Extracting information out of the excel file and storing it into a database.
Manipulation of data
  Normalize section ratings against an overall class central tendency
  Transform data from flat row data into nested documents (perhaps querying a relational database generated above and generating a document-based NoSQL one instead)
Analysis on data


notalbe linkes
https://www.applyweb.com/eval/new/reportbrowser/evaluatedCourses?excludeTA=false&page=1&rpp=1&termId=0
https://www.applyweb.com/eval/new/showreport?c=37436&i=517&t=86&r=2&embedded=true

## Configuration

TEA will accept either a username and password passed as `TEA_USERNAME` and
`TEA_PASSWORD` as environment variables or as `username` and `password` fields
in `config.toml`. If you choose to use the `.toml` file, you must either create
the config yourself or try running the program once without the aforementioned
environment variables. It will create the config file for you.
