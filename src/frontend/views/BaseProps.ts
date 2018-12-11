import { match } from "react-router";

interface BaseParams {
  id: string;
}

interface BaseProps {
  match: match<BaseParams>;
}

export default BaseProps;
