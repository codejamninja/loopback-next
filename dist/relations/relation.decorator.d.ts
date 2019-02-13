import { Model, RelationDefinitionMap } from '../model';
export declare const RELATIONS_KEY = "loopback:relations";
/**
 * Decorator for relations
 * @param definition
 * @returns {(target:any, key:string)}
 */
export declare function relation(definition?: Object): PropertyDecorator;
/**
 * Get metadata of all relations defined on a given model class.
 *
 * @param modelCtor The model class (the constructor function).
 * @return
 */
export declare function getModelRelations(modelCtor: typeof Model): RelationDefinitionMap;
/**
 * Decorator for embedsOne
 * @param definition
 * @returns {(target:any, key:string)}
 */
export declare function embedsOne(definition?: Object): PropertyDecorator;
/**
 * Decorator for embedsMany
 * @param definition
 * @returns {(target:any, key:string)}
 */
export declare function embedsMany(definition?: Object): PropertyDecorator;
/**
 * Decorator for referencesOne
 * @param definition
 * @returns {(target:any, key:string)}
 */
export declare function referencesOne(definition?: Object): PropertyDecorator;
/**
 * Decorator for referencesMany
 * @param definition
 * @returns {(target:any, key:string)}
 */
export declare function referencesMany(definition?: Object): PropertyDecorator;
