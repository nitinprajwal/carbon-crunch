import { Paper, Title, Text, Grid, Badge, Stack, Group } from '@mantine/core';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { AnalysisResult, Recommendation } from '../types/analysis';
import './AnalysisResults.css';

// Add type for code component props

interface AnalysisResultsProps {
    results: AnalysisResult;
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
    const chartData = Object.entries(results.category_scores).map(([category, score]) => ({
        name: category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        score,
        fill: getScoreColor(score),
    }));

    function getScoreColor(score: number) {
        if (score >= 80) return '#2ecc71';
        if (score >= 60) return '#f1c40f';
        return '#e74c3c';
    }

    function getSeverityIcon(priority: string) {
        switch (priority.toLowerCase()) {
            case 'high':
                return <IconX size="1rem" color="#e74c3c" />;
            case 'medium':
                return <IconAlertTriangle size="1rem" color="#f1c40f" />;
            case 'low':
                return <IconCheck size="1rem" color="#2ecc71" />;
            default:
                return null;
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Grid gutter="md">
                <Grid.Col span={12}>
                    <Paper shadow="sm" radius="md" p="xl" style={{ overflow: 'hidden' }}>
                        <Group justify="apart" mb="xl">
                            <div>
                                <Title order={2}>Overall Score</Title>
                                <Text size="sm" color="dimmed">Based on multiple criteria</Text>
                            </div>
                            <Badge
                                size="xl"
                                variant="filled"
                                color={getScoreColor(results.total_score) === '#2ecc71' ? 'green' : 
                                       getScoreColor(results.total_score) === '#f1c40f' ? 'yellow' : 'red'}
                            >
                                {results.total_score}/100
                            </Badge>
                        </Group>

                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="20%"
                                    outerRadius="80%"
                                    data={chartData}
                                    startAngle={180}
                                    endAngle={-180}
                                >
                                    <RadialBar
                                        background
                                        dataKey="score"
                                        cornerRadius={10}
                                    />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Paper shadow="sm" radius="md" p="xl">
                        <Title order={2} mb="xl">Recommendations</Title>
                        <Stack gap="md">
                            {(results.recommendations || []).map((rec: Recommendation, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Paper
                                        p="md"
                                        radius="sm"
                                        style={{
                                            borderLeft: `4px solid ${
                                                rec.priority.toLowerCase() === 'high' ? '#e74c3c' :
                                                rec.priority.toLowerCase() === 'medium' ? '#f1c40f' : '#2ecc71'
                                            }`
                                        }}
                                    >
                                        <Group>
                                            {getSeverityIcon(rec.priority)}
                                            <Text fw={500}>{rec.category}</Text>
                                        </Group>
                                        <Text size="sm" color="dimmed" mt="xs">
                                            {rec.suggestion}
                                        </Text>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Stack>
                    </Paper>
                </Grid.Col>
            </Grid>
        </motion.div>
    );
}