# **TalkFlow N8N Integration**

A real-time chat application integrated with **N8N workflows** for automated responses and processing.

## **Features**
- Real-time chat interface
- **N8N workflow integration**
- **Message history persistence**
- Mobile-responsive design
- Dark/light mode support
- **Code syntax highlighting**
- Markdown support

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

---

## **Getting Started**

### **Prerequisites**
- **Node.js & npm** – Install using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### **Development Setup**
```sh
# Clone the repository
git clone https://github.com/jimmartinquisitive/talkflow-n8n.git

# Navigate to project directory
cd talkflow-n8n

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## **Deployment Options**

### **1. Docker (Recommended)**
You can run the app using **Docker** from Docker Hub:

```sh
docker run -d -p 3000:3000 \
  -e VITE_N8N_WEBHOOK_URL="your_n8n_webhook_url" \
  jimmartinquis/n8n-chatui:latest
```

### **2. Compile from Source**
Manually build and run the project:

```sh
git clone https://github.com/jimmartinquisitive/talkflow-n8n.git
cd talkflow-n8n

# Install dependencies
npm install

# Build the project
npm run build

# Serve the production build
npm run preview
```

---

## **Configuration**
The application requires the following environment variable:

```sh
VITE_N8N_WEBHOOK_URL=your_n8n_webhook_url
```
Set this variable when deploying.

---

## **Project Structure**
```sh
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route components
├── types/          # TypeScript definitions
└── utils/          # Helper functions
```

---

## **Contributing**
1. **Fork** the repository
2. **Create a feature branch** (`git checkout -b feature-branch`)
3. **Commit your changes** (`git commit -m "Added new feature"`)
4. **Push to GitHub** (`git push origin feature-branch`)
5. **Open a Pull Request**

---

## **License**
This project is **open-source** and available under the **MIT License**.
```
