export default function ClientesPage() {
    return (
        <div className="space-y-6">

            {/* Cabeçalho e Botão de Ação */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm">
                    + Novo Cliente
                </button>
            </div>

            {/* Filtros de Busca */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos os Status</option>
                    <option value="ACTIVE">Ativos</option>
                    <option value="INACTIVE">Inativos</option>
                </select>
            </div>

            {/* Tabela de Clientes (Dados Estáticos para Visualização) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                            <th className="p-4 font-medium">Nome</th>
                            <th className="p-4 font-medium">Documento</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium">Empresa Alpha Ltda</td>
                            <td className="p-4">12.345.678/0001-90</td>
                            <td className="p-4 text-center">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Ativo</span>
                            </td>
                            <td className="p-4 text-right">
                                <button className="text-red-500 hover:text-red-700 font-medium transition-colors">
                                    Inativar
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}