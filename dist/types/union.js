"use strict";
// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
// tslint:disable:no-any
/**
 * Union type, such as string | number
 */
class UnionType {
    constructor(itemTypes) {
        this.itemTypes = itemTypes;
        this.name = 'union';
    }
    isInstance(value) {
        return this.itemTypes.some(t => t.isInstance(value));
    }
    isCoercible(value) {
        return this.itemTypes.some(t => t.isCoercible(value));
    }
    defaultValue() {
        return this.itemTypes[0].defaultValue();
    }
    coerce(value) {
        // First find instances
        for (const type of this.itemTypes) {
            if (type.isInstance(value)) {
                return type.coerce(value);
            }
        }
        // Try coercible
        for (const type of this.itemTypes) {
            if (type.isCoercible(value)) {
                return type.coerce(value);
            }
        }
        const msg = util.format('Invalid %s: %j', this.name, value);
        throw new TypeError(msg);
    }
    serialize(value) {
        for (const type of this.itemTypes) {
            if (type.isInstance(value)) {
                return type.serialize(value);
            }
        }
    }
}
exports.UnionType = UnionType;
//# sourceMappingURL=union.js.map