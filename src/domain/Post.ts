import { IAuditableEntity } from "./base/IAuditableEntity";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { HasOneGetAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { FieldValue } from "./FieldValue";
import { BaseEntity } from "./base/BaseEntity";
import { User } from "./User";
import { Community } from "./Community";
import { PostType } from "./PostType";

export class Post extends BaseEntity implements IAuditableEntity {

  // IAuditableEntity
  public createdAt: Date;
  public updatedAt: Date;
  public createdById: number;
  public updatedById: number;
  public getOwner: HasOneGetAssociationMixin<User>;
  public getLastUpdater: HasOneGetAssociationMixin<User>;

  // Post
  public title!: string;
  public communityId!: number;
  public getCommunity!: HasOneGetAssociationMixin<Community>;
  public postTypeId!: number;
  public getPostType!: HasOneGetAssociationMixin<PostType>;
  public getFieldValues!: HasManyGetAssociationsMixin<FieldValue>;
  public getComments!: HasManyGetAssociationsMixin<Comment>;
  public getLikes!: HasManyGetAssociationsMixin<Like>;

}