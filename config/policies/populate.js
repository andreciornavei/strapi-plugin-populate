const _ = require('lodash');

module.exports = async (ctx, next) => {
  const route = strapi.plugins.tunning.services.resolve_route(ctx)
  if (route) {
    if (_.get(route, "config.populate") && _.isArray(route.config.populate)) {
      _.set(ctx, "query._populate", route.config.populate.join(","))
    }
  }
  await next()
};
