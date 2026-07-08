import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = resolve(root, "node_modules", "next", "dist", "bin", "next");
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || "3000";

const child = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", port], {
  cwd: root,
  env: process.env,
  stdio: "inherit"
});

for (const signal of ["SIGINT", "SIGTERM", "SIGQUIT"]) {
  process.on(signal, () => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
}

child.on("error", (error) => {
  console.error("Falha ao iniciar o servidor de produção.", error);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
