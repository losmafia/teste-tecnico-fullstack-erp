import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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

                <Link href="/login" className="text-red-400 hover:text-red-300 mt-auto transition">
                    Sair
                </Link>
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