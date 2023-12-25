#!/usr/bin/env node

const ingredient = require("./models/ingredient");
const recipe = require("./models/recipe");
const recipeIngredient = require("./models/recipe-ingredient");
const user = require("./models/user");
const loadModels = require("../index");

// parse the second argument as the dialect
const dialect = process.argv[2];

console.log(loadModels(dialect, ingredient, recipe, recipeIngredient, user));
