import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Criar o usuário Administrador
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: '123', // Senha simples em texto puro (aceitável para o escopo deste teste)
            role: 'ADMIN',
        },
    })

    // Criar o usuário Operador
    await prisma.user.upsert({
        where: { username: 'operador' },
        update: {},
        create: {
            username: 'operador',
            password: '123',
            role: 'OPERATOR',
        },
    })

    console.log('✅ Seed de usuários executado com sucesso!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })