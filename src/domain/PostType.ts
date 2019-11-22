import { BaseEntity } from "./base/BaseEntity";
import { Field } from "./Field";
import { Association, HasOneGetAssociationMixin, HasMany, HasManyGetAssociationsMixin } from "sequelize";
import { AuditableEntity } from "./base/IAuditableEntity";
import { User } from "./User";
import { Community } from "./Community";

export class PostType  extends BaseEntity implements AuditableEntity {
  
  // AuditableEntity
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;

  // PostType
  public name!: string;
  public communityId!: number;
  public getCommunity!: HasOneGetAssociationMixin<Community>;
  public getFields?: HasManyGetAssociationsMixin<Field>;

}