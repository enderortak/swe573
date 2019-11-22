import { AuditableEntity } from "./base/IAuditableEntity";
import { Association, HasOneGetAssociationMixin } from "sequelize";
import { User } from "./User";
import { BaseEntity } from "./base/BaseEntity";

export class Comment extends BaseEntity implements AuditableEntity {
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;

  public content!: string;
  public postId!: number;

    // public static associations: {
    //     CreatedBy: Association<Comment, User>,
    //     UpdatedBy: Association<Comment, User>
    //   };
    
}