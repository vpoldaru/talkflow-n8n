# TalkFlow N8N Integration

A real-time chat application integrated with N8N workflows for automated responses and processing.

## Features

- Real-time chat interface
- N8N workflow integration
- Message history persistence
- Mobile-responsive design
- Dark/light mode support
- Code syntax highlighting
- Markdown support

## Project Info

**URL**: https://lovable.dev/projects/d5d4b31a-09c7-475c-a998-94f5a4cb4b09

## Technologies Used

This project is built with modern web technologies:

- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - JavaScript with syntax for types
- **React** - UI Library
- **shadcn/ui** - Re-usable components
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data synchronization
- **React Router** - Navigation
- **React Markdown** - Markdown rendering

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Development

There are several ways to work with this codebase:

**1. Use Lovable (Recommended)**

Visit the [Lovable Project](https://lovable.dev/projects/d5d4b31a-09c7-475c-a998-94f5a4cb4b09) and start prompting.
Changes made via Lovable will be committed automatically.

**2. Local Development**

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start development server
npm run dev
```

**3. Edit on GitHub**

- Navigate to desired file(s)
- Click "Edit" (pencil icon)
- Make changes and commit

**4. Use GitHub Codespaces**

- Go to repository main page
- Click "Code" button
- Select "Codespaces" tab
- Click "New codespace"

## Environment Variables

The application requires the following environment variables:

```
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Route components
├── types/         # TypeScript definitions
└── utils/         # Helper functions
```

## Deployment

### Quick Deploy

Open [Lovable](https://lovable.dev/projects/d5d4b31a-09c7-475c-a998-94f5a4cb4b09) and click on Share -> Publish.

### Custom Domain

While we don't currently support custom domains directly, you can deploy to Netlify:
1. Fork this repository
2. Connect it to Netlify
3. Configure your custom domain

Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is open source and available under the MIT License.