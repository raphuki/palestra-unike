const { app, BrowserWindow, shell } = require("electron");
const { createReadStream, existsSync, statSync } = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const siteRoot = path.resolve(__dirname, "site");
const windowTitle = "UNIKE | Dados, IA e Decisoes";

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

let mainWindow = null;
let localServer = null;

function sendError(response, code, message) {
  response.writeHead(code, {
    "Cache-Control": "no-store",
    "Content-Type": "text/plain; charset=utf-8"
  });
  response.end(message);
}

function getFilePathFromRequest(urlPath) {
  const decodedPath = decodeURIComponent(urlPath);
  const normalizedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(siteRoot, normalizedPath));

  if (!filePath.startsWith(siteRoot)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    return path.join(filePath, "index.html");
  }

  if (existsSync(filePath)) {
    return filePath;
  }

  if (!path.extname(filePath)) {
    return path.join(siteRoot, "index.html");
  }

  return null;
}

function serveFile(filePath, request, response) {
  if (!existsSync(filePath)) {
    sendError(response, 404, "Arquivo nao encontrado.");
    return;
  }

  const stats = statSync(filePath);
  const extname = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[extname] || "application/octet-stream";
  const headers = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "Content-Length": stats.size,
    "Content-Type": mimeType
  };

  const range = request.headers.range;
  if (range && (mimeType.startsWith("video/") || mimeType.startsWith("audio/"))) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (!match) {
      sendError(response, 416, "Range invalido.");
      return;
    }

    const start = match[1] ? Number.parseInt(match[1], 10) : 0;
    const end = match[2] ? Number.parseInt(match[2], 10) : stats.size - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= stats.size) {
      sendError(response, 416, "Range fora do arquivo.");
      return;
    }

    response.writeHead(206, {
      ...headers,
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stats.size}`
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath, { start, end }).pipe(response);
    return;
  }

  response.writeHead(200, headers);

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  createReadStream(filePath).pipe(response);
}

function startStaticServer() {
  return new Promise((resolve, reject) => {
    if (!existsSync(siteRoot)) {
      reject(new Error(`Pasta do site offline nao encontrada em ${siteRoot}`));
      return;
    }

    localServer = http.createServer((request, response) => {
      try {
        const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
        const filePath = getFilePathFromRequest(requestUrl.pathname);

        if (!filePath) {
          sendError(response, 404, "Arquivo nao encontrado.");
          return;
        }

        serveFile(filePath, request, response);
      } catch (error) {
        sendError(response, 500, `Erro ao abrir a apresentacao offline: ${error.message}`);
      }
    });

    localServer.on("error", reject);
    localServer.listen(0, "127.0.0.1", () => {
      const { port } = localServer.address();
      resolve(`http://127.0.0.1:${port}/`);
    });
  });
}

async function createMainWindow() {
  const localUrl = await startStaticServer();

  mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    backgroundColor: "#050505",
    minHeight: 720,
    minWidth: 1180,
    show: false,
    title: windowTitle,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.maximize();
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  await mainWindow.loadURL(localUrl);
}

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (localServer) {
    localServer.close();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createMainWindow();
  }
});
