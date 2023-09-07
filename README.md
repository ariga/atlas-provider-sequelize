# atlas-provider-sequelize
Load [sequelize](https://sequelize.org/) models into an [Atlas](https://atlasgo.io) project.

### Installation

Install Atlas from macOS or Linux by running:
```bash
curl -sSf https://atlasgo.sh | sh
```
See [atlasgo.io](https://atlasgo.io/getting-started#installation) for more installation options.

### Usage
run npm install in your project directory:
```bash
npm i 
```
In your project directory, create a new file named `atlas.hcl` with the following contents:

```hcl
data "external_schema" "sequelize" {
  program = [
    "npx",
    "@ariga/atlas-provider-sequelize",
    "load",
    "--path", "./path/to/models",
    "--dialect", "mysql", // | postgres | sqlite | mssql | mariadb
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
### Supported Databases

The provider supports the following databases:
* MySQL
* MariaDB
* PostgreSQL
* SQLite
* Microsoft SQL Server