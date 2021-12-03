import cors from "cors";
import express from 'express';
import { PORT, NODE_ENV } from "./config/constants";

import api from './routes/api';
import diagnosis from './routes/diagnosis';

export const app = express();

app.use(api);
app.use(diagnosis);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => console.log(`🚀 Lie to API running on port: ${PORT} - ${NODE_ENV}`));