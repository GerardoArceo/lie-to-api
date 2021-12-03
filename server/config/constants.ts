export const TOKEN_SEED: string = process.env.TOKEN_SEED || 's3m1ll4_d3_d3s4rr0ll0';
export const TOKEN_LIFE_TIME = process.env.TOKEN_LIFE_TIME || 1000 * 60 * 60 * 24 * 90;
export const NODE_ENV = process.env.NODE_ENV || 'prod';
export const RECAPTCHA_KEY = process.env.RECAPTCHA_KEY || 'key';
export const PORT = 3003;

export const HOST_DB = process.env.HOST_DB = "127.0.0.1";
export const PORT_DB = NODE_ENV === 'dev' ? 3307 : 3306;
export const USER_DB = process.env.USER_DB || "root";
export const PASS_DB = process.env.PASS_DB || "Gutopia12$HxH$";
export const DATABASE_NAME = process.env.DATABASE_NAME || "lie_to_db";