import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const root = process.cwd();
const YAML_CONFIG_PROD = 'prod.yaml';
const YAML_CONFIG_DEV = 'dev.yaml';

export const serverConfig = (): Record<string, any> => {
  const env = process.env.NODE_ENV === undefined ? 'dev' : process.env.NODE_ENV;

  let configs: string[] = [];
  if (env === 'dev') {
    configs = [`${root}/config/${YAML_CONFIG_DEV}`];
  } else if (env === 'prod') {
    configs = [`${root}/config/${YAML_CONFIG_PROD}`];
  } else {
    throw new Error('env error');
  }

  const mergedConfig = configs.reduce((acc, currPath) => {
    try {
      const fileContent = fs.readFileSync(currPath, 'utf8');
      const yamlContent = yaml.load(fileContent) as Record<string, any>;
      return { ...acc, ...yamlContent };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, {});

  return mergedConfig as Record<string, any>;
};
