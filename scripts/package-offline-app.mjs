import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  renameSync,
  statSync,
  writeFileSync
} from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { packager } from "@electron/packager";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "dist");
const deliveryDir = resolve(distDir, "plan-b-offline");
const outDir = resolve(root, "out");
const offlineBuildDir = resolve(root, ".offline-build");
const stagingDir = resolve(offlineBuildDir, "electron-app");
const offlineShellDir = resolve(root, "offline", "electron");
const electronVersion = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).devDependencies.electron;

const targets = [
  {
    arch: "x64",
    artifactFolder: "unike-apresentacao-offline-win-x64",
    displayName: "Windows x64",
    executable: "UNIKE-Apresentacao.exe",
    platform: "win32",
    zipName: "unike-apresentacao-offline-win-x64.zip"
  },
  {
    arch: "arm64",
    artifactFolder: "unike-apresentacao-offline-macos-arm64",
    displayName: "macOS Apple Silicon",
    executable: "UNIKE-Apresentacao.app",
    platform: "darwin",
    zipName: "unike-apresentacao-offline-macos-arm64.zip"
  }
];

function runOfflineBuild() {
  execFileSync(
    process.execPath,
    [resolve(root, "node_modules", "next", "dist", "bin", "next"), "build"],
    {
      cwd: root,
      env: {
        ...process.env,
        UNIKE_OFFLINE: "1"
      },
      stdio: "inherit"
    }
  );
}

function ensureDir(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function prepareStagingDirectory() {
  rmSync(offlineBuildDir, { force: true, recursive: true });
  ensureDir(stagingDir);
  cpSync(offlineShellDir, stagingDir, { recursive: true });
  cpSync(outDir, resolve(stagingDir, "site"), { recursive: true });

  writeFileSync(
    resolve(stagingDir, "package.json"),
    JSON.stringify(
      {
        main: "main.cjs",
        name: "unike-apresentacao-offline",
        private: true,
        productName: "UNIKE-Apresentacao",
        version: "1.0.0"
      },
      null,
      2
    )
  );
}

function sha256(filePath) {
  const hash = createHash("sha256");
  hash.update(readFileSync(filePath));
  return hash.digest("hex");
}

function zipDirectory(sourcePath, outputZipPath, keepParent = true) {
  const cwd = dirname(sourcePath);
  const name = keepParent ? basename(sourcePath) : ".";

  rmSync(outputZipPath, { force: true });
  execFileSync("zip", ["-qr", outputZipPath, name], {
    cwd,
    stdio: "inherit"
  });
}

function zipMacAppBundle(sourcePath, outputZipPath) {
  rmSync(outputZipPath, { force: true });
  execFileSync(
    "ditto",
    ["-c", "-k", "--sequesterRsrc", "--keepParent", sourcePath, outputZipPath],
    { stdio: "inherit" }
  );
}

function writeInstructions(artifacts) {
  const lines = [
    "UNIKE - Plano B Offline Oficial",
    "",
    "Esta pasta contem a apresentacao offline completa, com as mesmas animacoes, videos, transicoes e navegacao da versao online.",
    "",
    "Pacotes gerados:"
  ];

  for (const artifact of artifacts) {
    lines.push(`- ${artifact.displayName}: ${artifact.zipName}`);
    lines.push(`  SHA256: ${artifact.sha256}`);
  }

  lines.push("");
  lines.push("Como usar no evento:");
  lines.push("1. Extraia o ZIP da plataforma desejada.");
  lines.push("2. No Windows, abra UNIKE-Apresentacao.exe.");
  lines.push("3. No macOS, abra UNIKE-Apresentacao.app.");
  lines.push("4. Se o sistema avisar sobre app baixado da internet, libere a execucao manualmente uma unica vez.");
  lines.push("");
  lines.push("Observacao:");
  lines.push("- Esta versao nao depende de internet.");
  lines.push("- Nenhum asset precisa ser baixado no momento da execucao.");
  lines.push("- Nao altere a estrutura interna dos arquivos apos extrair.");
  lines.push("");

  writeFileSync(resolve(deliveryDir, "PLANO_B_OFFLINE.txt"), lines.join("\n"));
}

async function packageTargets() {
  ensureDir(distDir);
  rmSync(deliveryDir, { force: true, recursive: true });
  ensureDir(deliveryDir);
  const artifacts = [];

  for (const target of targets) {
    const packagedPaths = await packager({
      appBundleId: "com.unike.presentation.offline",
      arch: target.arch,
      asar: false,
      dir: stagingDir,
      electronVersion: electronVersion.replace(/^[^\d]*/, ""),
      name: "UNIKE-Apresentacao",
      out: deliveryDir,
      overwrite: true,
      platform: target.platform,
      prune: true,
      quiet: true
    });

    const packagedPath = packagedPaths[0];
    const renamedPath = resolve(deliveryDir, target.artifactFolder);

    if (packagedPath !== renamedPath) {
      rmSync(renamedPath, { force: true, recursive: true });
      renameSync(packagedPath, renamedPath);
    }

    const zipPath = resolve(deliveryDir, target.zipName);
    if (target.platform === "darwin") {
      zipMacAppBundle(resolve(renamedPath, target.executable), zipPath);
    } else {
      zipDirectory(renamedPath, zipPath);
    }

    const artifactStat = statSync(zipPath);
    artifacts.push({
      bytes: artifactStat.size,
      displayName: target.displayName,
      sha256: sha256(zipPath),
      zipName: target.zipName
    });
  }

  return artifacts;
}

async function main() {
  console.log("Gerando export offline da apresentacao...");
  runOfflineBuild();

  if (!existsSync(outDir)) {
    throw new Error("A pasta out nao foi gerada pelo build offline.");
  }

  console.log("Montando shell offline empacotado...");
  prepareStagingDirectory();

  console.log("Empacotando apps offline para Windows e macOS...");
  const artifacts = await packageTargets();

  writeInstructions(artifacts);

  console.log("");
  console.log("Pacotes offline gerados com sucesso:");
  for (const artifact of artifacts) {
    console.log(`- ${artifact.displayName}: ${artifact.zipName} (${artifact.bytes} bytes)`);
    console.log(`  SHA256: ${artifact.sha256}`);
  }
  console.log(`- Instrucoes: ${resolve(deliveryDir, "PLANO_B_OFFLINE.txt")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
