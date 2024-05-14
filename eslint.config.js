import { createConfigs } from 'onecfg-lib-eslint';

export default [{ ignores: [`lib/`] }, ...createConfigs({ node: true })];
