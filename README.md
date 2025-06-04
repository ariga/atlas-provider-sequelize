# atlas-provider-sequelize

![CI](https://github.com/ariga/atlas-provider-sequelize/actions/workflows/ci.yaml/badge.svg)

Use [Atlas](https://atlasgo.io/) with [Sequelize](https://sequelize.org/) to manage your database schema as code. By connecting your Sequelize models to Atlas,
you can define and edit your schema directly in TypeScript or JavaScript. Atlas will then automatically plan and apply database schema migrations for you, 
eliminating the need to write migrations manually.

Atlas brings automated CI/CD workflows to your database, along with built-in support for [testing](https://atlasgo.io/testing/schema), [linting](https://atlasgo.io/versioned/lint),
schema [drift detection](https://atlasgo.io/monitoring/drift-detection), and [schema monitoring](https://atlasgo.io/monitoring). It also allows you to extend Sequelize with 
advanced database objects such as triggers, row-level security, and custom functions that are not supported natively.

### Use-cases
1. [**Declarative migrations**](https://atlasgo.io/declarative/apply) - Use the Terraform-like `atlas schema apply --env sequelize` command to apply your Sequelize schema to the database.
2. [**Automatic migration planning**](https://atlasgo.io/versioned/diff) - Use `atlas migrate diff --env sequelize` to automatically plan database schema changes and generate
   a migration from the current database version to the desired version defined by your Sequelize schema.

### Installation

Install Atlas from macOS or Linux by running:
```bash
curl -sSf https://atlasgo.sh | sh
```
See [atlasgo.io](https://atlasgo.io/getting-started#installation) for more installation options.

Install the provider by running:
```bash
npm i @ariga/atlas-provider-sequelize
```

Make sure all your Node dependencies are installed by running:
```bash
npm i
```

#### Standalone 

If all of your Sequelize models exist in a single Node module, 
you can use the provider directly to load your Sequelize schema into Atlas.

In your project directory, create a new file named `atlas.hcl` with the following contents:

```hcl
data "external_schema" "sequelize" {
  program = [
    "npx",
    "@ariga/atlas-provider-sequelize",
    "load",
    "--path", "./path/to/models",
    "--dialect", "mysql", // mariadb | postgres | sqlite | mssql
  ]
}

env "sequelize" {
  src = data.external_schema.sequelize.url
  dev = "docker://mysql/8/dev"
  migration {
    dir = "file://migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}
```

#### As JS Script 

If you want to use the provider as JS script, you can use the provider as follows:

Create a new file named `load.js` with the following contents:

```js
#!/usr/bin/env node

// require sequelize models you want to load
const user = require("./models/user");
const task = require("./models/task");
const loadModels = require("@ariga/atlas-provider-sequelize");

console.log(loadModels("mysql", user, task));
```

Next, in your project directory, create a new file named `atlas.hcl` with the following contents:

```hcl
data "external_schema" "sequelize" {
    program = [
        "node",
        "load.js",
    ]
}

env "sequelize" {
    src = data.external_schema.sequelize.url
    dev = "docker://mysql/8/dev"
    migration {
        dir = "file://migrations"
    }
    format {
        migrate {
            diff = "{{ sql . \"  \" }}"
        }
    }
}
```

### Usage

Once you have the provider installed, you can use it to apply your Sequelize schema to the database:

#### Apply

You can use the `atlas schema apply` command to plan and apply a migration of your database to
your current Sequelize schema. This works by inspecting the target database and comparing it to the
Sequelize schema and creating a migration plan. Atlas will prompt you to confirm the migration plan
before applying it to the database.

```bash
atlas schema apply --env sequelize -u "mysql://root:password@localhost:3306/mydb"
```
Where the `-u` flag accepts the [URL](https://atlasgo.io/concepts/url) to the
target database.

#### Diff

Atlas supports a [version migration](https://atlasgo.io/concepts/declarative-vs-versioned#versioned-migrations) 
workflow, where each change to the database is versioned and recorded in a migration file. You can use the
`atlas migrate diff` command to automatically generate a migration file that will migrate the database
from its latest revision to the current Sequelize schema.

```bash
atlas migrate diff --env sequelize 
````

### Typescript
for typescript support, see the [ts-atlas-provider-sequelize](https://github.com/ariga/atlas-provider-sequelize/tree/master/ts) README.

### Supported Databases

The provider supports the following databases:
* MySQL
* MariaDB
* PostgreSQL
* SQLite
* Microsoft SQL Server

### Issues

Please report any issues or feature requests in the [ariga/atlas](https://github.com/ariga/atlas/issues) repository.

### License

This project is licensed under the [Apache License 2.0](LICENSE).
