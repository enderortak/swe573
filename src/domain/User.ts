import { BaseEntity } from "./base/BaseEntity";
import { Community } from "./Community";
import { Association } from "sequelize";

export class User extends BaseEntity{
    
    public username!: string;
    public password!: string;
    public firstName!: string;
    public lastName!: string;
    public readonly name: string = `${this.firstName} ${this.lastName}`
    public email!: string;
    public isAdmin!: boolean;
    // public static associations: {
    //     OwnedCommunities: Association<User, Community>,
    //     SubscribedCommunities: Association<User, Community>
    //   };

}