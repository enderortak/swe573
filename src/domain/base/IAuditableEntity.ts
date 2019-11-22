import { User } from "../User";
import { HasOneGetAssociationMixin } from "sequelize";



export interface AuditableEntity {

    createdAt: Date;
    updatedAt: Date;
    createdById: number;
    updatedById: number;
    getOwner: HasOneGetAssociationMixin<User>;
    getLastUpdater: HasOneGetAssociationMixin<User>;
}