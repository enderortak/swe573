import { BaseEntity } from "./_BaseEntity";
import { Community } from "./Community";
import { Association } from "sequelize";

export class User extends BaseEntity{
    
    public Username!: string;
    public Password!: string;
    public FirstName!: string;
    public LastName!: string;
    public readonly Name: string = `${this.FirstName} ${this.LastName}`
    public Email!: string;
    public IsAdmin!: boolean;
    public readonly OwnedCommunities?: Community[];
    public readonly SubscribedCommunities?: Community[];        
    public static associations: {
        OwnedCommunities: Association<User, Community>,
        SubscribedCommunities: Association<User, Community>
      };

}