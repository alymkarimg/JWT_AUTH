import { Model, Optional, Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');
type UserAttributes = {
    id: number,
    email: string,
    password: string
    // other attributes...
  };
  
  // we're telling the Model that 'id' is optional
  // when creating an instance of the model (such as using Model.create()).
  type UserCreationAttributes = Optional<UserAttributes, 'id'>;
  
  export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare name: string;
    declare password: string;
  }