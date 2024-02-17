// external imports
import {
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
} from "sequelize";

//internal import
import sequelizeConnection from "../config";
import { Json } from "sequelize/types/utils";
import { UserRole } from "../../schemas/auth_request.schema";

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  role: string;
  salt: string;
}

class User extends Model implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: string;
  public salt!: string;

  // define associations
  public getClient!: HasOneGetAssociationMixin<Client>;
  public setClient!: HasOneSetAssociationMixin<Client, number>;

  public getMentor!: HasOneGetAssociationMixin<Mentor>;
  public setMentor!: HasOneSetAssociationMixin<Mentor, number>;

  public static associations: {
    client: Association<User, Client>;
    mentor: Association<User, Mentor>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM,
      values: Object.values(UserRole),
      defaultValue: UserRole.CLIENT,
    },

    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    timestamps: true,
  }
);

export default User;

//------------------------- relations -------------------------//

// between User and Client
import Client from "./Client.model";

User.hasOne(Client, {
  foreignKey: "userId",
});
Client.belongsTo(User, {
  foreignKey: "userId",
});

// between User and Mentor
import Mentor from "./Mentor.model";
User.hasOne(Mentor, {
  foreignKey: "userId",
});

Mentor.belongsTo(User, {
  foreignKey: "userId",
});
