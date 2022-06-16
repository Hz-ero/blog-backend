import * as path from 'path'
import dotenv from 'dotenv'
import { Collection, Db, MongoClient, OptionalId } from 'mongodb';
import { Logger } from 'tsrpc-proto';
import { DbPost } from './dbs';

// 根据不同环境变量加载配置文件
switch (process.env.NODE_ENV) {
    case 'production':
        dotenv.config({ path: path.resolve(__dirname, '../../env/.env.production') })
        break;
    default:
        dotenv.config({ path: path.resolve(__dirname, '../../env/.env.development') })
        break;
}

// mongodb: database connect string
let connect_string: string | undefined = process.env.DB_CONNECT_STRING
if (typeof connect_string === 'undefined') {
    throw new Error("DB_CONNECT_STRING is not defined in env file")
}

export class MongoDB {
    static db: Db;

    static async init(logger?: Logger) {
        this.db = await this._getMongoDB(connect_string as string, logger);
    }

    private static _getMongoDB(uri: string, logger?: Logger): Promise<Db> {
        logger?.log(`connect to mongodb: ${uri}`);
        let promise = new Promise<Db>((resolve, reject) => {
            MongoClient.connect(uri, (err, client) => {
                if (err) {
                    logger?.error("Failed connect db.", err);
                    reject(err)
                } else if (client) {
                    logger?.log(`Connected db successfully.(${uri})`);
                    resolve(client.db())
                }
            })
        })
        return promise;
    }

    static collection<T extends keyof DbCollectionType>(col: T): Collection<OptionalId<DbCollectionType[T]>> {
        return this.db.collection(col);
    }
}

export interface DbCollectionType {
    Post: DbPost
}