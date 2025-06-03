import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { PlusCircle, Save, Trash2, AlertCircle } from 'lucide-react';
import { Application, Config } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { EmojiPicker } from '@/components/EmojiPicker';

interface SettingsProps {
  toggleSidebar: () => void;
}

const initialAppState: Application = {
  name: '',
  description: '',
  url: '',
  icon: '📱',
  status_endpoint: ''
};

export const Settings: React.FC<SettingsProps> = ({ toggleSidebar }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [localConfig, setLocalConfig] = useState<Config | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/config');
        const data = await res.json();
        setConfig(data);
        setLocalConfig({ ...data });
      } catch (error) {
        console.error('Error fetching config:', error);
        toast({
          title: 'Error',
          description: 'Failed to load configuration',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  const handleAddApp = () => {
    if (!localConfig) return;
    
    setLocalConfig({
      ...localConfig,
      apps: [...localConfig.apps, { ...initialAppState }]
    });
  };

  const handleRemoveApp = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteIndex === null || !localConfig) return;
    
    const updatedApps = [...localConfig.apps];
    updatedApps.splice(deleteIndex, 1);
    
    setLocalConfig({
      ...localConfig,
      apps: updatedApps
    });
    
    setIsDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleAppChange = (index: number, field: keyof Application, value: string) => {
    if (!localConfig) return;
    
    const updatedApps = [...localConfig.apps];
    updatedApps[index] = {
      ...updatedApps[index],
      [field]: value
    };
    
    setLocalConfig({
      ...localConfig,
      apps: updatedApps
    });
  };

  const handlePasscodeToggle = (enabled: boolean) => {
    if (!localConfig) return;
    
    setLocalConfig({
      ...localConfig,
      require_passcode: enabled
    });
  };

  const handlePasscodeChange = (passcode: string) => {
    if (!localConfig) return;
    
    setLocalConfig({
      ...localConfig,
      passcode
    });
  };

  const handleSaveApp = async (index: number) => {
    if (!localConfig || !localConfig.apps) return;
    
    try {
      setIsSaving(true);
      const appToSave = localConfig.apps[index];
      
      // Create a config with all apps, but update the specific one
      const updatedConfig: Config = {
        ...localConfig,
        apps: [...localConfig.apps]
      };
      updatedConfig.apps[index] = appToSave;
      
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig)
      });
      
      if (res.ok) {
        // Update the main config
        setConfig(updatedConfig);
        
        toast({
          title: 'Success',
          description: `Application "${appToSave.name}" saved successfully`
        });
      } else {
        toast({
          title: 'Error',
          description: `Failed to save application "${appToSave.name}"`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving app:', error);
      toast({
        title: 'Error',
        description: 'Failed to save application',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!localConfig || isLoading) {
    return (
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        <Header title="Settings" toggleSidebar={toggleSidebar} />
        <div className="p-4 md:p-6 flex justify-center items-center h-64">
          <div className="text-center text-slate-500 dark:text-slate-400">
            Loading configuration...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900">
      <Header title="Settings" toggleSidebar={toggleSidebar} />
      
      <div className="p-4 md:p-6 pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium text-slate-800 dark:text-white">Dashboard Settings</h2>
        </div>

        {/* Passcode Protection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Security</h3>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label htmlFor="passcode-toggle" className="font-medium">
                  Passcode Protection
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Require a passcode to access the dashboard
                </p>
              </div>
              <Switch
                id="passcode-toggle"
                checked={localConfig.require_passcode || false}
                onCheckedChange={handlePasscodeToggle}
              />
            </div>
            
            {localConfig.require_passcode && (
              <div className="mt-4">
                <Label htmlFor="passcode" className="mb-2 block">
                  Dashboard Passcode
                </Label>
                <Input
                  id="passcode"
                  type="password"
                  placeholder="Enter passcode"
                  value={localConfig.passcode || ''}
                  onChange={(e) => handlePasscodeChange(e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-white">
                Manage Applications
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddApp}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Application
              </Button>
            </div>
            
            {localConfig.apps.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                <p>No applications added yet.</p>
                <p className="text-sm mt-1">Click 'Add Application' to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {localConfig.apps.map((app, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-slate-800 dark:text-white">
                        {app.name || `Application ${index + 1}`}
                      </h4>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveApp(index)}
                          className="text-slate-500 hover:text-green-500"
                          disabled={isSaving}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveApp(index)}
                          className="text-slate-500 hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor={`app-name-${index}`} className="mb-2 block">
                          Name
                        </Label>
                        <Input
                          id={`app-name-${index}`}
                          value={app.name}
                          onChange={(e) => handleAppChange(index, 'name', e.target.value)}
                          placeholder="Application name"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`app-icon-${index}`} className="mb-2 block">
                          Icon
                        </Label>
                        <EmojiPicker
                          value={app.icon}
                          onChange={(emoji) => handleAppChange(index, 'icon', emoji)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`app-desc-${index}`} className="mb-2 block">
                          Description
                        </Label>
                        <Input
                          id={`app-desc-${index}`}
                          value={app.description}
                          onChange={(e) => handleAppChange(index, 'description', e.target.value)}
                          placeholder="A short description"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`app-url-${index}`} className="mb-2 block">
                          URL
                        </Label>
                        <Input
                          id={`app-url-${index}`}
                          value={app.url}
                          onChange={(e) => handleAppChange(index, 'url', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`app-status-${index}`} className="mb-2 block">
                          Status Endpoint (Optional)
                        </Label>
                        <Input
                          id={`app-status-${index}`}
                          value={app.status_endpoint || ''}
                          onChange={(e) => handleAppChange(index, 'status_endpoint', e.target.value)}
                          placeholder="https://example.com/status"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          If left empty, the main URL will be used for status checks
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the application from your dashboard. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-500 hover:bg-rose-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};
