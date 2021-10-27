'use strict';

module.exports = async () => {
  strapi.config.middleware.load.after.push('populate')
};
