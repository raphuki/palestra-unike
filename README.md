# UNIKE Presentation

Apresentacao web premium em Next.js para a palestra da Unike sobre dados, IA e gestao de creators.

## Stack

- Next.js 14 (App Router)
- React 18
- Framer Motion
- CSS global
- Lucide React

## Requisitos

- Node.js 22.12+ 
- npm

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build de producao

```bash
npm run build
npm run start
```

## Plano B offline oficial

Para gerar a versao offline completa, com a mesma experiencia visual e funcional da versao online, use:

```bash
npm run package:offline
```

Esse comando:

1. gera o export offline da apresentacao;
2. embute todos os assets localmente;
3. empacota um app offline para Windows x64;
4. empacota um app offline para macOS Apple Silicon;
5. grava os artefatos finais em `dist/`.

Saidas esperadas:

- `dist/unike-apresentacao-offline-win-x64.zip`
- `dist/unike-apresentacao-offline-macos-arm64.zip`
- `dist/PLANO_B_OFFLINE.txt`

## Deploy com GitHub + Render

Este projeto esta preparado para deploy como Web Service no Render.

### Configuracao esperada

- Tipo do servico: `Web Service`
- Runtime: `Node`
- Root Directory: `.`
- Build Command: `npm run build`
- Start Command: `npm run start`
- Node Version: `22`
- Variaveis de ambiente: nenhuma obrigatoria para a versao online atual
- Health Check Path: `/`
- Auto Deploy: `On Commit`

### Fluxo recomendado

1. Suba todo o repositorio para o GitHub.
2. Garanta que a pasta `public/prints/` esteja versionada junto com o codigo.
3. Importe o repositorio no Render.
4. Crie um `Web Service` apontando para a branch principal.
5. Use as configuracoes acima ou sincronize o `render.yaml`.
6. Publique.

## Observacoes

- A experiencia online principal usa o build normal do Next.js.
- O script `npm run build:offline` continua disponivel apenas como exportacao estatica auxiliar.
- O pacote oficial para evento sem internet e `npm run package:offline`.
- Videos, imagens e assets da apresentacao sao servidos diretamente da pasta `public/`.
