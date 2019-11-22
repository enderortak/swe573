import { AuditableEntity } from "./base/IAuditableEntity";
import { Post } from "./Post";
import { User } from "./User";
import { PostType } from "./PostType";
import { Association, HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from "sequelize";
import { BaseEntity } from "./base/BaseEntity";

export class Community extends BaseEntity implements AuditableEntity {
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;
  
    public name!: string;
    public description!: string;
    public tags?: string | null;
    public readonly members?: User[];
    public readonly postTypes?: PostType[];
    public readonly posts?: Post[];
    public readonly owner!: User;
    // public static associations: {
    //     Members: Association<Community, User>,
    //     PostTypes: Association<Community, PostType>,
    //     Posts: Association<Community, Post>,
    //     Owner: Association<Community, User>
    //   };
    public getPostTypes!: HasManyGetAssociationsMixin<PostType>
}