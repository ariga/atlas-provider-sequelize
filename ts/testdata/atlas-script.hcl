variable "dialect" {
  type = string
}

locals {
  dev_url = {
    mysql = "docker://mysql/8/dev"
    postgres = "docker://postgres/15"
    mssql = "docker://sqlserver/2022-latest"
    sqlite = "sqlite://file::memory:?cache=shared"
  }[var.dialect]
}

data "external_schema" "sequelize" {
  program = [
    "npx",
    "ts-node",
    "load-models.ts",
     var.dialect,
  ]
}

env "sequelize" {
  src = data.external_schema.sequelize.url
  dev = local.dev_url
  migration {
    dir = "file://migrations/${var.dialect}"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}
