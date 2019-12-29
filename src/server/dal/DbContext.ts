import { Sequelize, DataTypes, Options } from "sequelize";
import * as bcrypt from "bcrypt"
import { Comment } from "../domain/Comment";
import { Community } from "../domain/Community";
import { Field } from "../domain/Field";
import { FieldType } from "../domain/FieldType";
import { StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue, FieldValue } from "../domain/FieldValue";
import { Like } from "../domain/Like";
import { Post } from "../domain/Post";
import { PostType } from "../domain/PostType";
import { User } from "../domain/User";
import { DataType } from "../domain/DataType";
import DemoInitializer from "./DemoInitializer";


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

  public static CommunityMember :any;

  constructor(){
    this.DbContext = new Sequelize(DAL.DB_URI, DAL.SEQUELIZE_OPTIONS)
  }
  /**
   * init
   */
  public async init() {

    try {
      await this.DbContext.authenticate()
      console.log("Connection has been established successfully.");
    }
    catch (err) {
      console.error("Unable to connect to the database:", err);
    }
    this.initModels()
    this.initAssociations()
    await this.reset()
    const initializer = new DemoInitializer();
    await initializer.init()
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
          type: DataTypes.STRING(4096),
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
        image: {
          type: DataTypes.STRING
        },
        description: {
          type: DataTypes.STRING(4096),
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
  
    StringValue.init(
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
          type: DataTypes.STRING(4096),
          allowNull: false,
        },
      },
      {
        tableName: "StringValues",
        sequelize: this.DbContext
      }
    )
  
    IntegerValue.init(
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
        tableName: "IntegerValues",
        sequelize: this.DbContext
      }
    )
  
    FloatValue.init(
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
        tableName: "FloatValues",
        sequelize: this.DbContext
      }
    )
  
    BooleanValue.init(
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
        tableName: "BooleanValues",
        sequelize: this.DbContext
      }
    )
  
    DateTimeValue.init(
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
        tableName: "DateTimeValues",
        sequelize: this.DbContext
      }
    )
  
    BlobValue.init(
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
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "BlobValues",
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
        image: {
          type: DataTypes.STRING(128),
          allowNull: true
        },
        tags: {
          type: DataTypes.STRING,
          allowNull: true
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
          type: DataTypes.STRING(1024),
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
        fullName: {
          type: DataTypes.VIRTUAL,
          get () {
            return this.getDataValue('firstName') + " " + this.getDataValue('lastName')
          }
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
  
    // User.beforeCreate((user: User) => {
  
    //   try {
    //     const hash = bcrypt.hashSync(user.password, 10);
    //     console.log("pass: " +user.password)
    //     console.log("hash: " + hash)
    //     user.password = hash;
    //   }
    //   catch (_err) {
    //     throw new Error(_err);
    //   }
    // });
  
  }

  private initAssociations() {
    
  // #region Comment

  Comment.belongsTo(User, {
    foreignKey: "createdById"
  })

  Comment.belongsTo(User, {
    foreignKey: "updatedById"
  })

  Comment.belongsTo(Post, {
    foreignKey: "postId"
  })

  //#endregion
  
  // #region CommunityMember

  const CommunityMember = this.DbContext.define(
    "CommunityMembers",
    {
       id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        }
    });
  DAL.CommunityMember = CommunityMember;

  // #endregion

  // #region Community

  Community.belongsTo(User, {
    foreignKey: "createdById"
  });

  Community.belongsToMany(User, {
    through: CommunityMember,
    sourceKey: "id"
  });

  Community.hasMany(PostType, {
    sourceKey: "id",
    foreignKey: "communityId"
  })

  Community.hasMany(Post, {
    sourceKey: "id",
    foreignKey: "communityId"
  })

  // #endregion

  // #region Field

  Field.belongsTo(PostType, {
    foreignKey: "postTypeId",
  });

  Field.belongsTo(FieldType, {
    foreignKey: "fieldTypeId"
  })

  Field.hasMany(StringValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  Field.hasMany(IntegerValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  Field.hasMany(FloatValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  Field.hasMany(BooleanValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  Field.hasMany(DateTimeValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  Field.hasMany(BlobValue, {
    sourceKey: "id",
    foreignKey: "fieldId"
  })

  // #endregion
  
  // #region FieldType
  FieldType.hasMany(Field, {
    sourceKey: "id",
    foreignKey: "fieldTypeId"
  })
  // #endregion

  // #region FieldValue

  StringValue.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  StringValue.belongsTo(Post, {
    foreignKey: "postId"
  })

  IntegerValue.belongsTo(Field, {
    foreignKey: "fieldId",
    constraints: false
  })

  IntegerValue.belongsTo(Post, {
    foreignKey: "postId",
    constraints: false
  })

  FloatValue.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  FloatValue.belongsTo(Post, {
    foreignKey: "postId"
  })

  BooleanValue.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  BooleanValue.belongsTo(Post, {
    foreignKey: "postId"
  })

  DateTimeValue.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  DateTimeValue.belongsTo(Post, {
    foreignKey: "postId"
  })

  BlobValue.belongsTo(Field, {
    foreignKey: "fieldId"
  })

  BlobValue.belongsTo(Post, {
    foreignKey: "postId"
  })

  // #endregion

  // #region Like

  Like.belongsTo(Post, {
    foreignKey: "postId"
  })

  // #endregion

  // #region Post

  Post.hasMany(Comment, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.hasMany(Like, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.belongsTo(Community, {
    foreignKey: "communityId"
  });

  Post.hasMany(StringValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })
  
  Post.hasMany(IntegerValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.hasMany(FloatValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.hasMany(BooleanValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.hasMany(DateTimeValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  Post.hasMany(BlobValue, {
    sourceKey: "id",
    foreignKey: "postId"
  })

  // #endregion
  
  // #region PostType

  PostType.belongsTo(Community, {
    foreignKey: "communityId"
  })

  PostType.hasMany(Field, {
    sourceKey: "id",
    foreignKey: "postTypeId"
  })

  // #endregion
  
  // #region User

  User.hasMany(Community, {
    sourceKey: "id",
    foreignKey: "createdById"
  });

  User.belongsToMany(Community, {
    through: CommunityMember,
    sourceKey: "id"
  });

  User.hasMany(Comment, {
    sourceKey: "id",
    foreignKey: "createdById"
  })

  User.hasMany(Comment, {
    sourceKey: "id",
    foreignKey: "updatedById"
  })

  // #endregion

  }

  public async reset(){
    await this.DbContext.sync({ force: true })
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