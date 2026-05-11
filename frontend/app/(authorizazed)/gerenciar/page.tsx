'use client'
import { DataTable } from "@/components/dataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reservasColumns } from "@/components/columnsReserva";
import { useData } from "@/context/dataContext";

export default function GerenciarReservas() {
    const { emprestimos } = useData()

    return (
        <div className="p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciar Reservas</CardTitle>
                    <CardDescription>Gerencie as reservas da biblioteca</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable columns={reservasColumns} data={emprestimos} />
                </CardContent>
            </Card>
        </div>
    )
}