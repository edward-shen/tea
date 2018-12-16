import { match } from 'react-router';

interface BaseParams {
  id: string;
  prof?: string;
}

interface BaseProps {
  match: match<BaseParams>;
}

export default BaseProps;
