import { AuditableEntity } from "./_AuditableEntity";
import { Post } from "./Post";
import { User } from "./User";
import { PostType } from "./PostType";
import { Association, HasManyGetAssociationsMixin } from "sequelize";

export class Community extends AuditableEntity {

    public Name!: string;
    public Description!: string;
    public Tags?: string | null;
    public readonly Members?: User[];
    public readonly PostTypes?: PostType[];
    public readonly Posts?: Post[];
    public readonly Owner!: User;
    public static associations: {
        Members: Association<Community, User>,
        PostTypes: Association<Community, PostType>,
        Posts: Association<Community, Post>,
        Owner: Association<Community, User>
      };
    public getPostTypes!: HasManyGetAssociationsMixin<PostType>
}