import { BaseEntity } from "./base/BaseEntity";
import { Field } from "./Field";
import { HasOneGetAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { Community } from "./Community";
import { Post } from "./Post";
import { FieldType } from "./FieldType";

export class PostType extends BaseEntity {
    
    // PostType
    public name!: string;
    public communityId!: number;
    public getCommunity!: HasOneGetAssociationMixin<Community>;
    public getPosts!: HasManyGetAssociationsMixin<Post>;
    // public getFields!: HasManyGetAssociationsMixin<Field>;
    public async getFields() {
        return await Field.findAll({
            where: { postTypeId: this.id },
            include: [
                FieldType
            ]
        })
    }

}