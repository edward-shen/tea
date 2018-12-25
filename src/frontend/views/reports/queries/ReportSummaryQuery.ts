import { gql } from 'apollo-boost';

export default gql`
  query($id: Int!, $professorId: Int) {
    report(id: $id, professorId: $professorId) {
      subject
      number
      name
      questions {
        class {
          summary {
            mean
            deptMean
          }
        }

        learning {
          summary {
            mean
            deptMean
          }
        }

        instructor {
          summary {
            mean
            deptMean
          }
        }

        effectiveness {
          summary {
            mean
            deptMean
          }
        }
      }
    }
  }
`;
