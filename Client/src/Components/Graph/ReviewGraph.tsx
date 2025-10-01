import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReviewChartProps {
  ratings: number[]; // array of numbers like [5,4,3,5,2,...]
}

const ReviewChart: React.FC<ReviewChartProps> = ({ ratings }) => {
  // Build frequency distribution
  const data = [5, 4, 3, 2, 1].map((star) => ({
    name: `${star}⭐`,
    count: ratings.filter((r) => r === star).length,
  }));

  return (
    <div className="w-full h-80 bg-white shadow-lg rounded-2xl p-4 mb-12">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Review Ratings Distribution
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewChart;
