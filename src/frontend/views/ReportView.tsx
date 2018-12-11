import * as React from 'react';
import BaseProps from './BaseProps';

class ReportView extends React.Component<BaseProps, {}> {
  public render() {
    return <h1>{this.props.match.params.id}</h1>;
  }
}

export default ReportView;
