export default `
  type Query {
    report(id: Int, professorId: Int, ): [Report]
    professor(id: Int!): Professor
    class(subject: String!, number: Int!): Class
  }
`;
