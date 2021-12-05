"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("../db/mysql"));
const app = (0, express_1.default)();
app.post('/saveUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    const args = {
        google_id: body.uid,
        email: body.email,
        nickname: body.nickname,
    };
    const ok = (yield mysql_1.default.executeSP('save_user', args)).ok;
    res.json({ ok });
}));
app.get('/getUserBaselineVariables', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.query.uid;
    const result = (yield mysql_1.default.executeSP('get_user_baseline_variables', { uid })).results;
    res.json(result);
}));
app.get('/get_user_diagnosis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uid = req.query.uid;
    const result = (yield mysql_1.default.executeSP('get_user_diagnosis', { uid })).results;
    res.json(result);
}));
exports.default = app;
