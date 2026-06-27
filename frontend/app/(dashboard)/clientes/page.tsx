"use client";

import { useState } from "react";

export default function ClientesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6 relative">
            {/* Cabeçalho e Botão de Ação */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                >
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

            {/* Tabela de Clientes */}
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

            {/* Modal de Cadastro de Cliente */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Cadastrar Novo Cliente</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa / Cliente</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Tech Solutions S.A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento (CPF/CNPJ)</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="00.000.000/0000-00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="contato@empresa.com"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button" // Mudaremos para "submit" quando integrarmos a API
                                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                                >
                                    Salvar Cliente
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}