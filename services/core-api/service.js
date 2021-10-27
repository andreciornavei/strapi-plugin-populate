'use strict';
module.exports = ({ model, strapi }) => {
  if (model.kind === 'singleType') {
    return createSingleTypeService({ model, strapi });
  }
  return createCollectionTypeService({ model, strapi });
};
const createSingleTypeService = ({ model, strapi }) => {
  const { modelName } = model;
  return {
    find(populate) {
      return strapi.entityService.find({ populate }, { model: modelName });
    },
    async createOrUpdate(data, { files } = {}) {
      const entity = await this.find();
      if (!entity) {
        return strapi.entityService.create({ data, files }, { model: modelName });
      } else {
        return strapi.entityService.update(
          {
            params: {
              id: entity.id,
            },
            data,
            files,
          },
          { model: modelName }
        );
      }
    },
    async delete() {
      const entity = await this.find();
      if (!entity) return;
      return strapi.entityService.delete({ params: { id: entity.id } }, { model: modelName });
    },
  };
};
const createCollectionTypeService = ({ model, strapi }) => {
  const { modelName } = model;
  return {
    find(params, populate) {
      return strapi.entityService.find({ params, populate }, { model: modelName });
    },
    findOne(params, populate) {
      return strapi.entityService.findOne({ params, populate }, { model: modelName });
    },
    count(params) {
      return strapi.entityService.count({ params }, { model: modelName });
    },
    create(data, { files } = {}) {
      return strapi.entityService.create({ data, files }, { model: modelName });
    },
    update(params, data, { files } = {}) {
      return strapi.entityService.update({ params, data, files }, { model: modelName });
    },
    delete(params) {
      return strapi.entityService.delete({ params }, { model: modelName });
    },
    search(params) {
      return strapi.entityService.search({ params }, { model: modelName });
    },
    countSearch(params) {
      return strapi.entityService.countSearch({ params }, { model: modelName });
    },
  };
};