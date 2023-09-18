#! /usr/bin/env ts-node-script

import Phone from "./models/Phone";
import Email from "./models/Email";
import Contact from "./models/Contact";
import { loadModels } from "../src/sequelize_schema";

// parse the second argument as the dialect
const dialect = process.argv[2];

console.log(loadModels(dialect, [Phone, Email, Contact]));
