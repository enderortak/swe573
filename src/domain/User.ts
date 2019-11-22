import { BaseEntity } from "./base/BaseEntity";
import { Community } from "./Community";
import { Association, HasManyGetAssociationsMixin } from "sequelize";

export class User extends BaseEntity{
    
    // User
    public username!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public readonly name: string = `${this.firstName} ${this.lastName}`
    public email!: string;
    public isAdmin!: boolean;

    public getOwnedCommunities!: HasManyGetAssociationsMixin<Community>;
    public getSubscribedCommunities!: HasManyGetAssociationsMixin<Community>;
    
    // todo: subscribe

}