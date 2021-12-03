"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const constants_1 = require("./config/constants");
const api_1 = __importDefault(require("./routes/api"));
const diagnosis_1 = __importDefault(require("./routes/diagnosis"));
exports.app = (0, express_1.default)();
exports.app.use(api_1.default);
exports.app.use(diagnosis_1.default);
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.listen(constants_1.PORT, () => console.log(`🚀 Lie to API running on port: ${constants_1.PORT} - ${constants_1.NODE_ENV}`));
