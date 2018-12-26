import * as React from 'react';

import ReportMetadata from './ReportMetadata';
import ReportSection from './ReportSection';
import Sections from './Sections';
import ReportQueryProps from './ReportQueryProps';
import { Query } from 'react-apollo';
import ReportMetadataQuery from './queries/ReportMetadataQuery';
import ReportSectionQuery from './queries/ReportSectionQuery';

/**
 * Contains logic for rendering the non-header portion of the report. Generates
 * sections via hard-coded sections that I should really make dynamic.
 */
class ReportBody extends React.Component<ReportQueryProps> {
  public render() {
    return (
      <>
        <Query query={ReportMetadataQuery} variables={this.props.queryVars}>
          {({ loading, error, data }) => {
            if (loading) {
              return null;
            }

            if (error) {
              throw(error);
            }

            return <ReportMetadata {...data.report[0]}/>;
          }}
        </Query>
        <Query query={ReportSectionQuery} variables={this.props.queryVars}>
          {({ loading, error, data }) => {

            if (loading) {
              return null;
            }

            if (error) {
              throw(error);
            }

            return this.getSections(data.report[0]).map((questionData) => {
              return <ReportSection
                key={questionData.name}
                title={questionData.name}
                {...{ responses: data.report[0].responses, ...questionData }}
              />;
            });
          }}
          </Query>
      </>);
  }

  /**
   * Maps report data into data that can be handled by the ReportSection object.
   *
   * Why haven't I been able to get rid of this function?
   * TODO: shape data to not require this (Maybe a nonissue once GraphQL is
   * implemented?)
   */
  private getSections(data) {
    return [
      {
        name: Sections.CLASS,
        data: data.questions.class,
      },
      {
        name: Sections.LEARNABILITY,
        data: data.questions.learning,
      },
      {
        name: Sections.INSTRUCTOR,
        data: data.questions.instructor,
      },
      {
        name: Sections.EFFECTIVENESS,
        data: data.questions.effectiveness,
      },
    ];
  }
}

export default ReportBody;
