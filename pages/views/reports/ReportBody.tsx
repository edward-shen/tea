import * as React from 'react';

import Report from '../../../common/Report';
import ReportMetadata from './ReportMetadata';
import ReportSection from './ReportSection';
import Sections from './Sections';

/**
 * Contains logic for rendering the non-header portion of the report. Generates
 * sections via hard-coded sections that I should really make dynamic.
 */
class ReportBody extends React.Component<Report> {
  public render() {
    return [
      <ReportMetadata key={'metadata'} {...this.props}/>,
      this.getSections().map((data) => {
        return (
          <ReportSection
            key={data.name}
            title={data.name}
            data={data.data}
            responses={this.props.responses}
          />);
      }),
    ];
  }

  /**
   * Maps report data into data that can be handled by the ReportSection object.
   *
   * Why haven't I been able to get rid of this function?
   * TODO: shape data to not require this (Maybe a nonissue once GraphQL is
   * implemented?)
   */
  private getSections() {
    return [
      {
        name: Sections.CLASS,
        data: this.props.questions.class,
      },
      {
        name: Sections.LEARNABILITY,
        data: this.props.questions.learning,
      },
      {
        name: Sections.INSTRUCTOR,
        data: this.props.questions.instructor,
      },
      {
        name: Sections.EFFECTIVENESS,
        data: this.props.questions.effectiveness,
      },
    ];
  }
}

export default ReportBody;
