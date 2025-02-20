# Local Development & Building for Deployment

During development, the application will run as HTTP Server.

When building for deployment, the application will built as [Standalone Application](https://docs.nestjs.com/standalone-applications).

This application will be deployed as a **AWS NodeJS Lambda** application fronted by AWS Gateway HTTP API.

# Database

For local development, you can run a Postgres container with either podman or docker compose:

If using docker, simply replace podman with docker.

```
# start the Postgres container
podman compose up -d

# connect to shell
PGPASSWORD=postgres podman compose exec -it db psql -U postgres postgres

# verify table 'menu' exists
\dt public.*

# execute queries
select * from menu;
```

If the table has not been created yet, run:

`pnpm migrate`

repeat the verification process.

# API Specifications

The `mm.postman.json.script` contains the test script that can be executed against the application immediately.
