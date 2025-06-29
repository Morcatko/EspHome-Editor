import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Editor for ESPHome docs',
  tagline: "If you're working with devices that have many similar components or deploying multiple similar devices, this tool is here to save you time and effort",
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    experimental_faster: true,
  },

  url: 'https://editor-4-esphome.github.io',
  baseUrl: '/',

  githubHost: 'github-private',
  organizationName: 'editor-4-esphome',
  projectName: 'editor-4-esphome.github.io',
  deploymentBranch: 'main',
  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true, // Enable Mermaid diagrams in markdown
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/Morcatko/EspHome-Editor/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'B9xdTXG2YNLR2EQ8ZHLOjSVU_WYJkizqBylPkNJYxio',
      },
    }
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: true, // Respect user's color scheme preference
    },
    navbar: {
      title: 'Editor for ESPHome',
      logo: {
        alt: '.',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/Morcatko/EspHome-Editor',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              label: 'Changelog',
              href: 'https://github.com/Morcatko/EspHome-Editor/releases',
            }
          ],
        },
        {
          items: [
            {
              label: 'Docs GitHub',
              href: 'https://github.com/editor-4-esphome/docs',
            },
          ],
        },
        {
          items: [
            {
              label: 'HA Addon',
              href: 'https://github.com/Morcatko/ha-addons',
            }
          ]
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
