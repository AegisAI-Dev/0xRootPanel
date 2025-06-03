import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  HardDrive, 
  Network, 
  Shield, 
  Code2, 
  Github, 
  Terminal,
  Clock,
  Server
} from 'lucide-react';

interface AboutProps {
  toggleSidebar: () => void;
}

export const About: React.FC<AboutProps> = ({ toggleSidebar }) => {
  const systemInfo = {
    version: '3.7.2',
    buildDate: new Date().toLocaleDateString(),
    features: [
      {
        icon: <Cpu className="h-5 w-5" />,
        title: 'Real-time Monitoring',
        description: 'Continuous status checks for all your applications'
      },
      {
        icon: <HardDrive className="h-5 w-5" />,
        title: 'Self-hosted',
        description: 'Run locally or in your homelab environment'
      },
      {
        icon: <Network className="h-5 w-5" />,
        title: 'Status Endpoints',
        description: 'Custom status endpoints for detailed monitoring'
      },
      {
        icon: <Shield className="h-5 w-5" />,
        title: 'Passcode Protection',
        description: 'Secure access to your dashboard'
      }
    ],
    techStack: [
      {
        name: 'React',
        version: '18.2.0',
        icon: <Code2 className="h-5 w-5" />
      },
      {
        name: 'TypeScript',
        version: '5.0.0',
        icon: <Terminal className="h-5 w-5" />
      },
      {
        name: 'Tailwind CSS',
        version: '3.3.0',
        icon: <Github className="h-5 w-5" />
      }
    ]
  };

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <Header title="System Info" toggleSidebar={toggleSidebar} />
      
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* ASCII Art Header */}
          <div className="hidden md:block mb-8">
            <pre className="text-primary text-xs font-mono opacity-70 leading-tight whitespace-pre overflow-x-auto">
{`
     ██████╗ ██╗  ██╗██████╗  ██████╗  ██████╗ ████████╗██████╗  █████╗ ███╗   ██╗███████╗██╗     
    ██╔═████╗╚██╗██╔╝██╔══██╗██╔═══██╗██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
    ██║██╔██║ ╚███╔╝ ██████╔╝██║   ██║██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
    ████╔╝██║ ██╔██╗ ██╔══██╗██║   ██║██║   ██║   ██║   ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
    ╚██████╔╝██╔╝ ██╗██║  ██║╚██████╔╝╚██████╔╝   ██║   ██║     ██║  ██║██║ ╚████║███████╗███████╗
     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
                            [SYSTEM VERSION ${systemInfo.version}] - SECURE DASHBOARD ACCESS
`}
            </pre>
          </div>

          {/* System Overview */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Version</p>
                    <p className="font-mono text-slate-800 dark:text-white">{systemInfo.version}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Build Date</p>
                    <p className="font-mono text-slate-800 dark:text-white">{systemInfo.buildDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemInfo.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="text-primary">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium text-slate-800 dark:text-white mb-4">Tech Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {systemInfo.techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="text-primary">{tech.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-white">{tech.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">v{tech.version}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}; 