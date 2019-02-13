"use strict";
// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("@loopback/context");
const assert = require("assert");
const legacy = require("loopback-datasource-juggler");
const errors_1 = require("../errors");
const relations_1 = require("../relations");
const type_resolver_1 = require("../type-resolver");
var juggler;
(function (juggler) {
    juggler.DataSource = legacy.DataSource;
    juggler.ModelBase = legacy.ModelBase;
    juggler.PersistedModel = legacy.PersistedModel;
    juggler.KeyValueModel = legacy.KeyValueModel;
})(juggler = exports.juggler || (exports.juggler = {}));
/**
 * This is a bridge to the legacy DAO class. The function mixes DAO methods
 * into a model class and attach it to a given data source
 * @param modelClass {} Model class
 * @param ds {DataSource} Data source
 * @returns {} The new model class with DAO (CRUD) operations
 */
function bindModel(modelClass, ds) {
    const boundModelClass = class extends modelClass {
    };
    boundModelClass.attachTo(ds);
    return boundModelClass;
}
exports.bindModel = bindModel;
/**
 * Ensure the value is a promise
 * @param p Promise or void
 */
/* tslint:disable-next-line:no-any */
function ensurePromise(p) {
    if (p && context_1.isPromiseLike(p)) {
        // Juggler uses promise-like Bluebird instead of native Promise
        // implementation. We need to convert the promise returned by juggler
        // methods to proper native Promise instance.
        return Promise.resolve(p);
    }
    else {
        return Promise.reject(new Error('The value should be a Promise: ' + p));
    }
}
exports.ensurePromise = ensurePromise;
/**
 * Default implementation of CRUD repository using legacy juggler model
 * and data source
 */
