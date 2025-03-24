import { useRef, useState } from 'react';
import { Box, Text, Button, rem, useMantineTheme } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    isLoading: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
    const theme = useMantineTheme();
    const openRef = useRef<() => void>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = (files: File[]) => {
        const file = files[0];
        if (!file) return;

        const allowedExtensions = ['.py', '.js', '.jsx'];
        const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

        if (!allowedExtensions.includes(fileExtension)) {
            notifications.show({
                title: 'Invalid File Type',
                message: 'Please upload a Python (.py) or JavaScript/React (.js, .jsx) file',
                color: 'red',
            });
            return;
        }

        onFileSelect(file);
    };

    return (
        <Box
            p="2rem"
            style={{
                borderRadius: theme.radius.md,
            }}
            className="light-dark"
        >
            <Dropzone
                openRef={openRef}
                onDrop={handleDrop}
                onDragOver={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                radius="md"
                accept={{
                    'text/x-python': ['.py'],
                    'text/javascript': ['.js', '.jsx'],
                    'application/javascript': ['.js', '.jsx']
                }}
                maxSize={5 * 1024 ** 2}
                loading={isLoading}
                style={{
                    border: `2px dashed ${isDragOver ? theme.colors.blue[6] : theme.colors.gray[4]}`,
                    transition: 'all 0.2s ease',
                    transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
                }}
            >
                <Box style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                            style={{ color: 'var(--mantine-primary-color-filled)' }}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            style={{ color: 'var(--mantine-color-red-filled)' }}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconFile size="3.2rem" stroke={1.5} />
                    </Dropzone.Idle>

                    <Box>
                        <Text size="xl" inline>
                            Drag & drop your code file here or click to select
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Supported file types: Python (.py), JavaScript (.js), React (.jsx)
                        </Text>
                        {isLoading && (
                            <Text size="sm" c="blue" inline mt={7}>
                                Analyzing your code...
                            </Text>
                        )}
                    </Box>
                </Box>
            </Dropzone>

            <Box ta="center" mt="md">
                <Button
                    onClick={() => openRef.current?.()}
                    variant="light"
                    loading={isLoading}
                >
                    <IconUpload size="1rem" style={{ marginRight: '0.5rem' }} />
                    Select File
                </Button>
            </Box>
        </Box>
    );
} 