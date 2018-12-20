import { gql } from 'apollo-server-core';

export default gql`
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

  type Professor {
    number: Int
  }

  type Class {
    number: Int
  }

  type Query {
    report(id: Int, professorId: Int, ): [Report]
    professor(id: Int!): Professor
    class(subject: String!, number: Int!): Class
  }
`;
