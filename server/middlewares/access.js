//REQUIREDS
const jwt = require('jsonwebtoken');

// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {
    let token = req.body.token || req.query.token; //Recibe token de POST o GET
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (!err) {
            req.access = decoded.access;
            req.id = decoded.id;
        }
        next();
    });
};

// =====================
// Permite acceso a las apps externas
// =====================
let CORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, HEAD');
    next();
};

module.exports = {
    verificaToken,
    CORS
}