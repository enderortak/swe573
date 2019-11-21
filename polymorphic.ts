import { Model, Association, Sequelize, DataTypes } from "sequelize";
import { Options } from "sequelize";

class PostType extends Model {
    id: number;
    name: string;
    fields: Field[];
    posts: Post[];
    public static associations: {
        fields: Association<PostType, Field>,
        posts: Association<PostType, Post>
      };
}

class Post extends Model {
    id: number;
    postType: PostType;
    postTypeId: number;
    title: string;
    public static associations: {
        postType: Association<Post, PostType>
      };
}

class Field extends Model {
    id: number;
    postType: PostType;
    postTypeId: number;
    fieldValues: FieldValue[];
    public static associations: {
        postType: Association<Field, PostType>,
        fieldsValues: Association<Field, FieldValue>
      };
}

abstract class FieldValue extends Model {
    id: number;
    field: Field;
    fieldId: number;
    post: Post;
    postId: number;
}

class StringData extends FieldValue {
    value: string;
    public static associations: {
        field: Association<StringData, Field>,
        post: Association<StringData, Post>
      };
}

class IntegerData extends FieldValue {
    value: number;
    public static associations: {
        field: Association<IntegerData, Field>,
        post: Association<IntegerData, Post>
      };
}
(async () => {
    const DB_URI :string = "postgres://ceuvopmvxergim:b9bb24cd662ac6e1086e7437382cfa123a4d17ed28350b9e1ab5dec84eb884ee@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/de49cled2utdmo";
    const SEQUELIZE_OPTIONS :Options =     {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
        ssl: true
        }
    }
    const dbContext = new Sequelize(DB_URI, SEQUELIZE_OPTIONS)


    try {
        await dbContext.authenticate()
        console.log("Connection has been established successfully.");
    }
    catch (err) {
        console.error("Unable to connect to the database:", err);
    }

    PostType.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING(128),
            allowNull: false,
          }
        },
        {
          tableName: "PostTypes",
          sequelize: dbContext
        }
      )

      Post.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          title: {
            type: DataTypes.STRING(128),
            allowNull: false
          },
          PostTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          }
        },
        {
          tableName: "Posts",
          createdAt: "CreatedAt",
          updatedAt: "UpdatedAt",
          sequelize: dbContext
        }
      )

      Field.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING(128),
            allowNull: false,
          },
          fieldTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          tableName: "Fields",
          sequelize: dbContext
        }
      )

      StringData.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          fieldId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          value: {
            type: DataTypes.STRING(1024),
            allowNull: false,
          },
        },
        {
          tableName: "StringData",
          sequelize: dbContext,
          modelName: "stringData"
        }
      )
    
      IntegerData.init(
        {
          id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
          },
          fieldId: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          value: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          tableName: "IntegerData",
          sequelize: dbContext,
          modelName: "integerData"
        }
      )

      PostType.hasMany(Field, {
        sourceKey: "id",
        foreignKey: "postTypeId",
        as: "fields" // this determines the name in `associations`!
      })
    
      Field.belongsTo(PostType, {
        foreignKey: "postTypeId",
      });

      Post.hasMany(StringData, {
        sourceKey: "id",
        foreignKey: "postId",
        as: "fields" // this determines the name in `associations`!
      })
    
      StringData.belongsTo(Post, {
        foreignKey: "postId",
      });
})()

