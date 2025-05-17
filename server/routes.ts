import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ConfigSchema } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get config
  app.get("/api/config", async (req: Request, res: Response) => {
    try {
      const config = await storage.getConfig();
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  // Update config
  app.post("/api/config", async (req: Request, res: Response) => {
    try {
      const result = ConfigSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid configuration format",
          errors: result.error.errors 
        });
      }
      
      await storage.saveConfig(result.data);
      res.json({ message: "Configuration saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save configuration" });
    }
  });

  // Check app status
  app.get("/api/check-status", async (req: Request, res: Response) => {
    const url = req.query.url as string;
    
    if (!url) {
      return res.status(400).json({ message: "URL parameter is required" });
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { 
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        res.json({ status: 'online' });
      } else {
        res.json({ status: 'offline' });
      }
    } catch (error) {
      res.json({ status: 'offline' });
    }
  });

  // Verify passcode
  app.post("/api/verify-passcode", async (req: Request, res: Response) => {
    try {
      const { passcode } = req.body;
      const config = await storage.getConfig();
      
      if (!config.require_passcode || config.passcode === passcode) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Error verifying passcode" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
