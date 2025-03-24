import { Paper, Title, Text, Grid, Badge, Progress, Stack, Group, ThemeIcon, List, Code, Box, Divider } from '@mantine/core';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult, Recommendation } from '../types/analysis';
import './AnalysisResults.css';

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
                        <Group position="apart" mb="xl">
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
                                        minAngle={15}
                                        background
                                        clockWise={true}
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
                        <Stack spacing="md">
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
                                                rec.priority === 'High' ? '#e74c3c' :
                                                rec.priority === 'Medium' ? '#f1c40f' : '#2ecc71'
                                            }`,
                                        }}
                                    >
                                        <Group position="apart" mb="xs">
                                            <Group>
                                                <ThemeIcon
                                                    size="sm"
                                                    variant="light"
                                                    color={
                                                        rec.priority === 'High' ? 'red' :
                                                        rec.priority === 'Medium' ? 'yellow' : 'green'
                                                    }
                                                >
                                                    {getSeverityIcon(rec.priority)}
                                                </ThemeIcon>
                                                <Text weight={500}>{rec.category}</Text>
                                            </Group>
                                            <Badge
                                                variant="light"
                                                color={
                                                    rec.priority === 'High' ? 'red' :
                                                    rec.priority === 'Medium' ? 'yellow' : 'green'
                                                }
                                            >
                                                {rec.priority}
                                            </Badge>
                                        </Group>
                                        <Text size="sm">{rec.suggestion}</Text>
                                        {rec.example_violation && (
                                            <Text size="xs" color="dimmed" mt="xs">
                                                Example: {rec.example_violation}
                                            </Text>
                                        )}
                                    </Paper>
                                </motion.div>
                            ))}
                        </Stack>
                    </Paper>
                </Grid.Col>

                {/* Separate AI Analysis Section */}
                {results.groq_analysis?.status === 'success' && (
                    <>
                        <Grid.Col span={12}>
                            <Divider my="xl" label="Additional AI Analysis" labelPosition="center" />
                        </Grid.Col>
                        
                    <Grid.Col span={12}>
                        <Paper shadow="sm" radius="md" p="xl">
                                <Title order={2} mb="xl">Extended Code Analysis</Title>
                            <Grid gutter="md">
                                    {Object.entries(results.groq_analysis.insights || {}).map(([category, insights], index) => {
                                        // Skip categories that are already covered in the main analysis
                                        if (['documentation', 'naming_conventions', 'function_modularity', 'formatting', 'reusability', 'best_practices'].includes(category)) {
                                            return null;
                                        }
                                        
                                        return insights.length > 0 && (
                                        <Grid.Col key={category} span={6}>
                                            <motion.div
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                    <Paper p="md" radius="sm" withBorder>
                                                    <Title order={4} mb="md">
                                                        {category.split('_').map(word => 
                                                            word.charAt(0).toUpperCase() + word.slice(1)
                                                        ).join(' ')}
                                                    </Title>
                                                        <Stack spacing="md">
                                                        {insights.map((insight, i) => (
                                                                <Box key={i}>
                                                                    <div className="markdown-content">
                                                                        <ReactMarkdown 
                                                                            remarkPlugins={[remarkGfm]}
                                                                            components={{
                                                                                p: ({ children }) => (
                                                                                    <Text mb="xs" style={{ whiteSpace: 'pre-wrap' }}>{children}</Text>
                                                                                ),
                                                                                code: ({ node, inline, className, children, ...props }) => {
                                                                                    const match = /language-(\w+)/.exec(className || '');
                                                                                    return !inline ? (
                                                                                        <Box mb="xs">
                                                                                            <Code 
                                                                                                block 
                                                                                                style={{ 
                                                                                                    backgroundColor: '#f8f9fa',
                                                                                                    padding: '12px',
                                                                                                    borderRadius: '4px',
                                                                                                    fontSize: '0.9em'
                                                                                                }}
                                                                                            >
                                                                                                {String(children).replace(/\n$/, '')}
                                                                                            </Code>
                                                                                        </Box>
                                                                                    ) : (
                                                                                        <Code 
                                                                                            style={{ 
                                                                                                backgroundColor: '#f8f9fa',
                                                                                                padding: '2px 6px',
                                                                                                borderRadius: '4px',
                                                                                                fontSize: '0.9em'
                                                                                            }}
                                                                                        >
                                                                                            {children}
                                                                                        </Code>
                                                                                    );
                                                                                },
                                                                                ul: ({ children }) => (
                                                                                    <Stack spacing="xs">
                                                                                        {children}
                                                                                    </Stack>
                                                                                ),
                                                                                li: ({ children }) => (
                                                                                    <Group spacing="xs" noWrap align="flex-start">
                                                                                        <Text>•</Text>
                                                                                        <Text size="sm" style={{ flex: 1 }}>{children}</Text>
                                                                                    </Group>
                                                                                ),
                                                                                h3: ({ children }) => (
                                                                                    <Title order={3} mb="sm" size="h4">{children}</Title>
                                                                                ),
                                                                                h4: ({ children }) => (
                                                                                    <Title order={4} mb="sm" size="h5">{children}</Title>
                                                                                ),
                                                                                strong: ({ children }) => (
                                                                                    <Text span weight={700}>{children}</Text>
                                                                                ),
                                                                                em: ({ children }) => (
                                                                                    <Text span italic>{children}</Text>
                                                                                )
                                                                            }}
                                                                        >
                                                                            {insight}
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                </Paper>
                                            </motion.div>
                                        </Grid.Col>
                                        );
                                    })}
                            </Grid>
                        </Paper>
                    </Grid.Col>
                    </>
                )}
            </Grid>
        </motion.div>
    );
} 