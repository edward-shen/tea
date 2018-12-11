import * as React from 'react';
import BaseProps from './BaseProps';

interface ReportViewProps extends BaseProps {
}

class ReportView extends React.Component<ReportViewProps, {}> {
  public render() {
    return <h1>{this.props.match.params.id}</h1>;
  }
}

export default ReportView;
