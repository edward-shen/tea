import * as React from 'react';

import FilteredMetadata from '../../../scraper/cache/FilteredMetadata';
import ReportMetadata from './ReportMetadata';

class ReportBody extends React.Component<FilteredMetadata> {
  public render() {
    return (
      <ReportMetadata {...this.props}/>);
  }
}

export default ReportBody;
