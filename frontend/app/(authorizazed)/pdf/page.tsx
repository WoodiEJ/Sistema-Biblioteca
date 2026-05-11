'use client'

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import { toast } from "sonner";

export default function GerarPDF() {
    const {emprestimos} = useData()
    const {usuario} = useAuth()

    function gerarPDF() {
        const documento = new jsPDF()

        documento.setFontSize(18)
        documento.text("Histórico de Reservas", 14, 20)
        documento.setFontSize(10)
        documento.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28)

        const linhas = emprestimos.map(e => [
            e.id,
            e.usuario_id,
            e.livro.titulo ?? e.livro_id,
            e.ativo ? 'Ativo' : 'Finalizado',
            new Date(e.data_comeco).toLocaleDateString('pt-BR'),
            new Date(e.data_fim).toLocaleDateString('pt-BR'),
            e.volta ? new Date(e.volta).toLocaleDateString('pt-BR') : 'Não devolvido'
        ])

        autoTable(documento, {
            startY: 35,
            head: [['ID', 'Usuário', 'Livro', 'Status', 'Início', 'Devolução', 'Devolvido em']],
            body: linhas
        })

        documento.save('historico-reservas.pdf')
        toast.success('PDF Gerado.')
    }

    function confirmar() {
        toast.warning("Confirme a geração do PDF.", {
            action: {
                label: "Confirmar",
                onClick: () => gerarPDF()
            }, 
            cancel: {
                label: "Cancelar",
                onClick: () => {}
            }
        })
    }

    return (
        <div className="p-8">
            <h2 className="text-xl font-bold mb-4">Gerar PDF</h2>
            <p className="text-muted-foreground mb-6">
                Gere um PDF com o historion completo de reservas.
            </p>
            <Button onClick={confirmar}>Gerar PDF</Button>
        </div>
    )
}