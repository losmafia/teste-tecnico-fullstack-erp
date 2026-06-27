import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona o acesso da raiz (/) diretamente para a tela de autenticação
  redirect('/login');
}