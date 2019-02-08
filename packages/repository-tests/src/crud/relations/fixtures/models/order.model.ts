// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/repository-tests
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  belongsTo,
  BelongsToAccessor,
  Entity,
  EntityCrudRepository,
  model,
  property,
} from '@loopback/repository';
import {MixedIdType} from '../../../../helpers.repository-tests';
import {Customer, CustomerWithRelations} from './customer.model';
import {Shipment, ShipmentWithRelations} from './shipment.model';
import {Seller} from './seller.model';

@model()
export class Order extends Entity {
  @property({
    id: true,
    generated: true,
  })
  id: MixedIdType;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'boolean',
    required: false,
  })
  isShipped: boolean;

  @belongsTo(() => Customer)
  customerId: MixedIdType;

  @belongsTo(() => Shipment, {name: 'shipment'})
  shipment_id: MixedIdType;

  @belongsTo(() => Seller)
  sellerId: number;
}

export interface OrderRelations {
  customer?: CustomerWithRelations;
  shipment?: ShipmentWithRelations;
}

export type OrderWithRelations = Order & OrderRelations;

export interface OrderRepository
  extends EntityCrudRepository<Order, typeof Order.prototype.id> {
  // define additional members like relation methods here
  customer: BelongsToAccessor<Customer, MixedIdType>;
  shipment: BelongsToAccessor<Shipment, MixedIdType>;
}
