import { useRef, useState } from 'react';
import { Group, Text, Button, rem, useMantineTheme } from '@mantine/core';
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
        <div
            style={{
                padding: '2rem',
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.dark[6],
            }}
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
                <Group justify="center" gap="xl" style={{ minHeight: rem(220), pointerEvents: 'none' }}>
                    <Dropzone.Accept>
                        <IconUpload
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors[theme.primaryColor][4]}
                        />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX
                            size="3.2rem"
                            stroke={1.5}
                            color={theme.colors.red[4]}
                        />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconFile size="3.2rem" stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            Drag & drop your code file here or click to select
                        </Text>
                        <Text size="sm" color="dimmed" inline mt={7}>
                            Supported file types: Python (.py), JavaScript (.js), React (.jsx)
                        </Text>
                        {isLoading && (
                            <Text size="sm" color="blue" inline mt={7}>
                                Analyzing your code...
                            </Text>
                        )}
                    </div>
                </Group>
            </Dropzone>

            <Group justify="center" mt="md">
                <Button
                    onClick={() => openRef.current?.()}
                    variant="light"
                    loading={isLoading}
                    leftSection={<IconUpload size="1rem" />}
                >
                    Select File
                </Button>
            </Group>
        </div>
    );
} 