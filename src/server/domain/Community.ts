import { IAuditableEntity } from "./base/IAuditableEntity";
import { Post } from "./Post";
import { User } from "./User";
import { PostType } from "./PostType";
import { HasManyGetAssociationsMixin, HasOneGetAssociationMixin, HasManyAddAssociationMixin, BelongsToManyAddAssociationMixin } from "sequelize";
import { BaseEntity } from "./base/BaseEntity";

export class Community extends BaseEntity implements IAuditableEntity {

    // IAuditableEntity
    public createdAt: Date;
    public updatedAt: Date;
    public createdById: number;
    public updatedById: number;
    public getOwner: HasOneGetAssociationMixin<User>;
    public getLastUpdater: HasOneGetAssociationMixin<User>;
    
    //Community
    public name!: string;
    public description!: string;
    public tags?: string | null;
    public image?: Blob | null;
    public getPostTypes!: HasManyGetAssociationsMixin<PostType>;
    public getPosts!: HasManyGetAssociationsMixin<Post>;
    public getMembers!: HasManyGetAssociationsMixin<User>;
    // public addMember!: BelongsToManyAddAssociationMixin<User,User["id"]>;
    
}