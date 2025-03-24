import { useState } from 'react'
import { MantineProvider, Title, Container, Group, Box, Image, Stack } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { FileUpload } from './components/FileUpload'
import { CodeDisplay } from './components/CodeDisplay'
import { AnalysisResults } from './components/AnalysisResults'
import { AnalyticsGraphs } from './components/AnalyticsGraphs'
import { Footer } from './components/Footer'
import { AnalysisResponse } from './types/analysis'

export default function App() {
    const [isLoading, setIsLoading] = useState(false)
    const [fileContent, setFileContent] = useState('')
    const [fileName, setFileName] = useState('')
    const [analysisResults, setAnalysisResults] = useState<AnalysisResponse | null>(null)

    const handleFileSelect = async (file: File) => {
        setIsLoading(true)
        try {
            // Read file content
            const content = await file.text()
            setFileContent(content)
            setFileName(file.name)

            // Create form data
            const formData = new FormData()
            formData.append('file', file)

            // Send to backend
            const response = await fetch('http://localhost:8000/analyze-code', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const results = await response.json()
            setAnalysisResults(results)
        } catch (error) {
            console.error('Error:', error)
            // You might want to show an error notification here
        } finally {
            setIsLoading(false)
        }
    }

    const getLanguage = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase()
        switch (ext) {
            case 'py':
                return 'python'
            case 'js':
                return 'javascript'
            case 'jsx':
                return 'jsx'
            default:
                return 'text'
        }
    }

    return (
        <MantineProvider>
            <Notifications />
            <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box 
                    style={{
                        borderBottom: '1px solid #e9ecef',
                        backgroundColor: '#ffffff',
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        padding: '1rem 0'
                    }}
                >
                    <Container size="lg">
                        <Group style={{ justifyContent: 'space-between' }}>
                            <Group style={{ gap: '1rem' }}>
                                <Image
                                    src="/images/image.png"
                                    alt="Carbon Crunch Logo"
                                    width={40}
                                    height={40}
                                    style={{ objectFit: 'contain' }}
                                />
                                <Title order={1} size="h3">Carbon Crunch Analysis</Title>
                            </Group>
                        </Group>
                    </Container>
                </Box>

                {/* Main Content */}
                <Box style={{ flex: 1, padding: '2rem 0' }}>
                    <Container size="lg">
                        <Stack style={{ gap: '2rem' }}>
                            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

                            {fileContent && (
                                <CodeDisplay
                                    originalCode={fileContent}
                                    fileName={fileName}
                                    language={getLanguage(fileName)}
                                />
                            )}

                            {analysisResults && (
                                <>
                                    <AnalysisResults results={analysisResults.analysis} />
                                    <AnalyticsGraphs results={analysisResults.analysis} />
                                </>
                            )}
                        </Stack>
                    </Container>
                </Box>

                {/* Footer */}
                <Box 
                    style={{
                        borderTop: '1px solid #e9ecef',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <Container size="lg">
                        <Footer />
                    </Container>
                </Box>
            </Box>
        </MantineProvider>
    )
}
