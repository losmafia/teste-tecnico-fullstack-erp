"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../services/api"; // Ajuste o caminho de volta se a sua pasta services estiver em outro nível

interface Customer {
    id: string;
    name: string;
    document: string;
    email: string;
    status: string;
}

export default function ClientesPage() {
    // Estados visuais
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Estados de dados e permissão
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [userRole, setUserRole] = useState("");

    // Estados do formulário do Modal
    const [name, setName] = useState("");
    const [document, setDocument] = useState("");
    const [email, setEmail] = useState("");

    // Estados dos Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const router = useRouter();

    useEffect(() => {
        // Verifica quem está logado e pega a Role
        const userStr = localStorage.getItem("erp_user");
        if (!userStr) {
            router.push("/login");
            return;
        }
        setUserRole(JSON.parse(userStr).role);
    }, [router]);

    // Effect com Debounce para os filtros (inclusive chamando na montagem inicial)
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchCustomers();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, filterStatus]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append("name", searchTerm);
            if (filterStatus) params.append("status", filterStatus);

            const response = await api.get(`/customers?${params.toString()}`);
            setCustomers(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/customers", { name, document, email });
            // Limpa o form e fecha o modal
            setName("");
            setDocument("");
            setEmail("");
            setIsModalOpen(false);
            // Atualiza a tabela
            fetchCustomers();
        } catch (error: any) {
            alert(error.response?.data?.error || "Erro ao criar cliente");
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === "ATIVO" ? "INATIVO" : "ATIVO";
        try {
            await api.patch(`/customers/${id}/status`, { status: newStatus });
            fetchCustomers();
        } catch (error) {
            alert("Erro ao atualizar o status do cliente.");
        }
    };

    return (
        <div className="space-y-6 relative">
            {/* Cabeçalho e Botão de Ação */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>

                {/* REGRA DE NEGÓCIO VISUAL: Só ADMIN enxerga o botão */}
                {userRole === "ADMIN" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium shadow-sm"
                    >
                        + Novo Cliente
                    </button>
                )}
            </div>

            {/* Filtros de Busca */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
                <input
                    type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                    <option value="">Todos os Status</option>
                    <option value="ATIVO">Ativos</option>
                    <option value="INATIVO">Inativos</option>
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
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Carregando clientes...
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    Nenhum cliente cadastrado.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium">
                                        {customer.name}
                                        <div className="text-xs text-gray-400 font-normal">{customer.email}</div>
                                    </td>
                                    <td className="p-4">{customer.document}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${customer.status === "ATIVO"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}>
                                            {customer.status === "ATIVO" ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* REGRA DE NEGÓCIO VISUAL: Ação na tabela conforme o cargo */}
                                        {userRole === "ADMIN" ? (
                                            <button
                                                onClick={() => handleToggleStatus(customer.id, customer.status)}
                                                className={`font-medium transition-colors ${customer.status === "ATIVO"
                                                    ? "text-red-500 hover:text-red-700"
                                                    : "text-blue-500 hover:text-blue-700"
                                                    }`}
                                            >
                                                {customer.status === "ATIVO" ? "Inativar" : "Ativar"}
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 text-xs cursor-not-allowed bg-gray-100 px-2 py-1 rounded">
                                                Restrito
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
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

                        {/* Integração do form com a função de criar */}
                        <form onSubmit={handleCreateCustomer} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa / Cliente</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="Ex: Tech Solutions S.A"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Documento (CPF/CNPJ)</label>
                                <input
                                    type="text"
                                    value={document}
                                    onChange={(e) => setDocument(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    placeholder="00.000.000/0000-00"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Corporativo</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                                    type="submit"
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