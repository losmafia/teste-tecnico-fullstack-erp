"use client";

import { useState, useEffect } from "react";
import { api } from "../../../services/api";

interface Customer {
    id: string;
    name: string;
    status: string;
}

interface Order {
    id: string;
    customer: {
        name: string;
    };
    totalValue: number;
    status: string;
}

export default function PedidosPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
    
    // Filtros de busca
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // Estado para controlar os itens do pedido dinamicamente
    const [items, setItems] = useState([
        { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: "" }
    ]);

    useEffect(() => {
        const userStr = localStorage.getItem("erp_user");
        if (userStr) {
            setUserRole(JSON.parse(userStr).role);
        }
        fetchCustomers();
    }, []);

    // Effect dedicado apenas aos filtros (incluindo o carregamento inicial) com debounce
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, filterStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append("customerName", searchTerm);
            if (filterStatus) params.append("status", filterStatus);

            const response = await api.get(`/orders?${params.toString()}`);
            setOrders(response.data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get("/customers");
            // Regra de Negócio: Exibe apenas clientes ATIVOS para a criação de novos pedidos
            const ativos = response.data.filter((c: Customer) => c.status === "ATIVO");
            setCustomers(ativos);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    const adicionarItem = () => {
        setItems([...items, { id: Date.now(), descricao: "", quantidade: 1, valorUnitario: "" }]);
    };

    const removerItem = (idParaRemover: number) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== idParaRemover));
        }
    };

    // Atualiza os inputs individuais da lista de itens
    const handleItemChange = (id: number, field: string, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleConfirmOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedCustomerId) {
            alert("Por favor, selecione um cliente.");
            return;
        }

        try {
            await api.post("/orders", {
                customerId: selectedCustomerId,
                items: items.map(i => ({
                    description: i.descricao,
                    quantity: Number(i.quantidade),
                    unitPrice: Number(i.valorUnitario)
                }))
            });

            // Reseta estados e atualiza listagem
            setIsModalOpen(false);
            setSelectedCustomerId("");
            setItems([{ id: Date.now(), descricao: "", quantidade: 1, valorUnitario: "" }]);
            fetchOrders();
        } catch (error: any) {
            alert(error.response?.data?.error || "Erro ao processar o pedido.");
        }
    };

    const openDetailsModal = async (orderId: string) => {
        try {
            const response = await api.get(`/orders/${orderId}`);
            setSelectedOrderDetails(response.data);
            setIsDetailsModalOpen(true);
        } catch (error) {
            alert("Erro ao buscar detalhes do pedido.");
        }
    };

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status });
            setIsDetailsModalOpen(false);
            fetchOrders();
        } catch (error: any) {
            alert(error.response?.data?.error || "Erro ao atualizar status.");
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Tem certeza que deseja deletar este pedido? Esta ação não pode ser desfeita.")) return;
        try {
            await api.delete(`/orders/${orderId}`);
            setIsDetailsModalOpen(false);
            fetchOrders();
        } catch (error: any) {
            alert(error.response?.data?.error || "Erro ao deletar pedido.");
        }
    };

    return (
        <div className="space-y-6 relative transition-colors">

            {/* Cabeçalho e Botão de Ação */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pedidos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                >
                    + Novo Pedido
                </button>
            </div>

            {/* Filtros de Busca */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 flex gap-4 transition-colors">
                <input
                    type="text"
                    placeholder="Buscar por cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 transition-colors"
                >
                    <option value="" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Todos os Status</option>
                    <option value="DRAFT" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Rascunho</option>
                    <option value="CONFIRMED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Confirmado</option>
                    <option value="CANCELLED" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Cancelado</option>
                </select>
            </div>

            {/* Tabela de Pedidos Dinâmica */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-b dark:border-slate-700 text-sm transition-colors">
                            <th className="p-4 font-medium">ID do Pedido</th>
                            <th className="p-4 font-medium">Cliente</th>
                            <th className="p-4 font-medium">Valor Total</th>
                            <th className="p-4 font-medium text-center">Status</th>
                            <th className="p-4 font-medium text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700 dark:text-gray-300">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    Carregando histórico de pedidos...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">
                                    Nenhum pedido encontrado.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-gray-500 dark:text-gray-400">#{order.id.substring(0, 8)}</td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{order.customer?.name}</td>
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                                        R$ {order.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "DRAFT"
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                            : order.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                            {order.status === "DRAFT" ? "Rascunho" : order.status === "CONFIRMED" ? "Confirmado" : "Cancelado"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => openDetailsModal(order.id)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Criação de Pedido */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-slate-700">

                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Criar Novo Pedido</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Adicionado ID para vincular ao botão do rodapé */}
                        <form id="pedido-form" onSubmit={handleConfirmOrder} className="p-6 overflow-y-auto flex-1 space-y-6">

                            {/* Seleção de Cliente Dinâmica */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
                                <select
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 transition-colors"
                                    required
                                >
                                    <option value="" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Selecione um cliente ativo...</option>
                                    {customers.map((cliente) => (
                                        <option key={cliente.id} value={cliente.id} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">
                                            {cliente.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Seção de Itens Dinâmicos */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Itens do Pedido</label>
                                    <button
                                        type="button"
                                        onClick={adicionarItem}
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                    >
                                        + Adicionar Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-3 items-start bg-gray-50 dark:bg-slate-700/30 p-3 rounded-md border border-gray-200 dark:border-slate-600 transition-colors">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={item.descricao}
                                                    onChange={(e) => handleItemChange(item.id, "descricao", e.target.value)}
                                                    placeholder="Descrição do item"
                                                    className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantidade}
                                                    onChange={(e) => handleItemChange(item.id, "quantidade", Number(e.target.value))}
                                                    placeholder="Qtd"
                                                    className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="w-32">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={item.valorUnitario}
                                                    onChange={(e) => handleItemChange(item.id, "valorUnitario", e.target.value)}
                                                    placeholder="Valor Un."
                                                    className="w-full bg-transparent border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
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

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-800/80 transition-colors">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="pedido-form"
                                className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            >
                                Confirmar Pedido
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal de Detalhes do Pedido */}
            {isDetailsModalOpen && selectedOrderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-gray-100 dark:border-slate-700">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-800/80 transition-colors">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Pedido #{selectedOrderDetails.id.substring(0, 8)}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente: <span className="font-medium text-gray-700 dark:text-gray-200">{selectedOrderDetails.customer.name}</span></p>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold p-2 transition-colors"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b dark:border-slate-700 pb-2">Itens do Pedido</h3>
                            <div className="space-y-2 mb-6">
                                {selectedOrderDetails.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-gray-50 dark:bg-slate-700/30 rounded border border-gray-100 dark:border-slate-600 transition-colors">
                                        <span className="font-medium text-gray-700 dark:text-gray-200">{item.description}</span>
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {item.quantity}x R$ {item.unitValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} = <strong className="text-gray-800 dark:text-gray-100">R$ {item.subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong>
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end text-lg font-bold text-gray-800 dark:text-gray-100">
                                Total: <span className="text-blue-600 dark:text-blue-400 ml-2">R$ {selectedOrderDetails.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex justify-between bg-gray-50 dark:bg-slate-800/80 items-center transition-colors">
                            <div>
                                {/* Ações restritas ao ADMIN e para pedidos DRAFT */}
                                {userRole === 'ADMIN' && selectedOrderDetails.status === 'DRAFT' && (
                                    <button
                                        onClick={() => handleDeleteOrder(selectedOrderDetails.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm transition-colors"
                                    >
                                        Deletar Pedido
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {userRole === 'ADMIN' && selectedOrderDetails.status === 'DRAFT' && (
                                    <>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'CANCELLED')}
                                            className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium text-sm shadow-sm"
                                        >
                                            Cancelar Pedido
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'CONFIRMED')}
                                            className="px-4 py-2 text-white bg-green-600 dark:bg-green-600 rounded-md hover:bg-green-700 dark:hover:bg-green-700 transition-colors font-medium text-sm shadow-sm"
                                        >
                                            Confirmar Pedido
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium text-sm ml-2 shadow-sm"
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}