import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "out");
const distDir = resolve(root, "dist");
const packageDir = resolve(distDir, "unike-apresentacao-offline");
const zipPath = resolve(distDir, "unike-apresentacao-offline.zip");

if (!existsSync(outDir)) {
  throw new Error("A pasta out nao existe. Rode o build offline antes de empacotar.");
}

rmSync(packageDir, { force: true, recursive: true });
rmSync(zipPath, { force: true });
mkdirSync(distDir, { recursive: true });
cpSync(outDir, packageDir, { recursive: true });

copyFileSync(resolve(packageDir, "index.html"), resolve(packageDir, "ABRIR_APRESENTACAO.html"));

writeFileSync(
  resolve(packageDir, "LEIA-ME.txt"),
  [
    "UNIKE - Apresentacao offline",
    "",
    "Como abrir:",
    "1. Abra a pasta unike-apresentacao-offline.",
    "2. Dê dois cliques em ABRIR_APRESENTACAO.html.",
    "3. Use as setas do teclado ou espaco para passar as cenas.",
    "",
    "Atalhos:",
    "Seta direita / Espaco: proxima cena",
    "Seta esquerda: cena anterior",
    "Home: primeira cena",
    "End: ultima cena",
    "B: blackout",
    "M: menu lateral",
    "",
    "Importante:",
    "Mantenha todos os arquivos e pastas juntos. Nao envie apenas o HTML.",
    "Se algum navegador bloquear arquivos locais, abra esta pasta com um servidor simples ou envie o arquivo ZIP inteiro.",
    ""
  ].join("\n")
);

execFileSync("zip", ["-qr", zipPath, "unike-apresentacao-offline"], { cwd: distDir });

console.log(`Pacote offline criado em: ${packageDir}`);
console.log(`ZIP criado em: ${zipPath}`);
