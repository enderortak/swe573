import { BaseEntity } from "./base/BaseEntity";
import { Field } from "./Field";
import { HasOneGetAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { Community } from "./Community";
import { Post } from "./Post";

export class PostType extends BaseEntity {
    
    // PostType
    public name!: string;
    public communityId!: number;
    public getCommunity!: HasOneGetAssociationMixin<Community>;
    public getPosts!: HasManyGetAssociationsMixin<Post>;
    public getFields!: HasManyGetAssociationsMixin<Field>;

}