import { AuditableEntity } from "./_AuditableEntity";
import { Association } from "sequelize";
import { User } from "./User";

export class Comment extends AuditableEntity {

    public Content!: string;
    public PostId!: number;

    public static associations: {
        CreatedBy: Association<Comment, User>,
        UpdatedBy: Association<Comment, User>
      };
    
}