import { useEffect, useState } from 'react';
import { Paper, Title, Text, Box } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { motion } from 'framer-motion';

interface CodeDisplayProps {
    originalCode: string;
    fileName: string;
    language: string;
}

export function CodeDisplay({ originalCode, fileName, language }: CodeDisplayProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                shadow="sm"
                radius="md"
                p="md"
                className="light-dark"
            >
                <Title order={3} mb="sm">
                    Code Review
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                    File: {fileName}
                </Text>
                <Box
                    style={{
                        maxHeight: '600px',
                        overflow: 'auto',
                    }}
                    className="light-dark"
                >
                    <CodeHighlight
                        code={originalCode}
                        language={language}
                        withCopyButton
                        styles={{
                            copy: {
                                backgroundColor: 'var(--mantine-color-body)',
                            },
                            pre: {
                                backgroundColor: 'transparent',
                            },
                        }}
                    />
                </Box>
            </Paper>
        </motion.div>
    );
} 