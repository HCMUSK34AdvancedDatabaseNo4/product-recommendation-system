import yaml from 'js-yaml';
import fs from 'fs';

const swaggerDocs = yaml.load(fs.readFileSync("src/swagger-definition.yaml", "utf8"));

export default swaggerDocs;