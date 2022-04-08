import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Sequelize } from 'sequelize';


const dbConnection = process.env.DATABASE_URL
console.log(dbConnection)
console.log("hey")
if (!dbConnection) {
    throw 'Not found db connection'
}

const sequelize = new Sequelize(dbConnection);
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare firstName: string;
    declare lastName: string;
    declare gender: string | null;
    declare email: string;
    declare avatar: string | null;
    declare password: string;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>

}



User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        lastName: {
            type: new DataTypes.STRING(128),
            allowNull: false
        },
        email: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false
        },
        gender: {
            type: new DataTypes.STRING(50),
            allowNull: true
        },
        avatar: {
            type: new DataTypes.TEXT,
            allowNull: true
        },


        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        tableName: 'users',
        sequelize
    }
);
