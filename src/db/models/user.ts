import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/db';

interface UserAttributes {
    id: number,
    email: string,
    password: string
    role: string
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  };
  
  export interface UserInput extends Optional<UserAttributes, 'id' | 'role'> {}
  export interface UserOuput extends Required<UserAttributes> {}
  
  class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number
    public email!: string;
    public password!: string;
    public role!: "member" | "admin"

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
  }

  User.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'member'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    timestamps: true,
    sequelize,
    paranoid: true
  })
  
  export default User
  