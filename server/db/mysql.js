"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const constants_1 = require("../config/constants");
class MySQL {
    constructor() {
        this.cnn = mysql.createConnection({
            host: constants_1.HOST_DB,
            port: constants_1.PORT_DB,
            user: constants_1.USER_DB,
            password: constants_1.PASS_DB,
            database: constants_1.DATABASE_NAME,
        });
        this.cnn.connect((err) => {
            if (err) {
                console.log(err.message);
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    static executeSP(sp, args) {
        let values = args ? Object.values(args) : [];
        values = values.map(v => this.instance.cnn.escape(v));
        let completeQuery = `CALL ${sp}(${values});`;
        return new Promise((resolve, reject) => {
            this.instance.cnn.query(completeQuery, (error, results) => {
                if (error) {
                    console.log('mysql', error.message, completeQuery);
                    resolve({ ok: false, results: [] });
                }
                else {
                    console.log('mysql', 'OK', completeQuery);
                    if (results && results.length > 0) {
                        results = JSON.parse(JSON.stringify(results[0]));
                    }
                    resolve({ ok: true, results });
                }
            });
        });
    }
}
exports.default = MySQL;
