import { AuditableEntity } from "./base/IAuditableEntity";
import { BaseEntity } from "./base/BaseEntity";
import { HasOneGetAssociationMixin } from "sequelize/types";
import { User } from "./User";

export class Like  extends BaseEntity implements AuditableEntity {
    public createdAt!: Date;
    public updatedAt!: Date;
    public createdById!: number;
    public updatedById!: number;
    public getOwner!: HasOneGetAssociationMixin<User>;
    public getLastUpdater!: HasOneGetAssociationMixin<User>;
    
    public postId!: number;
    
}