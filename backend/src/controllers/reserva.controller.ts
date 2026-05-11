import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import z from "zod";

const reservaSchema = z.object({
    usuario_id: z.number(),
    livro_id: z.number(),
    volta: z.date().optional()
})

export async function reservarLivro(req: Request, res: Response) {
    try {
        const result = reservaSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({ mensagem: "Preenche os campos corretamente" })
        }

        const { usuario_id, livro_id } = result.data
        const livro = await prisma.livro.findUnique({ where: { id: livro_id } })
        const livroAtivo = await prisma.emprestimo.findFirst({
            where: {
                livro_id,
                ativo: true
            }
        })

        if (!livro) {
            return res.status(404).json({ mensagem: "Livro nao existe" })
        }

        if (livro?.quantidade == 0) {
            return res.status(400).json({ mensagem: "Nao pode reservar esse livro, porque nao tem mais copias disponiveis" })
        }

        const usuarioEmprestouTres = await prisma.emprestimo.count({
            where: { usuario_id, ativo: true }
        })

        if (usuarioEmprestouTres >= 3) {
            return res.status(400).json({ mensagem: "Tem 3 emprestimo ativo" })
        }

        if (livroAtivo) {
            return res.status(400).json({ mensagem: `O livro ja esta em um emprestimo, ele volta dia: ${livroAtivo.data_fim}` })
        }

        const dataComeco = new Date()
        const dataFim = new Date(dataComeco)
        dataFim.setDate(dataFim.getDate() + 7)

        await prisma.emprestimo.create({
            data: {
                usuario_id,
                livro_id,
                ativo: true,
                data_comeco: dataComeco,
                data_fim: dataFim
            }
        })

        return res.status(201).json({ mensagem: "Reserva de livro feito" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function minhasReservas(req: Request, res: Response) {
    try {
        const usuario_id = (req as any).usuario_id
        const emprestimos = await prisma.emprestimo.findMany({
            where: { usuario_id },
            include: { livro: true }
        })
        return res.status(200).json(emprestimos)
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}