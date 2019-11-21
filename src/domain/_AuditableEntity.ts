import { BaseEntity } from "./_BaseEntity";
import { User } from "./User";

export abstract class AuditableEntity extends BaseEntity {
    
    public readonly CreatedAt!: Date;
    public readonly UpdatedAt!: Date;

    public readonly CreatedById!: number;
    public readonly UpdatedById!: number;

    public readonly CreatedBy?: User;
    public readonly UpdatedBy?: User;
    
}