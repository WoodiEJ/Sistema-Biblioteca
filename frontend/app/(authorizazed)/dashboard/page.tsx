'use client'
import { CarouselComponent } from "@/components/carrousel";
import { ChartArea } from "@/components/areaChart";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Library, Search } from "lucide-react";

export default function Home() {
  const { usuario } = useAuth()
  const { livros, emprestimos, usuarios } = useData()
  const router = useRouter()

  const meusEmprestimos = emprestimos.filter(e => e.usuario_id === usuario?.id)
  const livrosAtivos = meusEmprestimos.filter(e => e.ativo)
  const livrosDevolvidos = meusEmprestimos.filter(e => !e.ativo)

  return (
    <div className="p-8 flex flex-col gap-8">
      {usuario?.role === 'ADMIN' && (
        <>
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Painel Administrativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>Usuários Cadastrados</CardDescription>
                  <CardTitle className="text-4xl">{usuarios.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Livros Disponíveis</CardDescription>
                  <CardTitle className="text-4xl">{livros.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Empréstimos Ativos</CardDescription>
                  <CardTitle className="text-4xl text-zinc-900">
                    {emprestimos.filter(e => e.ativo).length}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Empréstimos por Período</h2>
            <ChartArea />
          </div>
        </>
      )}

      {usuario?.role !== 'ADMIN' && (
        <>
          <div>
            <h2 className="text-xl font-bold mb-4 text-zinc-900">Minha Estante</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm bg-zinc-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardDescription className="text-zinc-600 font-medium">Livros Lidos</CardDescription>
                    <BookOpen className="h-4 w-4 text-zinc-400" />
                  </div>
                  <CardTitle className="text-4xl text-zinc-900">{livrosDevolvidos.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-none shadow-sm bg-zinc-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardDescription className="text-zinc-300 font-medium">Em Mãos</CardDescription>
                    <Library className="h-4 w-4 text-zinc-500" />
                  </div>
                  <CardTitle className="text-4xl text-white">{livrosAtivos.length}</CardTitle>
                </CardHeader>
              </Card>

              <Card className={`border-none shadow-sm ${livrosAtivos.length > 0 ? 'bg-amber-50' : 'bg-zinc-50'}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardDescription className={`${livrosAtivos.length > 0 ? 'text-amber-600' : 'text-zinc-500'} font-medium`}>
                      Prazo Mais Próximo
                    </CardDescription>
                    <Calendar className={`h-4 w-4 ${livrosAtivos.length > 0 ? 'text-amber-400' : 'text-zinc-400'}`} />
                  </div>
                  <CardTitle className={`text-xl ${livrosAtivos.length > 0 ? 'text-amber-900' : 'text-zinc-900'}`}>
                    {livrosAtivos.length > 0 
                      ? new Date(livrosAtivos[0].data_fim).toLocaleDateString('pt-BR')
                      : "Nenhum prazo"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-zinc-900">Livros Populares</h2>
            {livros.length > 0 ? (
              <CarouselComponent />
            ) : (
              <Card className="border-none bg-zinc-50">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 py-8">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <Search className="h-6 w-6 text-zinc-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-zinc-900">Nenhum livro disponível</CardTitle>
                    <CardDescription>A biblioteca está sendo atualizada, volte mais tarde.</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
          <div className="p-6 bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-900 flex justify-between items-center transition-all">
              <div>
                  <h3 className="font-bold text-lg">Procurando algo específico?</h3>
                  <p className="text-zinc-500 text-sm">Explore nosso catálogo completo de títulos.</p>
              </div>
              <button 
                onClick={() => router.push('/livro')} 
                className="bg-zinc-900 text-white hover:bg-zinc-800 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                  Ver Catálogo
              </button>
          </div>
          <div className="p-6 bg-zinc-900 rounded-xl text-white flex justify-between items-center transition-all shadow-md">
              <div>
                  <h3 className="font-bold text-lg">Minhas Reservas</h3>
                  <p className="text-zinc-400 text-sm">Gerencie seus empréstimos e prazos.</p>
              </div>
              <button 
                onClick={() => router.push('/reservar')} 
                className="bg-white text-zinc-900 hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                  Ir para Reservas
              </button>
          </div>
      </div>
    </div>
  );
}