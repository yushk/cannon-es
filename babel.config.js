// Only used by Jest at the moment.
// Mostly the same as the build config in ./rollup.config
module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
}
