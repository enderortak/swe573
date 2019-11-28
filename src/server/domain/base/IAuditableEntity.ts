import { HasOneGetAssociationMixin } from "sequelize/types";
import { User } from "../User";


export interface IAuditableEntity {
    
    createdAt: Date;
    updatedAt: Date;

    createdById: number;
    updatedById: number;
    getOwner: HasOneGetAssociationMixin<User>;
    getLastUpdater: HasOneGetAssociationMixin<User>;

    }