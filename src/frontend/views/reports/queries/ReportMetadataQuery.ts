import { gql } from 'apollo-boost';

export default gql`
  query($id: Int!, $professorId: Int) {
    report(id: $id, professorId: $professorId) {
      enrollment
      responses
      declines
      instructorId
      instructorFirstName
      instructorLastName
      termTitle
      type
      questions {
        workload {
          hours
        }
      }
    }
  }
`;
