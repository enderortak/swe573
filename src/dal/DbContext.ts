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
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CreatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        UpdatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Content: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        PostId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "Comments",
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: this.DbContext
      }
    )
  
    Community.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CreatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        UpdatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        Description: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
        Tags: {
          type: DataTypes.STRING(128),
          allowNull: true,
        }
      },
      {
        tableName: "Communities",
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: this.DbContext
      }
    )
  
    Field.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        FieldTypeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        FieldValueDataType: DataTypes.STRING
      },
      {
        tableName: "Fields",
        sequelize: this.DbContext
      }
    )
  
    FieldType.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        DataType: {
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
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.STRING(1024),
          allowNull: false,
        },
      },
      {
        tableName: "StringData",
        sequelize: this.DbContext,
        modelName: "stringData"
      }
    )
  
    IntegerData.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: "IntegerData",
        sequelize: this.DbContext,
        modelName: "integerData"
      }
    )
  
    FloatData.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        tableName: "FloatData",
        sequelize: this.DbContext,
        modelName: "floatData"
      }
    )
  
    BooleanData.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        tableName: "BooleanData",
        sequelize: this.DbContext,
        modelName: "booleanData"
      }
    )
  
    DateTimeData.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        tableName: "DateTimeData",
        sequelize: this.DbContext,
        modelName: "dataTimeData"
      }
    )
  
    BlobData.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        FieldId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Value: {
          type: DataTypes.BLOB("long"),
          allowNull: false,
        },
      },
      {
        tableName: "BlobData",
        sequelize: this.DbContext,
        modelName: "blobData"
      }
    )
  
    Like.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CreatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        UpdatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        PostId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      },
      {
        tableName: "Likes",
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        sequelize: this.DbContext
      }
    )
  
    Post.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        CreatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        UpdatedById: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Title: {
          type: DataTypes.STRING(128),
          allowNull: false
        },
        CommunityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        sequelize: this.DbContext
      }
    )
  
    PostType.init(
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Name: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        CommunityId: {
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
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        Username: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        Password: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        FirstName: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        LastName: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        Email: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        IsAdmin: {
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
        const hash = await bcrypt.hash(user.Password, 10);
        user.Password = hash;
      }
      catch (_err) {
        throw new Error(_err);
      }
    });
  
  }

  private initAssociations() {
    

  User.hasMany(Community, {
    sourceKey: "Id",
    foreignKey: "CreatedById",
    as: "OwnedCommunities" // this determines the name in `associations`!
  });

  Community.belongsTo(User, {
    foreignKey: "CreatedById",
    as: "Owner"
  });

  const CommunityMember = this.DbContext.define("CommunityMembers", { id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, });

  User.belongsToMany(Community, {
    through: CommunityMember,
    sourceKey: "Id",
    as: "SubscribedCommunities"
  });

  Community.belongsToMany(User, {
    through: CommunityMember,
    sourceKey: "Id",
    as: "Members"
  });

  PostType.hasMany(Field, {
    sourceKey: "Id",
    foreignKey: "PostTypeId",
    as: "Fields" // this determines the name in `associations`!
  })

  Field.belongsTo(PostType, {
    foreignKey: "PostTypeId",
  });

  Post.hasMany(Comment, {
    sourceKey: "Id",
    foreignKey: "PostId",
    as: "Comments" // this determines the name in `associations`!
  })

  Comment.belongsTo(Post, {
    foreignKey: "PostId"
  })

  Post.hasMany(Like, {
    sourceKey: "Id",
    foreignKey: "PostId",
    as: "Likes" // this determines the name in `associations`!
  })

  Like.belongsTo(Post, {
    foreignKey: "PostId"
  })

  FieldType.hasMany(Field, {
    sourceKey: "Id",
    foreignKey: "FieldTypeId",
    as: "Likes" // this determines the name in `associations`!
  })

  Field.belongsTo(FieldType, {
    foreignKey: "FieldTypeId"
  })

  Field.hasMany(StringData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  StringData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "stringData"
    },
  })

  Field.hasMany(FloatData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  FloatData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "floatData"
    },
  })

  Field.hasMany(IntegerData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  IntegerData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "integerData"
    },
  })

  Field.hasMany(BooleanData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  BooleanData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "booleanData"
    },
  })

  Field.hasMany(DateTimeData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  DateTimeData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "dataTimeData"
    },
  })

  Field.hasMany(BlobData, {
    sourceKey: "Id",
    foreignKey: "FieldId",
    constraints: false,
    // as: "FieldValues" // this determines the name in `associations`!
  })

  BlobData.belongsTo(Field, {
    foreignKey: "FieldId",
    constraints: false,
    scope: {
      FieldValueDataType: "blobData"
    },
  })

  Community.hasMany(PostType, {
    sourceKey: "Id",
    foreignKey: "CommunityId",
    as: "PostTypes" // this determines the name in `associations`!
  })

  PostType.belongsTo(Community, {
    foreignKey: "CommunityId"
  })

  Community.hasMany(Post, {
    sourceKey: "Id",
    foreignKey: "CommunityId",
    as: "Posts" // this determines the name in `associations`!
  })

  Post.belongsTo(Community, {
    foreignKey: "CommunityId"
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