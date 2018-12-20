export default `
  type Report {
    "The TRACE id of the report"
    id: Int!
    instructorId: Int!
    termId: Int!
    subject: String!
    number: Int!
    termTitle: String!
    name: String!
    instructorFirstName: String!
    instructorLastName: String!
    termEndDate: Int!
    enrollment: Int!
    sourceId: Int!
    type: String!
    level: String!
    responses: Int!
    declines: Int!
  }
`;
