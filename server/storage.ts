import { users, type User, type InsertUser, type Config, type Application } from "@shared/schema";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const dataDir = path.join(process.cwd(), "data");
const configPath = path.join(dataDir, "config.json");

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getConfig(): Promise<Config>;
  saveConfig(config: Config): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Ensure data directory exists with proper permissions
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 });
    }
    
    // Ensure config.json exists
    this.ensureConfigExists();
  }

  private async ensureConfigExists() {
    try {
      await readFileAsync(configPath);
    } catch (error) {
      // If file doesn't exist, create a default config
      const defaultConfig: Config = {
        require_passcode: false,
        apps: [
          {
            name: "Nextcloud",
            description: "Personal cloud storage",
            url: "https://datalab.local",
            icon: "🗂️",
            status_endpoint: "https://datalab.local/status"
          },
          {
            name: "Jellyfin",
            description: "Media streaming server",
            url: "http://192.168.50.10:8096",
            icon: "🎞️"
          }
        ]
      };
      
      await writeFileAsync(configPath, JSON.stringify(defaultConfig, null, 2), { mode: 0o644 });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConfig(): Promise<Config> {
    try {
      const data = await readFileAsync(configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading config:", error);
      return { apps: [] };
    }
  }

  async saveConfig(config: Config): Promise<void> {
    try {
      // Ensure data directory exists with proper permissions
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true, mode: 0o755 });
      }
      
      // Write config with proper permissions
      await writeFileAsync(configPath, JSON.stringify(config, null, 2), { mode: 0o644 });
      
      // Verify the file was written correctly
      const savedConfig = await this.getConfig();
      if (JSON.stringify(savedConfig) !== JSON.stringify(config)) {
        throw new Error("Configuration verification failed");
      }
    } catch (error) {
      console.error("Error saving config:", error);
      throw new Error("Failed to save configuration");
    }
  }
}

export const storage = new MemStorage();
