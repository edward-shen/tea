import * as React from 'react';
import { Query } from 'react-apollo';

import BaseProps from '../BaseProps';
import ReportHeader from './ReportHeader';
import ReportBody from './ReportBody';
import Sections from './Sections';
import ReportSummaryQuery from './queries/ReportSummaryQuery';

class ReportView extends React.Component<BaseProps> {
  public render() {
    const queryVars = {
      id: Number(this.props.match.params.id),
      professorId: Number(this.props.match.params.prof),
    };

    return <Query query={ReportSummaryQuery} variables={queryVars}>
      {({ loading, error, data }) => {
        if (loading) {
          return <p>Loading report, please be patient!</p>;
        }

        if (error) {
          return `Error: ${error.message}`;
        }

        const ratingsToShow = [
          { name: Sections.CLASS, ...data.report[0].questions.class.summary },
          { name: Sections.LEARNABILITY, ...data.report[0].questions.learning.summary },
          { name: Sections.INSTRUCTOR, ...data.report[0].questions.instructor.summary },
          { name: Sections.EFFECTIVENESS, ...data.report[0].questions.effectiveness.summary },
        ];

        return (
          <main className='reportview'>
            <ReportHeader
              subject={data.report[0].subject}
              number={data.report[0].number}
              name={data.report[0].name}
              ratings={ratingsToShow}/>
            <ReportBody queryVars={queryVars}/>
          </main>
        );

      }}
    </Query>;
  }
}

export default ReportView;
