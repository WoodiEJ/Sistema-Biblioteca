"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/context/dataContext"

const chartConfig = {
  ativos: {
    label: "Ativos",
    color: "var(--chart-1)",
  },
  finalizados: {
    label: "Finalizados",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartArea() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const { emprestimos } = useData()

  const chartData = emprestimos.reduce((acc, emp) => {
    const date = emp.data_comeco.split('T')[0]
    const existente = acc.find(item => item.date === date)

    if (existente) {
      if (emp.ativo) existente.ativos++
      else existente.finalizados++
    } else {
      acc.push({
        date,
        ativos: emp.ativo ? 1 : 0,
        finalizados: emp.ativo ? 0 : 1
      })
    }

    return acc
  }, [] as { date: string, ativos: number, finalizados: number }[])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Empréstimos</CardTitle>
          <CardDescription>Ativos e finalizados por período</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">Últimos 3 meses</SelectItem>
            <SelectItem value="30d" className="rounded-lg">Últimos 30 dias</SelectItem>
            <SelectItem value="7d" className="rounded-lg">Últimos 7 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAtivos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-ativos)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-ativos)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillFinalizados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-finalizados)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-finalizados)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}
                  indicator="dot"
                />
              }
            />
            <Area dataKey="finalizados" type="natural" fill="url(#fillFinalizados)" stroke="var(--color-finalizados)" stackId="a" />
            <Area dataKey="ativos" type="natural" fill="url(#fillAtivos)" stroke="var(--color-ativos)" stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}