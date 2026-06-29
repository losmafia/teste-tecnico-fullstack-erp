"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { api } from "../../services/api";

export default function LoginPage() {
  const router = useRouter();

  // Estados de controle do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Função que dispara ao clicar em "Entrar"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username,
        password
      });

      const { token, user } = response.data;

      localStorage.setItem("erp_token", token);
      localStorage.setItem("erp_user", JSON.stringify(user));

      router.push("/clientes");

    } catch (error: any) {
      const mensagemBackend = error.response?.data?.error || "Erro de comunicação com o servidor.";
      setErro(mensagemBackend);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden text-slate-900">

      {/* Efeitos decorativos de fundo (UI Premium) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />



      <main className="flex-1 flex items-center justify-center p-4 relative z-10 min-h-0">
        <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 border border-white">

          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
                <Image
                  src="/riopae.jpg"
                  alt="RioPae Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Acesse sua conta</h1>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed">
              Insira suas credenciais para entrar.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Bloco de Erro Renderizado Condicionalmente */}
            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
                {erro}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-700 mb-1">
                Usuário / Email
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 text-sm transition-all placeholder:text-slate-400 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Usuario ou Endereço de e-mail"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 text-sm transition-all placeholder:text-slate-400 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-orange-500 shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full px-8 py-4 grid grid-cols-1 sm:grid-cols-3 items-center text-slate-400 text-xs font-medium relative z-10 gap-4 sm:gap-0">
        <div className="hidden sm:block"></div>
        <p className="text-center">© 2026 Matheus Rocha Ribeiro © - RIOPAE</p>
        <div className="flex items-center justify-center sm:justify-end gap-4">

          <Link href="https://github.com/losmafia/teste-tecnico-fullstack-erp/" className="hover:text-slate-800 transition-colors">
            <span className="sr-only">GitHub</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}