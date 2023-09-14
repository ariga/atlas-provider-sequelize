#! /usr/bin/env ts-node-script

import Phone from "./models/Phone";
import Email from "./models/Email";
import Contact from "./models/Contact";
import { loadSequelizeModels } from "../src/sequelize_schema";

// parse the second argument as the dialect
const dialect = process.argv[2];

// load the models
console.log(loadSequelizeModels(dialect, [Phone, Email, Contact]));
