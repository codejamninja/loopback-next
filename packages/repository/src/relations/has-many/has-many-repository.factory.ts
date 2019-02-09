// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: @loopback/repository
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as debugFactory from 'debug';
import {DataObject} from '../../common-types';
import {EntityNotFoundError, InvalidRelationError} from '../../errors';
import {Entity} from '../../model';
import {EntityCrudRepository} from '../../repositories/repository';
import {constrainFilter} from '../../repositories/constraint-utils';
import {isTypeResolver} from '../../type-resolver';
import {Getter, HasManyDefinition} from '../relation.types';
import {resolveHasManyMetadata} from './has-many.helpers';
import {
  DefaultHasManyRepository,
  HasManyRepository,
} from './has-many.repository';

const debug = debugFactory('loopback:repository:has-many-repository-factory');

export type HasManyRepositoryFactory<Target extends Entity, ForeignKeyType> = (
  fkValue: ForeignKeyType,
) => HasManyRepository<Target>;

export interface IThrough extends Entity {}

/**
 * Enforces a constraint on a repository based on a relationship contract
 * between models. For example, if a Customer model is related to an Order model
 * via a HasMany relation, then, the relational repository returned by the
 * factory function would be constrained by a Customer model instance's id(s).
 *
 * @param relationMetadata - The relation metadata used to describe the
 * relationship and determine how to apply the constraint.
 * @param targetRepositoryGetter - The repository which represents the target model of a
 * relation attached to a datasource.
 * @returns The factory function which accepts a foreign key value to constrain
 * the given target repository
 */
export function createHasManyRepositoryFactory<
  Target extends Entity,
  TargetID,
  ForeignKeyType,
  Through = IThrough,
  ThroughID = string
>(
  relationMetadata: HasManyDefinition,
  targetRepositoryGetter: Getter<EntityCrudRepository<Target, TargetID>>,
  throughRepositoryGetter?: Getter<EntityCrudRepository<IThrough, ThroughID>>,
): HasManyRepositoryFactory<Target, ForeignKeyType> {
  const meta = resolveHasManyMetadata(relationMetadata);
  debug('Resolved HasMany relation metadata: %o', meta);
  return function(fkValue: ForeignKeyType) {
    async function getConstraint(): Promise<DataObject<Target>> {
      // tslint:disable-next-line:no-any
      let constraint: any = {[meta.keyTo]: fkValue};
      if (meta.targetFkName && throughRepositoryGetter) {
        const throughRepo = await throughRepositoryGetter();
        const throughInstances = await throughRepo.find(
          constrainFilter(undefined, constraint),
        );
        if (!throughInstances.length) {
          const id = 'through constraint ' + JSON.stringify(constraint);
          throw new EntityNotFoundError(throughRepo.entityClass, id);
        }
        constraint = {
          or: throughInstances.map((throughInstance: IThrough) => {
            return {id: throughInstance[meta.targetFkName as keyof IThrough]};
          }),
        };
      }
      return constraint as DataObject<Target>;
    }
    return new DefaultHasManyRepository<
      Target,
      TargetID,
      EntityCrudRepository<Target, TargetID>
    >(targetRepositoryGetter, getConstraint);
  };
}

type HasManyResolvedDefinition = HasManyDefinition & {keyTo: string};

/**
 * Resolves given hasMany metadata if target is specified to be a resolver.
 * Mainly used to infer what the `keyTo` property should be from the target's
 * belongsTo metadata
 * @param relationMeta hasMany metadata to resolve
 */
function resolveHasManyMetadata(
  relationMeta: HasManyDefinition,
): HasManyResolvedDefinition {
  if (!isTypeResolver(relationMeta.target)) {
    const reason = 'target must be a type resolver';
    throw new InvalidRelationError(reason, relationMeta);
  }

  if (relationMeta.keyTo) {
    // The explict cast is needed because of a limitation of type inference
    return relationMeta as HasManyResolvedDefinition;
  }

  const sourceModel = relationMeta.source;
  if (!sourceModel || !sourceModel.modelName) {
    const reason = 'source model must be defined';
    throw new InvalidRelationError(reason, relationMeta);
  }

  const targetModel = relationMeta.target();
  debug(
    'Resolved model %s from given metadata: %o',
    targetModel.modelName,
    targetModel,
  );
  let throughModel = null;

  if (relationMeta.through) {
    if (!isTypeResolver(relationMeta.through)) {
      const reason = 'through must be a type resolver';
      throw new InvalidRelationError(reason, relationMeta);
    }
    throughModel = relationMeta.through();
    debug(
      'Resolved model %s from given metadata: %o',
      throughModel.modelName,
      throughModel,
    );
    const targetFkName = camelCase(targetModel.modelName + '_id');
    const hasTargetFkName =
      throughModel.definition &&
      throughModel.definition.properties &&
      throughModel.definition.properties[targetFkName];
    if (!hasTargetFkName) {
      const reason = `target model ${
        throughModel.name
      } is missing definition of target foreign key ${targetFkName}`;
      throw new InvalidRelationError(reason, relationMeta);
    }
    Object.assign(relationMeta, {targetFkName});
  }

  const defaultFkName = camelCase(sourceModel.modelName + '_id');
  const modelWithFkProperty = throughModel || targetModel;
  const hasDefaultFkProperty =
    modelWithFkProperty.definition &&
    modelWithFkProperty.definition.properties &&
    modelWithFkProperty.definition.properties[defaultFkName];

  if (!hasDefaultFkProperty) {
    const reason = ` ${throughModel ? 'through' : 'target'} model ${
      targetModel.name
    } is missing definition of foreign key ${defaultFkName}`;
    throw new InvalidRelationError(reason, relationMeta);
  }

  return Object.assign(relationMeta, {keyTo: defaultFkName});
}
