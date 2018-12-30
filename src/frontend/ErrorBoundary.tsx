import * as React from 'react';
import { Link } from 'react-router-dom';

const goHomeMsg = <>Go <Link to='/'>Home</Link>?</>;
const errorMessages = [
  <p>Looks like the teapot cracked. {goHomeMsg}</p>,
  <p>Oh the humani-tea! {goHomeMsg}</p>,
  <p>Looks like someone spilled the tea... {goHomeMsg}</p>,
  <p>Looks like the tea party is over. {goHomeMsg}</p>,
  <p>Looks like some bugs got into our teabags... {goHomeMsg}</p>,
  <p>The tea for you was thrown into the Boston Harbor! {goHomeMsg}</p>,
];

class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
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
      return <main>
          <h1>Something went wrong.</h1>
          {this.generateRandomMessage()}
        </main>;
    }

    return this.props.children;
  }

  private generateRandomMessage() {
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
  }
}

export default ErrorBoundary;
