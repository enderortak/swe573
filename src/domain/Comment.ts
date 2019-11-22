import { AuditableEntity } from "./base/IAuditableEntity";
import { Association, HasOneGetAssociationMixin } from "sequelize";
import { User } from "./User";
import { BaseEntity } from "./base/BaseEntity";
import { Post } from "./Post";

export class Comment extends BaseEntity implements AuditableEntity {
  
  // AuditableEntity
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;

  // Comment
  public content!: string;
  public postId!: number;  
  public getPost!: HasOneGetAssociationMixin<Post>;
    
}