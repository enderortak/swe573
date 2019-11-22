import { AuditableEntity } from "./base/IAuditableEntity";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Association, HasOneGetAssociationMixin } from "sequelize";
import { FieldValue } from "./FieldValue";
import { BaseEntity } from "./base/BaseEntity";
import { User } from "./User";

export class Post  extends BaseEntity implements AuditableEntity {
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;
  
  public title!: string;
  public communityId!: number;
  public postTypeId!: number;

    // public static associations: {
    //     Comments: Association<Post, Comment>,
    //     Likes: Association<Post, Like>,
    //     FieldValues: Association<Post, FieldValue>
    //   };
}