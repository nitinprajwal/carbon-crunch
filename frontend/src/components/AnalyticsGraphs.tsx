import { Paper, Title, Grid } from '@mantine/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { AnalysisResult } from '../types/analysis';

interface AnalyticsGraphsProps {
  results: AnalysisResult;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AnalyticsGraphs({ results }: AnalyticsGraphsProps) {
  // Transform category scores into chart data
  const categoryScores = Object.entries(results.category_scores).map(([category, score]) => ({
    name: category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: Math.round(score * 100)
  }));

  // Transform severity breakdown into pie chart data
  const severityData = Object.values(results.detailed_analysis).reduce((acc, category) => {
    acc.error += category.severity_breakdown.error;
    acc.warning += category.severity_breakdown.warning;
    acc.info += category.severity_breakdown.info;
    return acc;
  }, { error: 0, warning: 0, info: 0 });

  const issueDistribution = [
    { name: 'Error', value: severityData.error },
    { name: 'Warning', value: severityData.warning },
    { name: 'Info', value: severityData.info }
  ].filter(issue => issue.value > 0);

  return (
    <Grid gutter="md">
      <Grid.Col span={12}>
        <Paper p="md" radius="md" withBorder>
          <Title order={3} size="h4" mb="md">Category Scores</Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryScores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis 
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }}
                domain={[0, 100]}
              />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid.Col>
      
      {issueDistribution.length > 0 && (
        <Grid.Col span={12}>
          <Paper p="md" radius="md" withBorder>
            <Title order={3} size="h4" mb="md">Issue Distribution</Title>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      )}
    </Grid>
  );
} 