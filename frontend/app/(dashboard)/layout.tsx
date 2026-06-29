"use client"; // Adicionado porque agora lidamos com cliques e localStorage

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-hidden">

            {/* Barra Lateral Expansível */}
            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} relative transition-all duration-300 bg-white dark:bg-slate-950 text-gray-800 dark:text-white p-4 flex flex-col border-r border-gray-200 dark:border-slate-800 z-10`}>

                {/* Botão de Colapsar (posicionado na borda) */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-8 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-orange-600 focus:outline-none transition-transform z-20"
                    title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
                >
                    <span className="text-xs leading-none">{isCollapsed ? '▶' : '◀'}</span>
                </button>

                <div className="mb-8 mt-2 flex items-center h-16 w-full bg-gray-100 dark:bg-slate-900/50 p-2 rounded-xl border border-gray-200 dark:border-slate-800 transition-all duration-300">
                    {!isCollapsed ? (
                        <div className="flex items-center gap-3 w-full overflow-hidden">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-white dark:border-slate-700">
                                <Image
                                    src="/riopae.jpg"
                                    alt="RioPae Logo"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-center overflow-hidden">
                                <h2 className="text-base font-black text-slate-800 dark:text-white leading-tight tracking-wide">
                                    RIO<span className="text-orange-500">PAE</span>
                                </h2>
                                <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Painel</span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0 mx-auto border border-white dark:border-slate-700 transition-all duration-300">
                            <Image
                                src="/riopae.jpg"
                                alt="RioPae Logo"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <nav className="flex-1 space-y-4 w-full">
                    <Link href="/clientes" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-slate-800/50 ${isCollapsed ? 'justify-center text-2xl py-2' : 'gap-3 px-3 py-2 text-base'}`} title="Clientes">
                        <span>👥</span>
                        {!isCollapsed && <span>Clientes</span>}
                    </Link>
                    <Link href="/pedidos" className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-slate-800/50 ${isCollapsed ? 'justify-center text-2xl py-2' : 'gap-3 px-3 py-2 text-base'}`} title="Pedidos">
                        <span>📦</span>
                        {!isCollapsed && <span>Pedidos</span>}
                    </Link>
                </nav>

                {/* Botão de Logout */}
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-slate-800 w-full">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center justify-center text-gray-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium border border-transparent hover:border-red-200 dark:hover:border-red-500/50 ${isCollapsed ? 'py-2 text-xl' : 'py-2.5 px-4 gap-2 text-sm shadow-sm'}`}
                        title="Sair do Sistema"
                    >
                        {isCollapsed ? (
                            <span>🚪</span>
                        ) : (
                            <>
                                <span>🚪</span>
                                <span>Sair do Sistema</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Área Principal */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center transition-colors">
                    <h1 className="text-gray-700 dark:text-gray-200 font-semibold">Painel de Controle</h1>

                    {/* Theme Toggle Button */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
                            aria-label="Alternar tema"
                        >
                            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
                        </button>
                    )}
                </header>

                <div className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-slate-900 transition-colors">
                    {children}
                </div>
            </main>

        </div>
    );
}