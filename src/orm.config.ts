import { combine } from 'format';
import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmTXNConfigService implements TypeOrmOptionsFactory {

    // //dev
    createTypeOrmOptions(): TypeOrmModuleOptions {
        let config_db
        if (process.env.RUNTIME_Transaction_Dev && process.env.ENVIRONMENT === 'development') {
            const Transaction_userData = JSON.parse(process.env.RUNTIME_Transaction_Dev)
            const Transaction_userData_replica = JSON.parse(process.env.RUNTIME_Transaction_Replica_Dev)
            config_db = {
                name: 'default',
                type: 'postgres',
                synchronize: false,
                logging: false,
                keepConnectionAlive: false,
                entities: [__dirname + '/Database/Transaction/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                replication: {
                    master: {
                        host: Transaction_userData.PGHOST || '',
                        port: +Transaction_userData.PGPORT || 25432,
                        database: Transaction_userData.PGDATABASE || '',
                        username: Transaction_userData.PGUSER || '',
                        password: Transaction_userData.PGPASS || '',
                    },
                    slaves: [
                        {
                            host: Transaction_userData_replica.PGHOST || '',
                            port: +Transaction_userData_replica.PGPORT || 25432,
                            database: Transaction_userData_replica.PGDATABASE || '',
                            username: Transaction_userData_replica.PGUSER || '',
                            password: Transaction_userData_replica.PGPASS || '',
                        }
                    ]
                }
            }
            return config_db
        }

        if (process.env.RUNTIME_Transaction_Test && process.env.ENVIRONMENT === 'test') {
            const userData = JSON.parse(process.env.RUNTIME_Transaction_Test)
            return {
                name: 'default',
                type: 'postgres',
                host: userData.PGHOST || '',
                port: +userData.PGPORT || 5432,
                database: userData.PGDATABASE || '',
                username: userData.PGUSER || '',
                password: userData.PGPASS || '',
                synchronize: false,
                logging: false,
                keepConnectionAlive: false,
                entities: [__dirname + '/Database/Transaction/*.entity{.ts,.js}'],
                autoLoadEntities: true,
            }
        }


        return {}

    }
}


// export class TypeOrmTXNReplicaConfigService implements TypeOrmOptionsFactory {

//     //dev
//     createTypeOrmOptions(): TypeOrmModuleOptions {

//         if (process.env.RUNTIME_Transaction_Replica_Dev && process.env.ENVIRONMENT === 'development') {

//             const userData = JSON.parse(process.env.RUNTIME_Transaction_Replica_Dev)
//             return {
//                 name: 'default',
//                 type: 'postgres',
//                 host: userData.PGHOST || '',
//                 port: +userData.PGPORT || 25432,
//                 database: userData.PGDATABASE || '',
//                 username: userData.PGUSER || '',
//                 password: userData.PGPASS || '',
//                 synchronize: false,
//                 logging: false,
//                 keepConnectionAlive: false,
//                 entities: [__dirname + '/Database/Transaction/*.entity{.ts,.js}'],
//                 autoLoadEntities: true,
//             }
//         }

//         if (process.env.RUNTIME_Transaction_Replica_Test && process.env.ENVIRONMENT === 'test') {
//             const userData = JSON.parse(process.env.RUNTIME_Transaction_Replica_Test)
//             return {
//                 name: 'default',
//                 type: 'postgres',
//                 host: userData.PGHOST || '',
//                 port: +userData.PGPORT || 5432,
//                 database: userData.PGDATABASE || '',
//                 username: userData.PGUSER || '',
//                 password: userData.PGPASS || '',
//                 synchronize: false,
//                 logging: false,
//                 keepConnectionAlive: false,
//                 entities: [__dirname + '/Database/Transaction/*.entity{.ts,.js}'],
//                 autoLoadEntities: true,
//             }
//         }
//         return {}

//     }
// }

