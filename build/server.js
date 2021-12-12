"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const constants_1 = require("./config/constants");
const user_1 = __importDefault(require("./routes/user"));
const diagnosis_1 = __importDefault(require("./routes/diagnosis"));
const files_1 = require("./utils/files");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(user_1.default);
exports.app.use(diagnosis_1.default);
exports.app.listen(constants_1.PORT, () => console.log(`🚀 Lie to API running on port: ${constants_1.PORT} - ${constants_1.NODE_ENV} - OSX_ENV: ${constants_1.OSX_ENV}`));
(0, files_1.createRequiredFolders)();
exports.app.get('/', (req, res) => {
    const data = {
        app: 'Lie to Api',
        nombre: 'Gerardo Arceo',
        mensaje: 'Sé feliz :)'
    };
    console.log(data);
    res.json(data);
});
