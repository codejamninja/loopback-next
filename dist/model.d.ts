import { AnyObject, DataObject, Options } from './common-types';
import { RelationMetadata } from './relations';
import { TypeResolver } from './type-resolver';
import { Type } from './types';
/**
 * This module defines the key classes representing building blocks for Domain
 * Driven Design.
 * See https://en.wikipedia.org/wiki/Domain-driven_design#Building_blocks
 */
export declare type PropertyType = string | Function | Object | Type<any> | TypeResolver<Model>;
/**
 * Property definition for a model
 */
export interface PropertyDefinition {
    type: PropertyType;
    id?: boolean;
    json?: PropertyForm;
    store?: PropertyForm;
    itemType?: PropertyType;
    [attribute: string]: any;
}
/**
 * See https://github.com/strongloop/loopback-datasource-juggler/issues/432
 */
export interface PropertyForm {
    in?: boolean;
    out?: boolean;
    name?: string;
}
/**
 * A key-value map describing model relations.
 * A relation name is used as the key, a relation definition is the value.
 */
export declare type RelationDefinitionMap = {
    [relationName: string]: RelationMetadata;
};
/**
 * DSL for building a model definition.
 */
export interface ModelDefinitionSyntax {
    name: string;
    properties?: {
        [name: string]: PropertyDefinition | PropertyType;
    };
    settings?: {
        [name: string]: any;
    };
    relations?: RelationDefinitionMap;
    [attribute: string]: any;
}
/**
 * Definition for a model
 */
export declare class ModelDefinition {
    readonly name: string;
    properties: {
        [name: string]: PropertyDefinition;
    };
    settings: {
        [name: string]: any;
    };
    relations: RelationDefinitionMap;
    [attribute: string]: any;
    constructor(nameOrDef: string | ModelDefinitionSyntax);
    /**
     * Add a property
     * @param name Property definition or name (string)
     * @param definitionOrType Definition or property type
     */
    addProperty(name: string, definitionOrType: PropertyDefinition | PropertyType): this;
    /**
     * Add a setting
     * @param name Setting name
     * @param value Setting value
     */
    addSetting(name: string, value: any): this;
    /**
     * Define a new relation.
     * @param definition The definition of the new relation.
     */
    addRelation(definition: RelationMetadata): this;
    /**
     * Get an array of names of ID properties, which are specified in
     * the model settings or properties with `id` attribute. For example,
     * ```
     * {
     *   settings: {
     *     id: ['id']
     *   }
     *   properties: {
     *     id: {
     *       type: 'string',
     *       id: true
     *     }
     *   }
     * }
     * ```
     */
    idProperties(): string[];
}
/**
 * Base class for models
 */
export declare abstract class Model {
    static readonly modelName: string;
    static definition: ModelDefinition;
    /**
     * Serialize into a plain JSON object
     */
    toJSON(): Object;
    /**
     * Convert to a plain object as DTO
     */
    toObject(options?: Options): Object;
    constructor(data?: DataObject<Model>);
}
export interface Persistable {
}
/**
 * Base class for value objects - An object that contains attributes but has no
 * conceptual identity. They should be treated as immutable.
 */
export declare abstract class ValueObject extends Model implements Persistable {
}
/**
 * Base class for entities which have unique ids
 */
export declare abstract class Entity extends Model implements Persistable {
    /**
     * Get the identity value for a given entity instance or entity data object.
     *
     * @param entityOrData The data object for which to determine the identity
     * value.
     */
    static getIdOf(entityOrData: AnyObject): any;
    /**
     * Get the identity value. If the identity is a composite key, returns
     * an object.
     */
    getId(): any;
    /**
     * Get the identity as an object, such as `{id: 1}` or
     * `{schoolId: 1, studentId: 2}`
     */
    getIdObject(): Object;
    /**
     * Build the where object for the given id
     * @param id The id value
     */
    static buildWhereForId(id: any): any;
}
/**
 * Domain events
 */
export declare class Event {
    source: any;
    type: string;
}
export declare type EntityData = DataObject<Entity>;
export declare type EntityResolver<T extends Entity> = TypeResolver<T, typeof Entity>;
