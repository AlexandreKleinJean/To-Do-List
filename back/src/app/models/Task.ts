import { Model, DataTypes } from 'sequelize';
import sequelize from "../database";

class TaskModel extends Model {
    public name!: string;
    public static initialize(): void {
        this.init(
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                tableName: "tasks",
            }
        );
    }
}

TaskModel.initialize();

export default TaskModel;
