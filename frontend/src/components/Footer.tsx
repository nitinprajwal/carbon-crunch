import { Box, ActionIcon, Text } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

export function Footer() {
  return (
    <Box py="md" style={{ height: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text size="sm" fw={500}>
        © 2025 Developed by Nitin Prajwal R
      </Text>
      <Box style={{ display: 'flex', gap: '12px' }}>
        <ActionIcon
          size="lg"
          variant="light"
          radius="xl"
          component="a"
          href="https://github.com/nitinprajwal"
          target="_blank"
        >
          <IconBrandGithub size="1.2rem" />
        </ActionIcon>
        <ActionIcon
          size="lg"
          variant="light"
          radius="xl"
          component="a"
          href="https://www.linkedin.com/in/nitinprajwal/"
          target="_blank"
        >
          <IconBrandLinkedin size="1.2rem" />
        </ActionIcon>
      </Box>
    </Box>
  );
} 