import { BaseEntity } from "./base/BaseEntity";
import { Community } from "./Community";
import { HasManyGetAssociationsMixin } from "sequelize";
import { Post } from "./Post";
import { Like } from "./Like";
import { PostType } from "./PostType";

export class User extends BaseEntity{
    
    // User
    public username!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    get fullName () { return `${this.firstName} ${this.lastName}` }
    public email!: string;
    public isAdmin!: boolean;

    public getOwnedCommunities!: HasManyGetAssociationsMixin<Community>;
    public getSubscribedCommunities!: HasManyGetAssociationsMixin<Community>;
    public getPosts!: HasManyGetAssociationsMixin<Post>;
    public getComments!: HasManyGetAssociationsMixin<Comment>;
    public getLikes!: HasManyGetAssociationsMixin<Like>;
    public getPostTypes!: HasManyGetAssociationsMixin<PostType>;

}