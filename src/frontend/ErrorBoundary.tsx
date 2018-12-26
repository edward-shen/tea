import * as React from 'react';

class ErrorBoundary extends React.Component<{}, { hasError: boolean}> {
  public constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  public componentDidCatch(error, info) {
    console.log(error, info);
  }

  public render() {
    if (this.state.hasError) {
      return <p>Looks like the teapot broke. Go home?</p>;
    }

    return this.props.children;
  }

}

export default ErrorBoundary;
