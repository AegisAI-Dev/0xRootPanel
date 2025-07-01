import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ConfigSchema } from "@shared/schema";
import fetch from "node-fetch";
import * as https from "https";
import { Resolver } from 'dns';
import { Agent } from 'https';

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
      
      // Self-signed SSL certificaten toestaan voor https
      let fetchOptions: any = {
        method: 'GET',
        signal: controller.signal
      };
      if (url.startsWith('https://')) {
        fetchOptions.agent = new https.Agent({ rejectUnauthorized: false });
      }
      
      const response = await fetch(url, fetchOptions);
      
      clearTimeout(timeoutId);
      res.json({ status: 'online' });
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

  // Telenet usage fetcher
  app.get("/api/telenet-usage", async (req: Request, res: Response) => {
    // Forceer DNS-resolutie via Cloudflare
    const resolver = new Resolver();
    resolver.setServers(['1.1.1.1']);
    const customLookup = (hostname: string, options: any, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => {
      resolver.resolve4(hostname, (err, addresses) => {
        if (err) return callback(err, '', 4);
        callback(null, addresses[0] || '', 4);
      });
    };
    const agent = new Agent({
      lookup: customLookup
    });
    console.log('ENV:', process.env.TELENET_USERNAME, process.env.TELENET_PASSWORD ? '***' : undefined);
    const username = process.env.TELENET_USERNAME;
    const password = process.env.TELENET_PASSWORD;
    if (!username || !password) {
      console.error("Telenet credentials not configured");
      return res.status(500).json({ message: "Telenet credentials not configured" });
    }
    try {
      // 1. Login POST
      const loginRes = await fetch("https://login.telenet.be/openid/connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "mytelenet-client",
          grant_type: "password",
          username,
          password,
          scope: "openid profile telenet-web-api offline_access",
        }),
        agent,
      });
      console.log('Login response status:', loginRes.status);
      const loginText = await loginRes.clone().text();
      console.log('Login response body:', loginText);
      if (!loginRes.ok) {
        return res.status(401).json({ message: "Telenet login failed", details: loginText });
      }
      const loginData = await loginRes.json() as any;
      const accessToken = loginData.access_token;
      if (!accessToken) {
        console.error("No access token received:", loginData);
        return res.status(401).json({ message: "No access token received", details: loginData });
      }
      // 2. Haal usage data op
      const usageRes = await fetch("https://api.telenet.be/usage/v1/usage", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        },
        agent,
      });
      console.log('Usage response status:', usageRes.status);
      const usageText = await usageRes.clone().text();
      console.log('Usage response body:', usageText);
      if (!usageRes.ok) {
        return res.status(500).json({ message: "Failed to fetch usage data", details: usageText });
      }
      const usageData = await usageRes.json();
      res.json(usageData);
    } catch (error) {
      console.error("Telenet usage fetch failed:", error);
      res.status(500).json({ message: "Telenet usage fetch failed", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
