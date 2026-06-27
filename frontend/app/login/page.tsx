import Image from 'next/image';
import Link from 'next/link';

// Componente principal da Tela de Login
// Responsável pela renderização da interface de autenticação do usuário.
// Futuramente, as chamadas para a API (ex: POST /api/auth/login) serão feitas a partir deste formulário.
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden text-slate-900">
      
      {/* Efeitos decorativos de fundo (UI Premium) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

      <header className="w-full px-8 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </header>

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
              Estamos felizes em vê-lo novamente! Insira suas credenciais para entrar.
            </p>
          </div>

          <form className="space-y-4">
            {/* Aqui será feita a coleta de dados e integração com as tabelas de usuários do banco (via endpoint) para validação de acesso */}
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-slate-700 mb-1">
                Usuário / Email
              </label>
              <input
                type="text"
                id="username"
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 text-sm transition-all placeholder:text-slate-400 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Endereço de e-mail"
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
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-slate-900 text-sm transition-all placeholder:text-slate-400 hover:bg-white focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <div className="flex items-center pt-1">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-colors"
              />
              <label htmlFor="remember_me" className="ml-2 block text-xs text-slate-600">
                Mantenha-me conectado.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-orange-500 shadow-md hover:shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Entrar
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="w-full px-8 py-4 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-xs font-medium relative z-10">
        <p className="mb-4 sm:mb-0">© 2026 Matheus Ribeiro</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-blue-500 transition-colors">
            <span className="sr-only">LinkedIn</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </Link>
          <Link href="#" className="hover:text-slate-800 transition-colors">
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