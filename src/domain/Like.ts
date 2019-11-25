import { IAuditableEntity } from "./base/IAuditableEntity";
import { BaseEntity } from "./base/BaseEntity";
import { HasOneGetAssociationMixin } from "sequelize/types";
import { User } from "./User";
import { Post } from "./Post";

export class Like extends BaseEntity implements IAuditableEntity {
    
    // IAuditableEntity
    public createdAt: Date;
    public updatedAt: Date;
    public createdById: number;
    public updatedById: number;
    public getOwner: HasOneGetAssociationMixin<User>;
    public getLastUpdater: HasOneGetAssociationMixin<User>;

    // Like
    public postId!: number;
    public getPost!: HasOneGetAssociationMixin<Post>;
}