import { AuditableEntity } from "./_AuditableEntity";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Association } from "sequelize";
import { FieldValue } from "./FieldValue";

export class Post extends AuditableEntity {
    
    public Title!: string;
    public CommunityId!: number;
    public PostTypeId!: number;
    public Comments?: Comment[];
    public Likes?: Like[];
    public FieldValues?: FieldValue[];
    public static associations: {
        Comments: Association<Post, Comment>,
        Likes: Association<Post, Like>,
        FieldValues: Association<Post, FieldValue>
      };
}