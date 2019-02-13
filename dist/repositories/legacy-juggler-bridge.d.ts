import { Getter } from '@loopback/context';
import * as legacy from 'loopback-datasource-juggler';
import { AnyObject, Command, Count, DataObject, NamedParameters, Options, PositionalParameters } from '../common-types';
import { Entity } from '../model';
import { Filter, Where } from '../query';
import { BelongsToAccessor, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, HasOneRepositoryFactory } from '../relations';
import { EntityCrudRepository } from './repository';
export declare namespace juggler {
    export import DataSource = legacy.DataSource;
    export import ModelBase = legacy.ModelBase;
    export import ModelBaseClass = legacy.ModelBaseClass;
    export import PersistedModel = legacy.PersistedModel;
    export import KeyValueModel = legacy.KeyValueModel;
    export import PersistedModelClass = legacy.PersistedModelClass;
}
/**
 * This is a bridge to the legacy DAO class. The function mixes DAO methods
 * into a model class and attach it to a given data source
 * @param modelClass {} Model class
 * @param ds {DataSource} Data source
 * @returns {} The new model class with DAO (CRUD) operations
 */
export declare function bindModel<T extends juggler.ModelBaseClass>(modelClass: T, ds: juggler.DataSource): T;
/**
 * Ensure the value is a promise
 * @param p Promise or void
 */
export declare function ensurePromise<T>(p: legacy.PromiseOrVoid<T>): Promise<T>;
/**
 * Default implementation of CRUD repository using legacy juggler model
 * and data source
 */
export declare class DefaultCrudRepository<T extends Entity, ID> implements EntityCrudRepository<T, ID> {
    entityClass: typeof Entity & {
        prototype: T;
    };
    dataSource: juggler.DataSource;
    modelClass: juggler.PersistedModelClass;
    /**
     * Constructor of DefaultCrudRepository
     * @param entityClass Legacy entity class
     * @param dataSource Legacy data source
     */
    constructor(entityClass: typeof Entity & {
        prototype: T;
    }, dataSource: juggler.DataSource);
    private setupPersistedModel;
    /**
     * @deprecated
     * Function to create a constrained relation repository factory
     *
     * Use `this.createHasManyRepositoryFactoryFor()` instaed
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    protected _createHasManyRepositoryFactoryFor<Target extends Entity, TargetID, ForeignKeyType>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetID>>): HasManyRepositoryFactory<Target, ForeignKeyType>;
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
    protected createHasManyRepositoryFactoryFor<Target extends Entity, TargetID, ForeignKeyType>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetID>>): HasManyRepositoryFactory<Target, ForeignKeyType>;
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
    protected _createHasManyThroughRepositoryFactoryFor<Target extends Entity, TargetID, Through extends Entity, ThroughID, ForeignKeyType>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetID>>, throughRepositoryGetter: Getter<EntityCrudRepository<Through, ThroughID>>): HasManyThroughRepositoryFactory<Target, Through, ForeignKeyType>;
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
    protected createHasManyThroughRepositoryFactoryFor<Target extends Entity, TargetID, Through extends Entity, ThroughID, ForeignKeyType>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetID>>, throughRepositoryGetter: Getter<EntityCrudRepository<Through, ThroughID>>): HasManyThroughRepositoryFactory<Target, Through, ForeignKeyType>;
    /**
     * @deprecated
     * Function to create a belongs to accessor
     *
     * Use `this.createBelongsToAccessorFor()` instaed
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    protected _createBelongsToAccessorFor<Target extends Entity, TargetId>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetId>>): BelongsToAccessor<Target, ID>;
    /**
     * Function to create a belongs to accessor
     *
     * @param relationName Name of the relation defined on the source model
     * @param targetRepo Target repository instance
     */
    protected createBelongsToAccessorFor<Target extends Entity, TargetId>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetId>>): BelongsToAccessor<Target, ID>;
    protected _createHasOneRepositoryFactoryFor<Target extends Entity, TargetID, ForeignKeyType>(relationName: string, targetRepoGetter: Getter<EntityCrudRepository<Target, TargetID>>): HasOneRepositoryFactory<Target, ForeignKeyType>;
    create(entity: DataObject<T>, options?: Options): Promise<T>;
    createAll(entities: DataObject<T>[], options?: Options): Promise<T[]>;
    save(entity: T, options?: Options): Promise<T>;
    find(filter?: Filter<T>, options?: Options): Promise<T[]>;
    findOne(filter?: Filter<T>, options?: Options): Promise<T | null>;
    findById(id: ID, filter?: Filter<T>, options?: Options): Promise<T>;
    update(entity: T, options?: Options): Promise<void>;
    delete(entity: T, options?: Options): Promise<void>;
    updateAll(data: DataObject<T>, where?: Where<T>, options?: Options): Promise<Count>;
    updateById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
    replaceById(id: ID, data: DataObject<T>, options?: Options): Promise<void>;
    deleteAll(where?: Where<T>, options?: Options): Promise<Count>;
    deleteById(id: ID, options?: Options): Promise<void>;
    count(where?: Where<T>, options?: Options): Promise<Count>;
    exists(id: ID, options?: Options): Promise<boolean>;
    execute(command: Command, parameters: NamedParameters | PositionalParameters, options?: Options): Promise<AnyObject>;
    protected toEntity(model: juggler.PersistedModel): T;
    protected toEntities(models: juggler.PersistedModel[]): T[];
}
