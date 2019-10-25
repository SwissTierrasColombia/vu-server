import { Client } from 'pg';

export default class PGModel {

    static async createClient(dataConnection) {
        const client = new Client({
            host: dataConnection.host,
            port: dataConnection.port,
            database: dataConnection.database,
            user: dataConnection.username,
            password: dataConnection.password,
        });
        return client;
    }


}