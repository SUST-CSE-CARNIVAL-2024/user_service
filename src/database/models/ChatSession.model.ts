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

export interface ChatSesstionAttributes {
  id: number;
  victimId: number;
  mentorId: number;
  temporary_emotionalState: Json;
  createdAt?: Date;
  expires_at: Date;
  expired: boolean;
}

class ChatSesstion extends Model implements ChatSesstionAttributes {
  public id!: number;
  public victimId!: number;
  public mentorId!: number;

  public temporary_emotionalState!: Json;
  public expires_at: Date;
  public readonly createdAt!: Date;
  public expired!: boolean;
}

ChatSesstion.init(
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

    mentorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    temporary_emotionalState: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    expired: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "chat_sessions",
    timestamps: true,
  }
);

export default ChatSesstion;
