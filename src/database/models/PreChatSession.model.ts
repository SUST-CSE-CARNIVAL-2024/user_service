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

export interface PreChatSesstionAttributes {
  id: number;
  victimId: number;
  seeking_emotionalState: Json;
  expires_at: Date;
  createdAt?: Date;
}

class PreChatSesstion extends Model implements PreChatSesstionAttributes {
  public id!: number;
  public victimId!: number;
  public seeking_emotionalState!: Json;
  public expires_at: Date;
  public readonly createdAt!: Date;

  // define associations
}

PreChatSesstion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    victimId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    seeking_emotionalState: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "pre_chat_sessions",
    timestamps: true,
  }
);

export default PreChatSesstion;
