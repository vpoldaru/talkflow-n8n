# **TalkFlow N8N Integration**

A real-time chat application integrated with **N8N workflows** for automated responses and processing.

## **Features**
- Real-time chat interface
- **N8N workflow integration**
- **Message history persistence**
- Mobile-responsive design
- Dark/light mode support
- **Code syntax highlighting with copy and playground integration**
- Markdown support
- Image upload and preview
- Configurable site title and welcome message

## **Technologies Used**
This project is built with modern web technologies:

- **Vite** - Next-generation frontend tooling
- **TypeScript** - Strongly typed JavaScript
- **React** - UI framework
- **shadcn/ui** - Reusable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data synchronization
- **React Router** - Navigation
- **React Markdown** - Markdown rendering
- **Monaco Editor** - Code playground integration

---

## **Getting Started**

### **Prerequisites**
- **Node.js & npm** – Install using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### **Development Setup**

# Clone the repository
git clone https://github.com/jimmartinquisitive/talkflow-n8n.git

# Navigate to project directory
cd talkflow-n8n

# Install dependencies
npm install

# Start the development server
npm run dev

# Deployment Options
1. Docker (Recommended)
You can run the app using Docker from Docker Hub:


docker run -d -p 3000:3000 \
  -e VITE_N8N_WEBHOOK_URL="your_n8n_webhook_url" \
  -e VITE_WELCOME_MESSAGE="Your welcome message" \
  -e VITE_SITE_TITLE="Your Site Title" \
  jimmartinquis/n8n-chatui:latest
  
2. Docker Compose
Use the provided docker-compose.yml:


docker-compose up -d
3. Compile from Source
Manually build and run the project:


git clone https://github.com/jimmartinquisitive/talkflow-n8n.git
cd talkflow-n8n

# Install dependencies
npm install

# Build the project
npm run build

# Serve the production build
npm run preview
Configuration
The application supports the following environment variables:


# Required
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url

# Optional
VITE_WELCOME_MESSAGE=your_welcome_message
VITE_SITE_TITLE=your_site_title

# Features
Code Playground
Syntax highlighting for multiple languages
Copy code to clipboard
Send code to playground for editing
Monaco editor integration
Image Support
Upload images in chat
Preview thumbnails
Click to view full-size images
Support for common image formats

# Project Structure

src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── types/          # TypeScript definitions
└── utils/          # Helper functions

# Contributing
Fork the repository
Create a feature branch (git checkout -b feature-branch)
Commit your changes (git commit -m "Added new feature")
Push to GitHub (git push origin feature-branch)
Open a Pull Request

# License
This project is open-source and available under the MIT License.