export class TypeOrmMMSConfigService implements TypeOrmOptionsFactory {
    // dev
    createTypeOrmOptions(): TypeOrmModuleOptions {
        let config_db

        if (process.env.RUNTIME_MMS_Dev && process.env.ENVIRONMENT === 'development') {
            const Mms_userData = JSON.parse(process.env.RUNTIME_MMS_Dev)
            const Mms_userData_replica = JSON.parse(process.env.RUNTIME_MMS_Replica_Dev)

            config_db = {
                type: 'postgres',
                synchronize: false,
                logging: false,
                keepConnectionAlive: false,
                entities: [__dirname + '/Database/MMS_Entity/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                replication: {
                    master: {
                        host: Mms_userData.PGHOST || '',
                        port: +Mms_userData.PGPORT || 25432,
                        database: Mms_userData.PGDATABASE || '',
                        username: Mms_userData.PGUSER || '',
                        password: Mms_userData.PGPASS || '',
                    },
                    slaves: [
                        {
                            host: Mms_userData_replica.PGHOST || '',
                            port: +Mms_userData_replica.PGPORT || 25432,
                            database: Mms_userData_replica.PGDATABASE || '',
                            username: Mms_userData_replica.PGUSER || '',
                            password: Mms_userData_replica.PGPASS || '',
                        }
                    ]
                }
            }
            return config_db
        }
        //else 

        if (process.env.RUNTIME_MMS_Test && process.env.ENVIRONMENT === 'test') {
            const userData = JSON.parse(process.env.RUNTIME_MMS_Test)
            return {
                type: 'postgres',
                host: userData.PGHOST || '',
                port: +userData.PGPORT || 25432,
                database: userData.PGDATABASE || '',
                username: userData.PGUSER || '',
                password: userData.PGPASS || '',
                synchronize: false,
                logging: false,
                keepConnectionAlive: false,
                entities: [__dirname + '/Database/MMS_Entity/*.entity{.ts,.js}'],
                autoLoadEntities: true,
            }
        }
        return {}


        // return {}
    }


}

// export class TypeOrmMMSReplicaConfigService implements TypeOrmOptionsFactory {
//     // dev
//     createTypeOrmOptions(): TypeOrmModuleOptions {
//         console.log(process.env.ENVIRONMENT, process.env.ENVIRONMENT === 'development', process.env.ENVIRONMENT === 'test')

//         if (process.env.RUNTIME_MMS_Replica_Dev && process.env.ENVIRONMENT === 'development') {
//             const userData = JSON.parse(process.env.RUNTIME_MMS_Replica_Dev)
//             return {
//                 type: 'postgres',
//                 host: userData.PGHOST || '',
//                 port: +userData.PGPORT || 25432,
//                 database: userData.PGDATABASE || '',
//                 username: userData.PGUSER || '',
//                 password: userData.PGPASS || '',
//                 synchronize: false,
//                 logging: false,
//                 keepConnectionAlive: false,
//                 entities: [__dirname + '/Database/MMS_Entity/*.entity{.ts,.js}'],
//                 autoLoadEntities: true,
//             }
//         }
//         //else

//         if (process.env.RUNTIME_MMS_Replica_Test && process.env.ENVIRONMENT === 'test') {
//             const userData = JSON.parse(process.env.RUNTIME_MMS_Replica_Test)
//             return {
//                 type: 'postgres',
//                 host: userData.PGHOST || '',
//                 port: +userData.PGPORT || 25432,
//                 database: userData.PGDATABASE || '',
//                 username: userData.PGUSER || '',
//                 password: userData.PGPASS || '',
//                 synchronize: false,
//                 logging: false,
//                 keepConnectionAlive: false,
//                 entities: [__dirname + '/Database/MMS_Entity/*.entity{.ts,.js}'],
//                 autoLoadEntities: true,
//             }
//         }
//         return {}


//         // return {}
//     }


// }
