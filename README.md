# 0xRootPanel

A dark-themed, cyberpunk-style dashboard for cybersecurity/devops engineers to monitor, access, and control self-hosted applications across private infrastructure.

```
     ██████╗ ██╗  ██╗██████╗  ██████╗  ██████╗ ████████╗██████╗  █████╗ ███╗   ██╗███████╗██╗     
    ██╔═████╗╚██╗██╔╝██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
    ██║██╔██║ ╚███╔╝ ██████╔╝██║   ██║██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
    ████╔╝██║ ██╔██╗ ██╔══██╗██║   ██║██║   ██║   ██║   ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
    ╚██████╔╝██╔╝ ██╗██║  ██║╚██████╔╝╚██████╔╝   ██║   ██║     ██║  ██║██║ ╚████║███████╗███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
```

## 💀 Features

- **Cyberpunk UI**: Black background with neon accents (green, red, purple, electric blue)
- **Animated Effects**: Glitch text effects, scanning lines, and matrix-style backgrounds
- **Terminal Aesthetics**: Monospace fonts with command-line style interfaces
- **Dynamic App Grid**: Monitor and access all your applications in one dashboard
- **Real-time Status Checks**: Ping endpoint or URL every 30–60 seconds with visual indicators
- **Dark/Light Mode**: Default is dark mode hacker theme with optional light mode
- **Secure Access**: Passcode protection for dashboard access
- **Docker Ready**: Built-in Docker and docker-compose support for easy deployment

## 🧩 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/0xrootpanel.git
cd 0xrootpanel

# Configure your passcode (optional)
# Edit docker-compose.yml and uncomment the PASSCODE environment variable

# Start the container
docker-compose up -d

# Access the dashboard
# Open http://localhost:5000 in your browser
# Default passcode: admin123
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/0xrootpanel.git
cd 0xrootpanel

# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start

# Access the dashboard
# Open http://localhost:5000 in your browser
```

## ⚙️ Configuration

The dashboard is configured through a JSON file. You can edit it through the Settings page or directly in the configuration file.

### Sample Configuration

```json
{
  "require_passcode": true,
  "passcode": "rootnull2025",
  "apps": [
    {
      "name": "NeuralHunt",
      "description": "AI Malware Scanner",
      "url": "http://192.168.50.100:8081",
      "icon": "🧠",
      "status_endpoint": "http://192.168.50.100:8081/health"
    },
    {
      "name": "Proxmox",
      "description": "VM & Container Control Node",
      "url": "https://192.168.50.5:8006",
      "icon": "🖥️"
    }
  ]
}
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/yourusername/0xrootpanel.git
cd 0xrootpanel

# Install dependencies
npm install

# Start the development server
npm run dev

# Access the dashboard
# Open http://localhost:5000 in your browser
```

## 📚 Technologies Used

- **Frontend**: React, TailwindCSS, Framer Motion
- **Backend**: Node.js, Express
- **Other Tools**: Docker, TypeScript
