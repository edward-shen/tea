import { gql } from 'apollo-server-core';

export default gql`
  type WorkloadQuestion {
    "'17-20', '13-16', '9-12', '5-8', '1-4'"
    hours: [Int!]!
  }

  type Question {
    question: String
    "Contains 5 integers of the counts of the ratings, from 1-5 respectively"
    ratings: [Int!]!
    mean: Float!
    median: Float!
    stdDev: Float!
    respRate: Float!
    courseMean: Float
    deptMean: Float
    univMean: Float
  }

  type QuestionWithNA {
    question: String
    "Contains 5 integers of the counts of the ratings, from 1-5 respectively"
    ratings: [Int!]!
    mean: Float!
    median: Float!
    stdDev: Float!
    respRate: Float!
    courseMean: Float
    deptMean: Float
    univMean: Float
    NAs: Int!
  }

  type QuestionSummary {
    mean: Float!
    deptMean: Float!
    univMean: Float!
    median: Int!
    deptMedian: Int!
    univMedian: Int!
    stdev: Float!
  }

  type NAQuestions {
    summary: QuestionSummary
    questions: [QuestionWithNA!]!
  }

  type Questions {
    summary: QuestionSummary
    questions: [Question!]!
  }

  type SectionQuestions {
    class: NAQuestions!
    learning: NAQuestions!
    instructor: NAQuestions!
    effectiveness: Questions!
    workload: WorkloadQuestion!
  }

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
    questions: SectionQuestions!
  }

  type Professor {
    number: Int!
  }

  type Class {
    number: Int!
  }

  type Query {
    report(id: Int, professorId: Int): [Report!]
    professor(id: Int!): Professor!
    class(subject: String!, number: Int!): Class!
  }
`;
