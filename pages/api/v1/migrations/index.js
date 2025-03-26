import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  try {
    switch (request.method) {
      case "GET":
        const pendingMigrations = await migrationRunner(
          defaultMigrationOptions,
        );
        response.status(200).json(pendingMigrations);
        break;

      case "POST":
        const migratedMigrations = await migrationRunner({
          ...defaultMigrationOptions,
          dryRun: false,
        });

        if (migratedMigrations.length > 0) {
          response.status(201).json(migratedMigrations);
        } else {
          response.status(200).json(migratedMigrations);
        }
        break;

      default:
        response.status(405).end();
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
