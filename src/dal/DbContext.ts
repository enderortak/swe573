import { Sequelize, DataTypes, Options } from "sequelize";
import * as bcrypt from "bcrypt"
import { Comment } from "../domain/Comment";
import { Community } from "../domain/Community";
import { Field } from "../domain/Field";
import { FieldType } from "../domain/FieldType";
import { StringData, IntegerData, FloatData, BooleanData, DateTimeData, BlobData, FieldValue } from "../domain/FieldValue";
import { Like } from "../domain/Like";
import { Post } from "../domain/Post";
import { PostType } from "../domain/PostType";
import { User } from "../domain/User";
import { DataType } from "../domain/DataType";
import { stat } from "fs";


export class DAL {
  private static readonly DB_URI :string = "postgres://ceuvopmvxergim:b9bb24cd662ac6e1086e7437382cfa123a4d17ed28350b9e1ab5dec84eb884ee@ec2-54-247-85-251.eu-west-1.compute.amazonaws.com:5432/de49cled2utdmo";
  private static readonly SEQUELIZE_OPTIONS :Options =     {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: true
    }
  }
  public DbContext :Sequelize;
  /**
   * init
   */
  public async init() {
    this.DbContext = new Sequelize(DAL.DB_URI, DAL.SEQUELIZE_OPTIONS)
    try {
      await this.DbContext.authenticate()
      console.log("Connection has been established successfully.");
    }
    catch (err) {
      console.error("Unable to connect to the database:", err);
    }
    this.initModels()
    this.initAssociations()
  }
  private initModels() {
    Comment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        content: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "Comments",
        sequelize: this.DbContext
      }
    )
  
    Community.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        tags: {
          type: DataTypes.STRING(128),
          allowNull: true,
        }
      },
      {
        tableName: "Communities",
        sequelize: this.DbContext
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
        }
      },
      {
        tableName: "Fields",
        sequelize: this.DbContext
      }
    )
  
    FieldType.init(
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
        dataType: {
          type: DataTypes.ENUM(...Object.keys(DataType).filter((item) => !isNaN(Number(item)))),
          allowNull: false,
        },
      },
      {
        tableName: "FieldTypes",
        sequelize: this.DbContext
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
        sequelize: this.DbContext
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
        sequelize: this.DbContext
      }
    )
  
    FloatData.init(
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
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        tableName: "FloatData",
        sequelize: this.DbContext
      }
    )
  
    BooleanData.init(
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
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        tableName: "BooleanData",
        sequelize: this.DbContext
      }
    )
  
    DateTimeData.init(
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
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: "DateTimeData",
        sequelize: this.DbContext
      }
    )
  
    BlobData.init(
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
          type: DataTypes.BLOB,
          allowNull: false,
        },
      },
      {
        tableName: "BlobData",
        sequelize: this.DbContext
      }
    )
  
    Like.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "Likes",
        sequelize: this.DbContext
      }
    )
  
    Post.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        createdById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        updatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(128),
          allowNull: false
        },
        communityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        postTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "Posts",
        sequelize: this.DbContext
      }
    )
  
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
        },
        communityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "PostTypes",
        sequelize: this.DbContext
      }
    )
  
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        }
      },
      {
        tableName: "Users",
        sequelize: this.DbContext
      }
    )
  
    User.beforeCreate(async (user: User) => {
  
      try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
      }
      catch (_err) {
        throw new Error(_err);
      }
    });
  
  }

  private initAssociations() {
    

  User.hasMany(Community, {
    sourceKey: "id",
    foreignKey: "createdById"
  });

  Community.belongsTo(User, {
    foreignKey: "createdById"
  });

  const CommunityMember = this.DbContext.define("CommunityMembers", { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, });

  User.belongsToMany(Community, {
    through: CommunityMember,
    sourceKey: "id"
  });

  Community.belongsToMany(User, {
    through: CommunityMember,
    sourceKey: "id"
  });

  PostType.hasMany(Field, {
    sourceKey: "id",
    foreignKey: "postTypeId"
  })

  Field.belongsTo(PostType, {
    foreignKey: "postTypeId",
  });

  Post.hasMany(Comment, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Comment.belongsTo(Post, {
    foreignKey: "postId"
  })

  Post.hasMany(Like, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Like.belongsTo(Post, {
    foreignKey: "postId"
  })

  FieldType.hasMany(Field, {
    sourceKey: "id",
    foreignKey: "fieldTypeId"
  })

  Field.belongsTo(FieldType, {
    foreignKey: "fieldTypeId"
  })

  Field.hasMany(StringData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  StringData.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  Field.hasMany(FloatData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  FloatData.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  Field.hasMany(IntegerData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  IntegerData.belongsTo(Field, {
    foreignKey: "fieldId",
    constraints: false
  })

  Field.hasMany(BooleanData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  BooleanData.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  Field.hasMany(DateTimeData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  DateTimeData.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  Field.hasMany(BlobData, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  BlobData.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  Community.hasMany(PostType, {
    sourceKey: "id",
    foreignKey: "communityId"
  })

  PostType.belongsTo(Community, {
    foreignKey: "communityId"
  })

  Community.hasMany(Post, {
    sourceKey: "id",
    foreignKey: "communityId"
  })

  Post.belongsTo(Community, {
    foreignKey: "communityId"
  });

  }

  public reset(){
    this.DbContext.sync({ force: true })
  }

}




  



//   await (async () => {
//     try {
//       await DbContext.sync({ force: true })
//   } catch(e) {
//     console.log("qwe" + e);
//   }
//   })()
// }

// export default InitDb;