'use strict';
const _ = require('lodash');
const createController = require('./controller');
const createService = require('./service');
function createCoreApi({ api, model, strapi }) {
  const { modelName } = model;
  const userService = _.get(api, ['services', modelName], {});
  const userController = _.get(api, ['controllers', modelName], {});
  const service = Object.assign(createService({ model, strapi }), userService);

  if (userController.find) delete userController.find
  if (userController.findOne) delete userController.findOne
  const controller = Object.assign(createController({ service, model }), userController);

  return {
    service,
    controller,
  };
}
module.exports = {
  createCoreApi,
};