class DefaultCrudRepository {
    /**
     * Constructor of DefaultCrudRepository
     * @param entityClass Legacy entity class
     * @param dataSource Legacy data source
     */
    constructor(
    // entityClass should have type "typeof T", but that's not supported by TSC
    entityClass, dataSource) {
        this.entityClass = entityClass;
        this.dataSource = dataSource;
        const definition = entityClass.definition;
        assert(!!definition, `Entity ${entityClass.name} must have valid model definition.`);
        assert(definition.idProperties().length > 0, `Entity ${entityClass.name} must have at least one id/pk property.`);
        this.setupPersistedModel(definition);
    }
    // Create an internal legacy Model attached to the datasource
    setupPersistedModel(definition) {
        const dataSource = this.dataSource;
        const model = dataSource.getModel(definition.name);
        if (model) {
            // The backing persisted model has been already defined.
            this.modelClass = model;
            return;
        }
        // We need to convert property definitions from PropertyDefinition
        // to plain data object because of a juggler limitation
        const properties = {};
        // We need to convert PropertyDefinition into the definition that
        // the juggler understands
        Object.entries(definition.properties).forEach(([key, value]) => {
            if (value.type === 'array' || value.type === Array) {
                value = Object.assign({}, value, { type: [type_resolver_1.resolveType(value.itemType)] });
                delete value.itemType;
            }
            value.type = type_resolver_1.resolveType(value.type);
            properties[key] = Object.assign({}, value);
        });
        this.modelClass = dataSource.createModel(definition.name, properties, Object.assign(
        // settings that users can override
        { strict: true }, 
        // user-defined settings
        definition.settings, 
        // settings enforced by the framework
        { strictDelete: false }));
        this.modelClass.attachTo(dataSource);
    }
    /**
     * @deprecated
     * Function to create a constrained relation repository factory
     *
     * Use `this.createHasManyRepositoryFactoryFor()` instaed
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    _createHasManyRepositoryFactoryFor(relationName, targetRepoGetter) {
        return this.createHasManyRepositoryFactoryFor(relationName, targetRepoGetter);
    }
    /**
     * Function to create a constrained relation repository factory
     *
     * ```ts
     * class CustomerRepository extends DefaultCrudRepository<
     *   Customer,
     *   typeof Customer.prototype.id
     * > {
     *   public readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
     *
     *   constructor(
     *     protected db: juggler.DataSource,
     *     orderRepository: EntityCrudRepository<Order, typeof Order.prototype.id>,
     *   ) {
     *     super(Customer, db);
     *     this.orders = this._createHasManyRepositoryFactoryFor(
     *       'orders',
     *       orderRepository,
     *     );
     *   }
     * }
     * ```
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    createHasManyRepositoryFactoryFor(relationName, targetRepoGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return relations_1.createHasManyRepositoryFactory(meta, targetRepoGetter);
    }
    /**
     * @deprecated
     * Function to create a constrained relation repository factory
     *
     * Use `this.createHasManyThroughRepositoryFactoryFor()` instaed
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     * @param throughRepo Through repository instance
     */
    _createHasManyThroughRepositoryFactoryFor(relationName, targetRepoGetter, throughRepositoryGetter) {
        return this.createHasManyThroughRepositoryFactoryFor(relationName, targetRepoGetter, throughRepositoryGetter);
    }
    /**
     * Function to create a constrained relation repository factory
     *
     * ```ts
     * class CustomerRepository extends DefaultCrudRepository<
     *   Customer,
     *   typeof Customer.prototype.id
     * > {
     *   public readonly orders: HasManyRepositoryFactory<Order, typeof Customer.prototype.id>;
     *
     *   constructor(
     *     protected db: juggler.DataSource,
     *     orderRepository: EntityCrudRepository<Order, typeof Order.prototype.id>,
     *   ) {
     *     super(Customer, db);
     *     this.orders = this._createHasManyRepositoryFactoryFor(
     *       'orders',
     *       orderRepository,
     *     );
     *   }
     * }
     * ```
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     * @param throughRepo Through repository instance
     */
    createHasManyThroughRepositoryFactoryFor(relationName, targetRepoGetter, throughRepositoryGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return relations_1.createHasManyThroughRepositoryFactory(meta, targetRepoGetter, throughRepositoryGetter);
    }
    /**
     * @deprecated
     * Function to create a belongs to accessor
     *
     * Use `this.createBelongsToAccessorFor()` instaed
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    _createBelongsToAccessorFor(relationName, targetRepoGetter) {
        return this.createBelongsToAccessorFor(relationName, targetRepoGetter);
    }
    /**
     * Function to create a belongs to accessor
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    createBelongsToAccessorFor(relationName, targetRepoGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return relations_1.createBelongsToAccessor(meta, targetRepoGetter, this);
    }
    _createHasOneRepositoryFactoryFor(relationName, targetRepoGetter) {
        const meta = this.entityClass.definition.relations[relationName];
        return relations_1.createHasOneRepositoryFactory(meta, targetRepoGetter);
    }
    async create(entity, options) {
        const model = await ensurePromise(this.modelClass.create(entity, options));
        return this.toEntity(model);
    }
    async createAll(entities, options) {
        const models = await ensurePromise(this.modelClass.create(entities, options));
        return this.toEntities(models);
    }
    async save(entity, options) {
        const id = this.entityClass.getIdOf(entity);
        if (id == null) {
            return this.create(entity, options);
        }
        else {
            await this.replaceById(id, entity, options);
            return new this.entityClass(entity.toObject());
        }
    }
    async find(filter, options) {
        const models = await ensurePromise(this.modelClass.find(filter, options));
        return this.toEntities(models);
    }
    async findOne(filter, options) {
        const model = await ensurePromise(this.modelClass.findOne(filter, options));
        if (!model)
            return null;
        return this.toEntity(model);
    }
    async findById(id, filter, options) {
        const model = await ensurePromise(this.modelClass.findById(id, filter, options));
        if (!model) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
        return this.toEntity(model);
    }
    update(entity, options) {
        return this.updateById(entity.getId(), entity, options);
    }
    delete(entity, options) {
        return this.deleteById(entity.getId(), options);
    }
    async updateAll(data, where, options) {
        where = where || {};
        const result = await ensurePromise(this.modelClass.updateAll(where, data, options));
        return { count: result.count };
    }
    async updateById(id, data, options) {
        const idProp = this.modelClass.definition.idName();
        const where = {};
        where[idProp] = id;
        const result = await this.updateAll(data, where, options);
        if (result.count === 0) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
    }
    async replaceById(id, data, options) {
        try {
            await ensurePromise(this.modelClass.replaceById(id, data, options));
        }
        catch (err) {
            if (err.statusCode === 404) {
                throw new errors_1.EntityNotFoundError(this.entityClass, id);
            }
            throw err;
        }
    }
    async deleteAll(where, options) {
        const result = await ensurePromise(this.modelClass.deleteAll(where, options));
        return { count: result.count };
    }
    async deleteById(id, options) {
        const result = await ensurePromise(this.modelClass.deleteById(id, options));
        if (result.count === 0) {
            throw new errors_1.EntityNotFoundError(this.entityClass, id);
        }
    }
    async count(where, options) {
        const result = await ensurePromise(this.modelClass.count(where, options));
        return { count: result };
    }
    exists(id, options) {
        return ensurePromise(this.modelClass.exists(id, options));
    }
    async execute(command, 
    // tslint:disable:no-any
    parameters, options) {
        /* istanbul ignore next */
        throw new Error('Not implemented');
    }
    toEntity(model) {
        return new this.entityClass(model.toObject());
    }
    toEntities(models) {
        return models.map(m => this.toEntity(m));
    }
}
exports.DefaultCrudRepository = DefaultCrudRepository;
//# sourceMappingURL=legacy-juggler-bridge.js.map