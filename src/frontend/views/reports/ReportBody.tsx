import * as React from 'react';

import FilteredMetadata from '../../../scraper/cache/FilteredMetadata';
import ReportMetadata from './ReportMetadata';
import ReportSection from './ReportSection';

class ReportBody extends React.Component<FilteredMetadata> {
  public render() {
    return [
      <ReportMetadata key={'metadata'} {...this.props}/>,
    ];
  }
}

export default ReportBody;
