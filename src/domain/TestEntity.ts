// import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';
// import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
// import DbContext from '../dal/DbContext';

// export class TestEntity extends Model {
//   public id!: number; // Note that the `null assertion` `!` is required in strict mode.
//   public name!: string;
//   public preferredName!: string | null; // for nullable fields

//   // timestamps!
//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;

//   }


//   TestEntity.init({
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: new DataTypes.STRING(128),
//       allowNull: false,
//     },
//     preferredName: {
//       type: new DataTypes.STRING(128),
//       allowNull: true
//     }
//   }, {
//     tableName: "TestEntities",
//     sequelize: DbContext, // this bit is important
//   });

//   async function stuff() {
//     // Please note that when using async/await you lose the `bluebird` promise context
//     // and you fall back to native
//     try {
//     await TestEntity.sync({force: true})
//     const newTestEntity = await TestEntity.create({
//       name: 'Johnny',
//       preferredName: 'John',
//     }).catch((error) => {
//         console.log(error)
//       });
//     console.log(newTestEntity.id, newTestEntity.name, newTestEntity.preferredName);
  
  
//     const ourTestEntity = await TestEntity.findByPk(1, {
//       rejectOnEmpty: true, // Specifying true here removes `null` from the return type!
//     }).catch((error) => {
//         console.log(error)
//       });
//     console.log(ourTestEntity.name); // Note the `!` null assertion since TS can't know if we included
//                                             // the model or not
//     } catch(e) {
//         console.log("asd" + e);
//       }
//   }
//   stuff();