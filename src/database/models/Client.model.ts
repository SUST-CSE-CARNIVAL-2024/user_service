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
import User from "./User.model";

export interface ClientAttributes {
  id: number;
  userId: number;
  emotionalState: Json;
}

export interface ClientCreationAttributes
  extends Optional<ClientAttributes, "emotionalState"> {}

class Client extends Model implements ClientAttributes {
  public id!: number;
  public emotionalState!: Json;

  // define associations
  public userId!: number;
  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;

  public static associations: {
    user: Association<Client, User>;
  };
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    emotionalState: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "clients",
    timestamps: true,
  }
);

export default Client;
