import { Group, ActionIcon, Text } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

export function Footer() {
  return (
    <Group position="apart" py="md" sx={{ height: '60px' }}>
      <Text size="sm" weight={500}>
        © 2025 Developed by Nitin Prajwal R
      </Text>
      <Group spacing={12}>
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
      </Group>
    </Group>
  );
} 