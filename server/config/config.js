// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3003;

// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 60 * 24 * 30;

// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ============================
//  Clave del recaptcha
// ============================
process.env.RECAPTCHA_KEY = process.env.RECAPTCHA_KEY || '6LeV13kUAAAAAMJKdUge2xb3IPzWiKY9JV_qF4KQ';

// ============================
//  Base de datos
// ============================
process.env.HOST_DB = process.env.HOST_DB || "localhost";
process.env.PORT_DB = process.env.NODE_ENV === 'dev' ? 3307 : 3306;
process.env.USER_DB = process.env.USER_DB || "root";
process.env.PASS_DB = process.env.PASS_DB || "Gutopia12$HxH$";