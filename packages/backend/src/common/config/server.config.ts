import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const root = process.cwd();

const YAML_CONFIG_COMMON = 'common.yaml';
const YAML_CONFIG_DEV = 'dev.yaml';
const YAML_CONFIG_PROD = 'prod.yaml';

export const serverConfig = (): Record<string, any> => {
  const env =
    process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;

  let configs: string[] = [];
  if (env === 'development') {
    configs = [
      `${root}/config/${YAML_CONFIG_COMMON}`,
      `${root}/config/${YAML_CONFIG_DEV}`,
      `${root}/config-prod/${YAML_CONFIG_PROD}`,
    ];
  } else if (env === 'production') {
    configs = [
      `${root}/config/${YAML_CONFIG_COMMON}`,
      `${root}/config/${YAML_CONFIG_PROD}`,
      `${root}/config-prod/${YAML_CONFIG_PROD}`,
    ];
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
