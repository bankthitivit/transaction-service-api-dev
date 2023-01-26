import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config = () => {
  return{
    type: process.env.PGTYPE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  } as TypeOrmModuleOptions
}