/**
 * This transformer is need for ts-jest to replace unsupported import.meta.env which is supported by vite
 */

const tsJest = require('ts-jest');

const baseTransformer = tsJest.default.createTransformer();

module.exports = {
  ...baseTransformer,
  process(src, filename, config, options) {
    const transformedSrc = 'const meta: any = {};\n' + src.replace(/import.meta.env/g, 'meta');
    return baseTransformer.process(transformedSrc, filename, config, options);
  },
};
