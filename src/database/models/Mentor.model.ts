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

export interface MentorAttributes {
  id: number;
  userId: number;
  expertise_emotionalState: Json;
}

export interface MentorCreationAttributes
  extends Optional<MentorAttributes, "expertise_emotionalState"> {}

class Mentor extends Model implements MentorAttributes {
  public id!: number;
  public expertise_emotionalState!: Json;

  // define associations
  public userId!: number;
  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;

  public static associations: {
    user: Association<Mentor, User>;
  };
}

Mentor.init(
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

    expertise_emotionalState: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "mentors",
    timestamps: true,
  }
);

export default Mentor;
