"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

import type { ChartConfig } from "@/Components/ui/chart"
import { useEffect, useState } from "react"

export const description = "A bar chart with a label"
const BackendKey=import.meta.env.VITE_BACKEND_KEY

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartData {
  month: string
  desktop: number
}

export function ChartBarLabel() {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    fetch(`${BackendKey}/KickIt/profile`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const today = new Date()
        const monthNumber = today.getMonth() + 1
        const year = today.getFullYear()

        const ratings: number[] = data.user.ratings
        const ratingDates: string[] = data.user.ratingsDate

        const cD: ChartData[] = []

        for (let i = 0; i < ratings.length; i++) {
          const ratingMonth = Number(ratingDates[i].slice(5, 7))
          const ratingYear = Number(ratingDates[i].slice(0, 4))

          if (ratingYear === year && ratingMonth === monthNumber) {
            cD.push({
              month: ratingDates[i],
              desktop: ratings[i],
            })
          }
        }

        setChartData(cD)
      })
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            width={800}   // 🔥 Wider chart
            height={300}  // 🔥 Fixed height
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(8, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
