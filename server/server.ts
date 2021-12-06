import cors from "cors";
import express from 'express';
import { PORT, NODE_ENV } from "./config/constants";

import user from './routes/user';
import diagnosis from './routes/diagnosis';
import { createRequiredFolders, deleteAllData } from "./utils/files";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(user);
app.use(diagnosis);

app.listen(PORT, () => console.log(`🚀 Lie to API running on port: ${PORT} - ${NODE_ENV}`));

// deleteAllData()
createRequiredFolders()

app.get('/', (req, res) => {
    const data = {
        app: 'Lie to Api',
        nombre: 'Gerardo Arceo',
        mensaje: 'Sé feliz :)'
    };
    console.log(data);
    res.json(data);
});
