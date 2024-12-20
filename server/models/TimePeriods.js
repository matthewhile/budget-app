module.exports = (sequelize, DataTypes) => {
    const TimePeriods = sequelize.define("TimePeriods", {
        Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        Month: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
        Year: {
            type: DataTypes.INTEGER, 
            allowNull: false,
        },
    }, {
        timestamps: false, 
    });

    return TimePeriods;
};