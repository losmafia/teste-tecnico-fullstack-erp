import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();

// Middlewares essenciais
app.use(cors());
app.use(express.json()); // Permite que o servidor entenda JSON no body da requisição

// Registro das rotas
app.use('/api/auth', authRoutes);

// Definição da porta
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});