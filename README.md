# UNIKE Presentation

Apresentacao web premium em Next.js para a palestra da Unike sobre dados, IA e gestao de creators.

## Stack

- Next.js 14 (App Router)
- React 18
- Framer Motion
- CSS global
- Lucide React

## Requisitos

- Node.js 18.18+ 
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

## Deploy com GitHub + Vercel

Este projeto ja esta pronto para deploy padrao na Vercel.

### Configuracao esperada

- Framework: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output: padrao do Next.js
- Variaveis de ambiente: nenhuma obrigatoria para a versao online atual
- Importante: nao definir `UNIKE_OFFLINE=1` na Vercel

### Fluxo recomendado

1. Suba todo o repositorio para o GitHub.
2. Garanta que a pasta `public/prints/` esteja versionada junto com o codigo.
3. Importe o repositorio na Vercel.
4. Mantenha a deteccao automatica de framework como `Next.js`.
5. Publique.

## Observacoes

- A experiencia online principal usa o build normal do Next.js.
- O modo offline usa o script `npm run build:offline`, que aplica configuracao separada apenas para exportacao estatica.
- Videos, imagens e assets da apresentacao sao servidos diretamente da pasta `public/`.
