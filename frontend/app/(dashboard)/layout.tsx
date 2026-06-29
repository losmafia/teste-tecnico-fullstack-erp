"use client"; // Adicionado porque agora lidamos com cliques e localStorage

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    // Lógica que destrói a sessão no navegador e avisa a API
    const handleLogout = async () => {
        try {
            // Cumprindo o requisito obrigatório do teste (POST /api/auth/logout)
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Erro na API durante o logout", error);
        }
        localStorage.removeItem("erp_token");
        localStorage.removeItem("erp_user");
        router.push("/login");
    };

    return (
        <div className="flex h-screen bg-gray-50">

            {/* Barra Lateral */}
            <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
                <h2 className="text-2xl font-bold text-blue-400 mb-8">ERP System</h2>

                <nav className="flex-1 space-y-4">
                    <Link href="/clientes" className="block text-gray-300 hover:text-white transition">
                        👥 Clientes
                    </Link>
                    <Link href="/pedidos" className="block text-gray-300 hover:text-white transition">
                        📦 Pedidos
                    </Link>
                </nav>

                {/* Botão de Logout Visível na base do menu */}
                <div className="mt-auto pt-6 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex justify-center py-2.5 px-4 text-slate-300 hover:text-white hover:bg-white/10 bg-white/5 rounded-lg transition-colors font-medium shadow-sm border border-white/10"
                    >
                        Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Área Principal */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b p-4">
                    <h1 className="text-gray-700 font-semibold">Painel de Controle</h1>
                </header>

                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
            </main>

        </div>
    );
}