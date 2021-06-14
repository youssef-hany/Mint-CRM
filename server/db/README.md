# Database Initialization

## Migrations/Seeds

### Creating new migrations/seed

```bash
npx knex migrate: make tbl_name
npx knex seed:make 01_task_name

```

### Apply existing migration/seed

```bash
npx knex migrate:latest
npx knex seed:run

```

### Rollback migration

```bash
npx knex migrate:rollback

```
