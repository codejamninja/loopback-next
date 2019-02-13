/**
 * Common types/interfaces such as Class/Constructor/Options/Callback
 */
/**
 * Interface for classes with `new` operator and static properties/methods
 */
export interface Class<T> {
    new (...args: any[]): T;
    [property: string]: any;
}
/**
 * Interface for constructor functions without `new` operator, for example,
 * ```
 * function Foo(x) {
 *   if (!(this instanceof Foo)) { return new Foo(x); }
 *   this.x = x;
 * }
 * ```
 */
export interface ConstructorFunction<T> {
    (...args: any[]): T;
}
/**
 * Constructor type - class or function
 */
export declare type Constructor<T> = Class<T> | ConstructorFunction<T>;
/**
 * Objects with open properties
 */
export interface AnyObject {
    [property: string]: any;
}
/**
 * An extension of the built-in Partial<T> type which allows partial values
 * in deeply nested properties too.
 */
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
/**
 * Type alias for strongly or weakly typed objects of T
 */
export declare type DataObject<T extends object> = T | DeepPartial<T>;
/**
 * Type alias for Node.js options object
 */
export declare type Options = AnyObject;
/**
 * Type alias for Node.js callback functions
 */
export declare type Callback<T> = (err: Error | string | null | undefined, result?: T) => void;
/**
 * Type for a command
 */
export declare type Command = string | AnyObject;
/**
 * Named parameters, such as `{x: 1, y: 'a'}`
 */
export declare type NamedParameters = AnyObject;
/**
 * Positional parameters, such as [1, 'a']
 */
export declare type PositionalParameters = any[];
/**
 * Count of Model instances that were successful for methods like `updateAll`,
 * `deleteAll`, etc.
 */
export interface Count {
    count: number;
}
/**
 * JSON Schema describing the Count interface. It's the response type for
 * REST calls to APIs which return Count
 */
export declare const CountSchema: {
    type: string;
    properties: {
        count: {
            type: string;
        };
    };
};
