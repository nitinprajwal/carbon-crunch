import { useEffect, useState } from 'react';
import { Paper, Title, Text, useMantineTheme } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { motion } from 'framer-motion';

interface CodeDisplayProps {
    originalCode: string;
    fileName: string;
    language: string;
}

export function CodeDisplay({ originalCode, fileName, language }: CodeDisplayProps) {
    const theme = useMantineTheme();
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
                style={{
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                }}
            >
                <Title order={3} mb="sm">
                    Code Review
                </Title>
                <Text size="sm" color="dimmed" mb="md">
                    File: {fileName}
                </Text>
                <Paper
                    style={{
                        maxHeight: '600px',
                        overflow: 'auto',
                        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                    }}
                >
                    <CodeHighlight
                        code={originalCode}
                        language={language}
                        withCopyButton
                        styles={{
                            copy: {
                                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
                            },
                            pre: {
                                backgroundColor: 'transparent',
                            },
                        }}
                    />
                </Paper>
            </Paper>
        </motion.div>
    );
} 