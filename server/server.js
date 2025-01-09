const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.json());
app.use(cors());

const db = require('./models')

// Routers
const budgetsRouter = require('./routes/Budgets')
app.use("/budgets", budgetsRouter);

const expensesRouter = require('./routes/Expenses')
app.use("/expenses", expensesRouter );

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port 3001"); 
    });
});
