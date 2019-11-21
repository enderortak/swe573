import { Model } from 'sequelize';

export abstract class BaseEntity extends Model {
    
    public Id!: number;

}