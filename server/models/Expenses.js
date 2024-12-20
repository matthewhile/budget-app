module.exports = (sequelize, DataTypes) => {
    const Expenses = sequelize.define("Expenses", {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        BudgetId: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            references: {
                model: 'Budgets', 
                key: 'Id',      
            }
        },
        ExpenseAmount: {
            type: DataTypes.DECIMAL(18, 2), 
            allowNull: false,
            defaultValue: 0,
        },
        Description: {
            type: DataTypes.STRING(50), 
            allowNull: false,
        },
        Date: {
            type: DataTypes.DATE, 
            allowNull: false,
        },
    }, {
        timestamps: false, 
    });

    return Expenses;
};