const getQuery = (action, p) => {
    let texto_db;
    let texto_ok;
    let permisos = [];

    try {
        switch (action) {

            case 'save_user':
                query = `call save_diagnosis(${p.nickname},${p.google_id},${p.email},${p.pass});`;
                break;
            case 'save_diagnosis':
                query = `call save_diagnosis(${p.user_id},${p.created_date},${p.final_result},${p.eye_movement_result},${p.voice_signal_result},${p.bpm_result},${p.hit_probability});`;
                break;
            case 'save_user_baseline_variables':
                query = `call save_user_baseline_variables(${p.user_id},${p.bpm},${p.eye_movement},${p.voice_signal});`;
                break;
            case 'get_user_baseline_variables':
                query = `SELECT * FROM user_baseline_variables WHERE user_id = ${p.user_id};`;
                break;
            case 'get_user_diagnosis':
                query = `SELECT * FROM diagnosis WHERE user_id = ${p.user_id};`;
                break;
            case 'get_user':
                query = `SELECT * FROM users WHERE user_id = ${p.user_id};`;
                break;

             //FUNCIÓN DESCONOCIDA
            default:
                query = null;
                texto_db = `Operación desconocida en la base de datos`;
        }
    } catch (Exception) {
        console.error(Exception);
    }
    return { query, texto_db, texto_ok };
};

module.exports = getQuery;