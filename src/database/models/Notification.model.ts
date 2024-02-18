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

export interface NotificationAttributes {
  id: number;
  userId: number;
  expires_at: Date;
  valid: boolean;
  preChatSessionId: number;
}

class Notification extends Model implements NotificationAttributes {
  public id!: number;
  public expires_at!: Date;
  public valid!: boolean;
  public preChatSessionId!: number;
  public readonly createdAt!: Date;
  public userId!: number;
}

Notification.init(
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

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    preChatSessionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "notifications",
    timestamps: true,
  }
);

export default Notification;
