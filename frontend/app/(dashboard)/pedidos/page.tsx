"use client";

import { useState } from "react";

export default function PedidosPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estado para controlar os itens do pedido dinamicamente
    const [items, setItems] = useState([
        { id: 1, descricao: "", quantidade: 1, valorUnitario: "" }
    ]);

    const adicionarItem = () => {
        setItems([...items, { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: "" }]);
    };

    const removerItem = (idParaRemover: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== idParaRemover));
        }
    };

    return (
        <div className="space-y-6 relative">

            {/* Cabeçalho e Botão de Ação */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                >
                    + Novo Pedido
                </button>
            </div>

            {/* Filtros de Busca */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos os Status</option>
                    <option value="DRAFT">Rascunho</option>
                    <option value="CONFIRMED">Confirmado</option>
                    <option value="CANCELLED">Cancelado</option>
                </select>
            </div>

            {/* Tabela de Pedidos (Visual) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 border-b text-sm">
                            <th className="p-4 font-medium">ID do Pedido</th>
                            <th className="p-4 font-medium">Cliente</th>
                            <th className="p-4 font-medium">Valor Total</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        <tr className="border-b hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-mono text-xs">#a1b2c3d4</td>
                            <td className="p-4 font-medium">Empresa Alpha Ltda</td>
                            <td className="p-4">R$ 1.250,00</td>
                            <td className="p-4 text-center">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Rascunho</span>
                            </td>
                            <td className="p-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                    Detalhes
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação de Pedido */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">

                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">Criar Novo Pedido</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form className="p-6 overflow-y-auto flex-1 space-y-6">

                            {/* Seleção de Cliente */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    required
                                >
                                    <option value="">Selecione um cliente...</option>
                                    <option value="1">Empresa Alpha Ltda</option>
                                </select>
                            </div>

                            {/* Seção de Itens Dinâmicos */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">Itens do Pedido</label>
                                    <button
                                        type="button"
                                        onClick={adicionarItem}
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={item.id} className="flex gap-3 items-start bg-gray-50 p-3 rounded-md border border-gray-200">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Descrição do item"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qtd"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="w-32">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    placeholder="Valor Un."
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removerItem(item.id)}
                                                    className="mt-1 text-red-500 hover:text-red-700 font-bold px-2 py-1"
                                                    title="Remover Item"
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </form>

                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                            >
                                Confirmar Pedido
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}