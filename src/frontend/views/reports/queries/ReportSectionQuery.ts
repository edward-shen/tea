import { gql } from 'apollo-boost';

export default gql`
  query($id: Int!, $professorId: Int) {
    report(id: $id, professorId: $professorId) {
      responses
      questions {
        class {
          summary {
            mean
            median
            stdev
            deptMean
            deptMedian
            univMean
            univMedian
          }
          questions {
            NAs
            ratings
            courseMean
            deptMean
            univMean
            stdDev
            question
            deptMean
            univMean
            courseMean
          }
        }
        learning {
          summary {
            mean
            median
            stdev
            deptMean
            deptMedian
            univMean
            univMedian
          }
          questions {
            NAs
            ratings
            courseMean
            deptMean
            univMean
            stdDev
            question
            deptMean
            univMean
            courseMean
          }
        }
        instructor {
          summary {
            mean
            median
            stdev
            deptMean
            deptMedian
            univMean
            univMedian
          }
          questions {
            NAs
            ratings
            courseMean
            deptMean
            univMean
            stdDev
            question
            deptMean
            univMean
            courseMean
          }
        }
        effectiveness {
          summary {
            mean
            median
            stdev
            deptMean
            deptMedian
            univMean
            univMedian
          }
          questions {
            ratings
            courseMean
            deptMean
            univMean
            stdDev
            question
            deptMean
            univMean
            courseMean
          }
        }
      }
    }
  }
`;
