import { Paper, Title, Text, Grid, Badge, Stack, ThemeIcon, Code, Box, Divider } from '@mantine/core';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AnalysisResult, Recommendation } from '../types/analysis';
import './AnalysisResults.css';
import React from 'react';

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
                    <Paper shadow="sm" radius="md" p="xl" className="light-dark">
                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--mantine-spacing-xl)' }}>
                            <div>
                                <Title order={2}>Overall Score</Title>
                                <Text size="sm" c="dimmed">Based on multiple criteria</Text>
                            </div>
                            <Badge
                                size="xl"
                                variant="filled"
                                color={getScoreColor(results.total_score) === '#2ecc71' ? 'green' : 
                                       getScoreColor(results.total_score) === '#f1c40f' ? 'yellow' : 'red'}
                            >
                                {results.total_score}/100
                            </Badge>
                        </Box>

                        {/* Score Breakdown Table */}
                        <Box mb="md">
                            <Title order={4} mb="md">Score Breakdown</Title>
                            <Paper withBorder p="xs">
                                <Box style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 80px', gap: '8px' }}>
                                    <Text fw={700} size="sm">Category</Text>
                                    <Text fw={700} size="sm" ta="center">Score</Text>
                                    
                                    {Object.entries(results.category_scores).map(([category, score]) => (
                                        <React.Fragment key={category}>
                                            <Text size="sm">
                                                {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </Text>
                                            <Badge 
                                                size="md"
                                                variant="filled"
                                                color={
                                                    score >= 80 ? 'green' :
                                                    score >= 60 ? 'yellow' : 'red'
                                                }
                                                style={{ width: '60px', justifySelf: 'center' }}
                                            >
                                                {score}/100
                                            </Badge>
                                        </React.Fragment>
                                    ))}
                                    
                                    <Box style={{ 
                                        gridColumn: '1 / -1', 
                                        height: '1px', 
                                        background: 'var(--mantine-color-gray-3)', 
                                        margin: '8px 0' 
                                    }} />
                                    
                                    <Text fw={700} size="sm">Overall Score</Text>
                                    <Badge 
                                        size="md"
                                        variant="filled"
                                        color={
                                            results.total_score >= 80 ? 'green' :
                                            results.total_score >= 60 ? 'yellow' : 'red'
                                        }
                                        style={{ width: '60px', justifySelf: 'center' }}
                                    >
                                        {results.total_score}/100
                                    </Badge>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Category Descriptions */}
                        <Box mb="xl" size="xs">
                            <Text size="xs" c="dimmed" fw={500} mb="xs">Category Explanations:</Text>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Text size="xs" c="dimmed"><b>Naming Conventions:</b> Variable, function and class naming</Text>
                                    <Text size="xs" c="dimmed"><b>Function Modularity:</b> Proper function design and organization</Text>
                                    <Text size="xs" c="dimmed"><b>Documentation:</b> Code comments and documentation quality</Text>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Text size="xs" c="dimmed"><b>Formatting:</b> Code style and formatting consistency</Text>
                                    <Text size="xs" c="dimmed"><b>Reusability:</b> Code reuse and modularity</Text>
                                    <Text size="xs" c="dimmed"><b>Best Practices:</b> Adherence to language best practices</Text>
                                </Grid.Col>
                            </Grid>
                        </Box>

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
                                        isAnimationActive={false}
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
                                                rec.priority === 'High' ? '#e74c3c' :
                                                rec.priority === 'Medium' ? '#f1c40f' : '#2ecc71'
                                            }`,
                                        }}
                                    >
                                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--mantine-spacing-xs)' }}>
                                            <Box style={{ display: 'flex', alignItems: 'center', gap: 'var(--mantine-spacing-xs)' }}>
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
                                                <Text fw={500}>{rec.category}</Text>
                                            </Box>
                                            <Badge
                                                variant="light"
                                                color={
                                                    rec.priority === 'High' ? 'red' :
                                                    rec.priority === 'Medium' ? 'yellow' : 'green'
                                                }
                                            >
                                                {rec.priority}
                                            </Badge>
                                        </Box>
                                        <Text size="sm">{rec.suggestion}</Text>
                                        {rec.example_violation && (
                                            <Text size="xs" c="dimmed" mt="xs">
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
                                <Grid>
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
                                                        <Stack gap="md">
                                                            {insights.map((insight: string, i: number) => (
                                                                <Box key={i}>
                                                                    <div className="markdown-content">
                                                                        <ReactMarkdown 
                                                                            remarkPlugins={[remarkGfm]}
                                                                            components={{
                                                                                p: ({ children }) => (
                                                                                    <Text mb="xs" style={{ whiteSpace: 'pre-wrap' }}>{children}</Text>
                                                                                ),
                                                                                code: ({ children }) => (
                                                                                    <Code 
                                                                                        block 
                                                                                        style={{ 
                                                                                            backgroundColor: 'var(--mantine-color-gray-light)',
                                                                                            padding: '12px',
                                                                                            borderRadius: '4px',
                                                                                            fontSize: '0.9em'
                                                                                        }}
                                                                                    >
                                                                                        {String(children).replace(/\n$/, '')}
                                                                                    </Code>
                                                                                ),
                                                                                ul: ({ children }) => (
                                                                                    <Stack gap="xs">
                                                                                        {children}
                                                                                    </Stack>
                                                                                ),
                                                                                li: ({ children }) => (
                                                                                    <Box style={{ display: 'flex', gap: 'var(--mantine-spacing-xs)', alignItems: 'flex-start' }}>
                                                                                        <Text>•</Text>
                                                                                        <Box style={{ flex: 1 }}>
                                                                                            {children}
                                                                                        </Box>
                                                                                    </Box>
                                                                                ),
                                                                                h3: ({ children }) => (
                                                                                    <Title order={3} mb="sm" size="h4">{children}</Title>
                                                                                ),
                                                                                h4: ({ children }) => (
                                                                                    <Title order={4} mb="sm" size="h5">{children}</Title>
                                                                                ),
                                                                                strong: ({ children }) => (
                                                                                    <Text span fw={700}>{children}</Text>
                                                                                ),
                                                                                em: ({ children }) => (
                                                                                    <Text span fs="italic">{children}</Text>
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