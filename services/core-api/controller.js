'use strict';

const _ = require("lodash")
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = ({ service, model }) => {
  if (model.kind === 'singleType') {
    return createSingleTypeController({ model, service });
  }
  return createCollectionTypeController({ model, service });
};

const createSingleTypeController = ({ model, service }) => {
  return {
    async find() {
      const entity = await service.find();
      return sanitizeEntity(entity, { model });
    },
    async update(ctx) {
      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await service.createOrUpdate(data, { files });
      } else {
        entity = await service.createOrUpdate(ctx.request.body);
      }
      return sanitizeEntity(entity, { model });
    },
    async delete() {
      const entity = await service.delete();
      return sanitizeEntity(entity, { model });
    },
  };
};

const resolvePopulate = (ctx) => {
  const populate = _.get(ctx, "query._populate") ? _.get(ctx, "query._populate").split(",").map(each => each.trim()) : undefined
  _.unset(ctx, "query._populate")
  return populate
}

const createCollectionTypeController = ({ model, service }) => {
  return {

    async find(ctx) {
      let entities;
      if (ctx.query._q) {
        entities = await service.search(ctx.query);
      } else {
        entities = await service.find(ctx.query, resolvePopulate(ctx));
      }
      return entities.map(entity => sanitizeEntity(entity, { model }));
    },

    async findOne(ctx) {
      const entity = await service.findOne({ id: ctx.params.id }, resolvePopulate(ctx));
      return sanitizeEntity(entity, { model });
    },

    count(ctx) {
      if (ctx.query._q) {
        return service.countSearch(ctx.query);
      }
      return service.count(ctx.query);
    },

    async create(ctx) {
      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await service.create(data, { files });
      } else {
        entity = await service.create(ctx.request.body);
      }

      return sanitizeEntity(entity, { model });
    },

    async update(ctx) {
      let entity;
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await service.update({ id: ctx.params.id }, data, { files });
      } else {
        entity = await service.update({ id: ctx.params.id }, ctx.request.body);
      }

      return sanitizeEntity(entity, { model });
    },

    async delete(ctx) {
      const entity = await service.delete({ id: ctx.params.id });
      return sanitizeEntity(entity, { model });
    },

  };
};
