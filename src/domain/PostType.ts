import { BaseEntity } from "./base/BaseEntity";
import { Field } from "./Field";
import { Association, HasOneGetAssociationMixin } from "sequelize";
import { AuditableEntity } from "./base/IAuditableEntity";
import { User } from "./User";

export class PostType  extends BaseEntity implements AuditableEntity {
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;
    
    public name!: string;
    public communityId!: number;
    
    // public static associations: {
    //     Fields: Association<PostType, Field>
    //   };
}