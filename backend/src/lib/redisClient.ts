import { createClient } from 'redis';

// Cria a instância de conexão apontando para o seu Docker local
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Captura erros para o servidor não "capotar" se o Redis cair
redisClient.on('error', (err) => console.error('Erro no Redis Client:', err));

// Inicializa a conexão
redisClient.connect().catch(console.error);

export default redisClient;