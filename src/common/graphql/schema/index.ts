import { buildSchema } from 'graphql';

import Class from './Class';
import Professor from './Professor';
import Report from './Report';
import Query from './Query';

const schemaString = Class + Professor + Report + Query;

export default buildSchema(schemaString);
