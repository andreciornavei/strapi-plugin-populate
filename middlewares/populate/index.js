const _ = require('lodash');
const { createCoreApi } = require("../../services/core-api");

module.exports = strapi => {
  return {
    initialize() {

      // ************************************************* //
      // Register policy include/exclude to each GET route  //
      // ************************************************* //

      const POLICY_POPULATE_PARAMS = 'plugins::populate.populate'
      _.forEach(strapi.admin.config.routes, value => {
        if(_.get(value, "config.populate")) value.config.policies.push(POLICY_POPULATE_PARAMS);
      });

      _.forEach(strapi.config.routes, value => {
        if(_.get(value, "config.populate")) value.config.policies.push(POLICY_POPULATE_PARAMS);
      });

      if (strapi.plugins) {
        _.forEach(strapi.plugins, plugin => {
          _.forEach(plugin.config.routes, value => {
            if(_.get(value, "config.populate")) value.config.policies.push(POLICY_POPULATE_PARAMS);
          });
        });
      }

      // *********************************************************************************** //
      // recreate core controllers to enable populate                                        //
      // *********************************************************************************** //
      // *********************************************************************************** //
      // the code below was copied from  strapi lib core on v3.1.3 at                        //
      // https://github.com/strapi/strapi/blob/v3.1.3/packages/strapi/lib/core/bootstrap.js  //
      // *********************************************************************************** //
      Object.keys(strapi.api || []).map((apiName) => {
        const api = strapi.api[apiName];
        for (let modelName in api.models) {
          let model = strapi.api[apiName].models[modelName];
          const { controller } = createCoreApi({ model, api, strapi });
          _.set(strapi.api[apiName], ['controllers', modelName], controller);
          _.set(strapi.controllers, [modelName], controller);
        }
      });
    },
  };
};
