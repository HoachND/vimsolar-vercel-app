import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
const TMP_DIR = "/tmp";
const DATA_DIR = path.join(process.cwd(), "data");

export function getStorageFilePath(filename: string) {
  return isProd ? path.join(TMP_DIR, filename) : path.join(DATA_DIR, filename);
}

export function ensureStorageFile(filename: string, defaultContent = "[]") {
  const targetFile = getStorageFilePath(filename);
  const sourceFile = path.join(DATA_DIR, filename);
  
  if (isProd) {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
    if (!fs.existsSync(targetFile)) {
      if (fs.existsSync(sourceFile)) {
        fs.copyFileSync(sourceFile, targetFile);
      } else {
        fs.writeFileSync(targetFile, defaultContent, "utf-8");
      }
    }
  } else {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(targetFile)) {
      fs.writeFileSync(targetFile, defaultContent, "utf-8");
    }
  }
  return targetFile;
}

export function readData<T>(filename: string): T {
  const file = ensureStorageFile(filename);
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function writeData<T>(filename: string, data: T) {
  const file = ensureStorageFile(filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}
