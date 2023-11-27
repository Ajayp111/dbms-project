import { Sequelize } from "sequelize";

const db = new Sequelize("project", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
