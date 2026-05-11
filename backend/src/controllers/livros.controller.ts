import { prisma } from "@/lib/prisma";
import { Request, Response } from "express";
import z from "zod";

const optionalSchema = z.object({
    titulo: z.string(),
    descricao: z.string(),
    autor: z.string(),
    categoria_id: z.number(),
    quantidade: z.number(),
    preco: z.number()
}).partial()

const livroSchema = z.object({
    titulo: z.string(),
    descricao: z.string(),
    autor: z.string(),
    categoria_id: z.number(),
    quantidade: z.number(),
    preco: z.number()
})

export async function consultarLivros(req: Request, res: Response) {
    try {
        const livros = await prisma.livro.findMany({
            include: { categoria: true }
        })
        return res.status(200).json(livros)
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function consultarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const livro = await prisma.livro.findUnique({ where: { id } })

        if (!livro) {
            return res.status(404).json({ mensagem: "Livro não encontrado" })
        }

        return res.json(livro)
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function atualizarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const result = optionalSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({ mensagem: "Valide os dados" })
        }

        const livroExiste = await prisma.livro.findUnique({ where: { id } })

        if (!livroExiste) {
            return res.status(404).json({ mensagem: "O livro nao existe" })
        }

        await prisma.livro.update({
            where: { id },
            data: result.data
        })

        return res.status(200).json({ mensagem: "Livro atualizado com sucesso" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function deletarLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const livro = await prisma.livro.findUnique({ where: { id } })

        if (!livro) {
            return res.status(404).json({ mensagem: "Livro nao existe" })
        }

        const livroEmprestado = await prisma.emprestimo.findFirst({
            where: {
                livro_id: id,
                ativo: true
            }
        })

        if (livroEmprestado) {
            return res.status(400).json({ mensagem: "O livro esta com emprestimo ativo" })
        }

        await prisma.livro.delete({ where: { id } })
        return res.status(200).json({ mensagem: "Livro deletado" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function devolverLivro(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const emprestimo = await prisma.emprestimo.findUnique({ 
            where: { id },
            include: {livro: true} 
        })

        if (!emprestimo) {
            return res.status(404).json({ mensagem: "Emprestimo não existe" })
        }

        if (!emprestimo.ativo) {
            return res.status(400).json({ mensagem: "Emprestimo ja esta inativo" })
        }

        await prisma.$transaction([
            prisma.emprestimo.update({
                where: {id},
                data: {
                    ativo: false,
                    volta: new Date()
                }
            }),

            prisma.livro.update({
                where: { id: emprestimo.livro_id },
                data: {
                    quantidade: {
                        increment: 1 
                    }
                }
            })
        ])

        return res.status(200).json({ mensagem: "Livro devolvido com sucesso" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function cadastrarLivro(req: Request, res: Response) {
    try {
        const result = livroSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({ mensagem: "Valide os campos" })
        }

        const { titulo, descricao, autor, categoria_id, quantidade, preco } = result.data
        const livroExiste = await prisma.livro.findFirst({
            where: {
                titulo: titulo,
                descricao: descricao,
                autor: autor
            }
        })

        if (livroExiste) {
            return res.status(400).json({ mensagem: "Livro ja existe" })
        }

        await prisma.livro.create({
            data: {
                titulo,
                descricao,
                autor,
                categoria_id,
                quantidade,
                preco
            }
        })

        return res.status(201).json({ mensagem: "Livro criado com sucesso" })
    } catch (erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}

export async function livrosPopulares(req: Request, res: Response) {
    try {
        const livrosPopulares = await prisma.livro.findMany({
            where: {
                quantidade: {
                    lte: 10
                }
            },
            include: {
                categoria: true
            },
            orderBy: {
                quantidade: 'asc'
            }
        })

        return res.status(200).json(livrosPopulares)
    } catch(erro) {
        if (erro instanceof Error) {
            return res.status(500).json({ mensagem: erro.message })
        }

        return res.status(500).json({ mensagem: "Erro interno do servidor" })
    }
}