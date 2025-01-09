module.exports = (sequelize, DataTypes) => {
    const Budgets = sequelize.define("Budgets", {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        BudgetName: {
            type: DataTypes.STRING(25), 
            allowNull: false,
        },
        Max: {
            type: DataTypes.DECIMAL(18, 2), 
            allowNull: false,
        },
        BudgetAmount: {
            type: DataTypes.DECIMAL(18, 2), 
            allowNull: true,
            defaultValue: 0,
        },
    }, {
        timestamps: false, 
    });

    Budgets.associate = (models) => {
        Budgets.hasMany(models.Expenses)
    }

    return Budgets;
};
