import { BaseEntity } from "./_BaseEntity";
import { Field } from "./Field";
import { Association } from "sequelize";

export class PostType extends BaseEntity {
    
    public Name!: string;
    public CommunityId!: number;
    public Fields?: Field[];    
    public static associations: {
        Fields: Association<PostType, Field>
      };
}