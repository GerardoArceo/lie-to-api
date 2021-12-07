import mysql = require('mysql');
import { HOST_DB, PORT_DB, USER_DB, PASS_DB, DATABASE_NAME } from "../config/constants";

export default class MySQL {
    private static _instance: MySQL;
    
    cnn: mysql.Connection;

    constructor() {
        this.cnn = mysql.createConnection({
            host: HOST_DB,
            port: PORT_DB,
            user: USER_DB,
            password: PASS_DB,
            database: DATABASE_NAME,
        });
        this.cnn.connect((err: mysql.MysqlError) => {
            if (err) {
                console.log(err.message);
            }
        });
    }

    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    static executeSP(sp: string, args: any) {
        let values = args ? Object.values(args) : [];
        values = values.map(v => this.instance.cnn.escape(v));
        
        let completeQuery = `CALL ${sp}(${values});`;

        return new Promise<{ok: boolean, results: any}>((resolve, reject) => {
            this.instance.cnn.query(completeQuery, (error, results) => {
                if (error) {
                    console.log('💎 MySQL:', error.message, completeQuery);
                    resolve({ok: false, results: []});
                } else {
                    console.log('💎 MySQL:', 'OK', completeQuery);

                    if (results && results.length > 0) {
                        results = JSON.parse(JSON.stringify(results[0]));
                    }
                    resolve({ok: true, results});
                }
            });
        });
    }
}