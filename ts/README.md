# ts-atlas-provider-sequelize

Load [Sequelize-TypeScript](https://github.com/sequelize/sequelize-typescript) models into an [Atlas](https://atlasgo.io) project.

### Use-cases

1. **Declarative migrations** - use a Terraform-like `atlas schema apply --env sequelize` to apply your Sequelize schema to the database.
2. **Automatic migration planning** - use `atlas migrate diff --env sequelize` to automatically plan a migration from the current database version to the Sequelize schema.

### Installation

Install Atlas from macOS or Linux by running:

```bash
curl -sSf https://atlasgo.sh | sh
```

See [atlasgo.io](https://atlasgo.io/getting-started#installation) for more installation options.

Install the provider by running:

```bash
npm i @ariga/ts-atlas-provider-sequelize
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
    "@ariga/ts-atlas-provider-sequelize",
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

#### As TS Script

If you want to use the provider as TS script, you can use the provider as follows:

Create a new file named `load.ts` with the following contents:

```ts
#!/usr/bin/env ts-node-script

// import sequelize models you want to load
import User from "./models/user";
import Task from "./models/task";
import { loadModels } from "@ariga/ts-atlas-provider-sequelize/src/sequelize_schema";

console.log(loadModels("mysql", [User, Task]));
```

Next, in your project directory, create a new file named `atlas.hcl` with the following contents:

```hcl
data "external_schema" "sequelize" {
    program = [
        "npx",
        "ts-node",
        "load.ts",
        "mysql"
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
```

### Supported Databases

The provider supports the following databases:

- MySQL
- MariaDB
- PostgreSQL
- SQLite
- Microsoft SQL Server

### Issues

Please report any issues or feature requests in the [ariga/atlas](https://github.com/ariga/atlas/issues) repository.

### License

This project is licensed under the [Apache License 2.0](LICENSE).
