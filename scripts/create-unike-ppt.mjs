import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const WIDTH = 1280;
const HEIGHT = 720;

const COLORS = {
  black: "#050505",
  white: "#FFFFFF",
  muted: "#A7A7A7",
  mutedDark: "#555555",
  cyan: "#75E6FF",
  cyanDeep: "#0E6E86",
  gold: "#E8C46D",
  goldLight: "#F6DF9A",
  violet: "#8B5CFF",
  violetLight: "#B58CFF",
  violetDeep: "#36035A",
  light: "#F7F6F1",
  lightWarm: "#F6F1E8",
  textDark: "#050505"
};

const noLine = { style: "solid", fill: "none", width: 0 };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1 || !process.argv[index + 1]) return fallback;
  return process.argv[index + 1];
}

function addText(slide, text, position, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name: style.name,
    position,
    fill: "none",
    line: noLine
  });
  shape.text = text;
  shape.text.style = {
    fontSize: style.fontSize ?? 38,
    bold: style.bold ?? false,
    color: style.color ?? COLORS.white,
    alignment: style.alignment ?? "left",
    italic: style.italic ?? false
  };
  return shape;
}

function addRect(slide, position, fill, options = {}) {
  const geometry = options.geometry ?? "roundRect";
  const shapeOptions = {
    geometry,
    name: options.name,
    position,
    fill,
    line: options.line ?? noLine,
    shadow: options.shadow
  };

  if (["rect", "textbox", "roundRect"].includes(geometry)) {
    shapeOptions.borderRadius = options.borderRadius ?? 18;
  }

  return slide.shapes.add({
    ...shapeOptions
  });
}

function addGlow(slide, color, position, opacity = 24) {
  slide.shapes.add({
    geometry: "ellipse",
    position,
    fill: `radial(${color}/${opacity} 0%, ${color}/0 72%)`,
    line: noLine
  });
}

function setBg(slide, fill = COLORS.black) {
  slide.background.fill = fill;
}

function darkSlide(presentation, fill = COLORS.black) {
  const slide = presentation.slides.add();
  setBg(slide, fill);
  return slide;
}

function lightSlide(presentation, fill = COLORS.light) {
  const slide = presentation.slides.add();
  setBg(slide, fill);
  return slide;
}

function addTitle(slide, text, color = COLORS.white, top = 94, fontSize = 74) {
  return addText(slide, text, { left: 84, top, width: 1112, height: 120 }, {
    fontSize,
    bold: true,
    color,
    alignment: "center"
  });
}

function addSubtitle(slide, text, color = COLORS.muted, top = 292, fontSize = 34) {
  return addText(slide, text, { left: 168, top, width: 944, height: 180 }, {
    fontSize,
    color,
    alignment: "center"
  });
}

function addLineGroup(slide, lines, color = COLORS.muted, top = 284, fontSize = 33) {
  return addSubtitle(slide, lines.join("\n"), color, top, fontSize);
}

function addEyebrow(slide, text, color = "#FFFFFF80") {
  return addText(slide, text.toUpperCase(), { left: 84, top: 64, width: 360, height: 32 }, {
    fontSize: 15,
    bold: true,
    color
  });
}

function addFooterNumber(slide, n) {
  addText(slide, String(n).padStart(2, "0"), { left: 1160, top: 650, width: 58, height: 24 }, {
    fontSize: 14,
    color: "#FFFFFF55",
    alignment: "right"
  });
}

function addLightFooterNumber(slide, n) {
  addText(slide, String(n).padStart(2, "0"), { left: 1160, top: 650, width: 58, height: 24 }, {
    fontSize: 14,
    color: "#05050555",
    alignment: "right"
  });
}

function addSoftwareDots(slide, left, top) {
  const colors = ["#FF5F57", "#FEBC2E", "#28C840"];
  colors.forEach((color, index) => {
    slide.shapes.add({
      geometry: "ellipse",
      position: { left: left + index * 22, top, width: 10, height: 10 },
      fill: color,
      line: noLine
    });
  });
}

function addMetricCard(slide, x, title, words, color) {
  addGlow(slide, color, { left: x - 86, top: 202, width: 360, height: 340 }, 19);
  addRect(slide, { left: x, top: 246, width: 320, height: 260 }, "#0E0E10/86", {
    line: { style: "solid", fill: `${color}/45`, width: 1.2 },
    borderRadius: 18,
    shadow: "shadow-xl"
  });
  addText(slide, title, { left: x + 28, top: 286, width: 264, height: 52 }, {
    fontSize: 36,
    bold: true,
    color
  });
  addText(slide, words.join("\n"), { left: x + 30, top: 364, width: 260, height: 110 }, {
    fontSize: 26,
    color: COLORS.white,
    alignment: "left"
  });
}

async function addImage(slide, filePath, contentType, position, alt, fit = "contain") {
  const blob = await fs.readFile(filePath);
  slide.images.add({
    blob,
    contentType,
    alt,
    fit,
    position,
    geometry: "roundRect",
    borderRadius: 16
  });
}

async function readChaosWords(projectRoot) {
  const source = await fs.readFile(path.join(projectRoot, "components", "chaos-words.js"), "utf8");
  const all = [...source.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const excluded = new Set(["operational", "human", "strategic"]);
  return [...new Set(all)].filter((word) => !excluded.has(word));
}

function placeChaosWords(slide, words) {
  const focus = new Set(["Diamantes", "Horas", "Campanhas", "Incentivos", "Humor", "Eventos", "Guifters"]);
  const selected = words.slice(0, 330);

  selected.forEach((word, index) => {
    const isFocus = focus.has(word);
    const mega = isFocus || index % 61 === 0 || index % 89 === 0;
    const size = mega ? 86 + ((index * 11) % 62) : isFocus ? 70 : 13 + ((index * 17) % 34);
    const desiredWidth = Math.max(150, size * word.length * 0.72);
    const desiredHeight = Math.max(38, size * 1.12);
    const width = Math.min(desiredWidth, WIDTH - 24);
    const height = Math.min(desiredHeight, HEIGHT - 18);
    const rawLeft = (index * 83 + (index % 17) * 41) % Math.max(1, WIDTH - Math.round(width));
    const rawTop = (index * 61 + (index % 23) * 37) % Math.max(1, HEIGHT - Math.round(height));
    const left = Math.max(8, Math.min(WIDTH - width - 8, rawLeft));
    const top = Math.max(6, Math.min(HEIGHT - height - 6, rawTop));
    const opacity = mega ? 0.92 : isFocus ? 0.86 : 0.24 + ((index % 5) * 0.1);
    const color = isFocus ? COLORS.white : index % 5 === 0 ? "#FFFFFF" : "#DADADA";
    const shape = addText(slide, word, {
      left,
      top,
      width,
      height
    }, {
      fontSize: size,
      bold: mega || isFocus,
      color: `${color}/${Math.round(opacity * 100)}`
    });
    if (mega || isFocus) shape.bringToFront();
  });

  addGlow(slide, COLORS.white, { left: -140, top: -110, width: 1580, height: 940 }, 8);
}

async function buildDeck(projectRoot, finalPptx, descriptivoPath) {
  await fs.mkdir(path.dirname(finalPptx), { recursive: true });

  const presentation = Presentation.create({
    slideSize: { width: WIDTH, height: HEIGHT }
  });

  const logoPath = path.join(projectRoot, "public", "prints", "unike-logo-glow.png");
  const crmPrintPath = path.join(projectRoot, "public", "prints", "crm-dashboard-print.png");
  const chaosWords = await readChaosWords(projectRoot);

  // 1
  {
    const slide = darkSlide(presentation);
    addGlow(slide, COLORS.white, { left: 365, top: 170, width: 550, height: 360 }, 14);
    addText(slide, "UNIKE", { left: 120, top: 270, width: 1040, height: 150 }, {
      fontSize: 120,
      bold: true,
      color: COLORS.white,
      alignment: "center"
    });
    addFooterNumber(slide, 1);
  }

  // 2
  {
    const slide = darkSlide(presentation, "linear(140deg, #050505 0%, #100B08 54%, #1B1306 100%)");
    addGlow(slide, COLORS.gold, { left: -170, top: 80, width: 620, height: 520 }, 18);
    addEyebrow(slide, "Entrada Raphael");
    addText(slide, "DADOS", { left: 96, top: 178, width: 410, height: 120 }, {
      fontSize: 98,
      bold: true,
      color: COLORS.cyan
    });
    addText(slide, "não mudam empresas.", { left: 496, top: 204, width: 650, height: 96 }, {
      fontSize: 58,
      color: COLORS.muted
    });
    addText(slide, "Decisões", { left: 94, top: 386, width: 560, height: 116 }, {
      fontSize: 98,
      bold: true,
      color: COLORS.gold
    });
    addText(slide, "mudam.", { left: 605, top: 408, width: 380, height: 90 }, {
      fontSize: 74,
      color: COLORS.white
    });
    addFooterNumber(slide, 2);
  }

  // 3
  {
    const slide = darkSlide(presentation);
    addText(slide, "74%", { left: 80, top: 150, width: 1120, height: 210 }, {
      fontSize: 194,
      bold: true,
      color: COLORS.white,
      alignment: "center"
    });
    addSubtitle(slide, "Sem contexto, isso não significa nada.", COLORS.muted, 425, 34);
    addFooterNumber(slide, 3);
  }

  // 4
  {
    const slide = darkSlide(presentation);
    addText(slide, "74%", { left: 80, top: 150, width: 1120, height: 210 }, {
      fontSize: 194,
      bold: true,
      color: COLORS.white,
      alignment: "center"
    });
    addSubtitle(slide, "das mensagens enviadas para recrutamento não receberam resposta.", COLORS.muted, 425, 33);
    addFooterNumber(slide, 4);
  }

  // 5
  {
    const slide = darkSlide(presentation, "linear(145deg, #050505 0%, #100E05 58%, #1D1604 100%)");
    addGlow(slide, COLORS.goldLight, { left: 396, top: 190, width: 488, height: 330 }, 21);
    addTitle(slide, "A pergunta que mudou tudo", COLORS.white, 150, 64);
    addText(slide, "Por quê?", { left: 160, top: 312, width: 960, height: 170 }, {
      fontSize: 136,
      bold: true,
      color: COLORS.goldLight,
      alignment: "center"
    });
    addFooterNumber(slide, 5);
  }

  // 6
  {
    const slide = darkSlide(presentation, "linear(145deg, #050505 0%, #071015 58%, #0A1720 100%)");
    addGlow(slide, COLORS.cyan, { left: 760, top: 110, width: 420, height: 430 }, 13);
    addTitle(slide, "O que fizemos", COLORS.white, 80, 68);
    const steps = ["Analisamos os dados", "Mensagem, Algoritmo e Perfis", "Padrões", "Treinamentos"];
    steps.forEach((step, index) => {
      const y = 245 + index * 82;
      addRect(slide, { left: 285, top: y, width: 710, height: 58 }, index === 0 ? "#FFFFFF/10" : "#FFFFFF/06", {
        line: { style: "solid", fill: "#FFFFFF/13", width: 1 },
        borderRadius: 16
      });
      addText(slide, step, { left: 320, top: y + 10, width: 640, height: 34 }, {
        fontSize: 30,
        bold: index === 0,
        color: index === 0 ? COLORS.white : COLORS.muted,
        alignment: "center"
      });
    });
    addFooterNumber(slide, 6);
  }

  // 7
  {
    const slide = lightSlide(presentation, COLORS.light);
    addGlow(slide, COLORS.goldLight, { left: 370, top: 120, width: 520, height: 360 }, 20);
    addText(slide, "74% → 55%", { left: 120, top: 152, width: 1040, height: 170 }, {
      fontSize: 138,
      bold: true,
      color: COLORS.textDark,
      alignment: "center"
    });
    addLineGroup(slide, [
      "Os dados não fizeram o trabalho.",
      "Pessoas fizeram.",
      "Mas os dados mostraram o caminho."
    ], "#303030", 390, 31);
    addLightFooterNumber(slide, 7);
  }

  // 8
  {
    const slide = lightSlide(presentation, COLORS.lightWarm);
    addGlow(slide, COLORS.violetLight, { left: 870, top: 85, width: 400, height: 450 }, 13);
    addTitle(slide, "Esse era apenas um processo.", COLORS.textDark, 170, 72);
    addSubtitle(slide, "E quando olhamos para toda a operação?", "#303030", 342, 38);
    addLightFooterNumber(slide, 8);
  }

  // 9
  {
    const slide = darkSlide(presentation);
    addGlow(slide, COLORS.white, { left: -130, top: -80, width: 760, height: 470 }, 9);
    placeChaosWords(slide, chaosWords);
    addRect(slide, { left: 46, top: 42, width: 448, height: 78 }, "#050505/72", {
      line: { style: "solid", fill: "#FFFFFF/12", width: 1 },
      borderRadius: 12
    });
    addText(slide, "O caos dos dados", { left: 70, top: 59, width: 398, height: 42 }, {
      fontSize: 36,
      bold: true,
      color: COLORS.white
    });
    addFooterNumber(slide, 9);
  }

  // 10
  {
    const slide = lightSlide(presentation, COLORS.white);
    addTitle(slide, "O problema nunca foi ter dados.", COLORS.textDark, 170, 74);
    addSubtitle(slide, "O problema sempre foi transformar dados em decisões.", "#303030", 348, 39);
    addLightFooterNumber(slide, 10);
  }

  // 11
  {
    const slide = lightSlide(presentation, COLORS.white);
    addTitle(slide, "Dado não é só número.", COLORS.cyanDeep, 170, 82);
    addSubtitle(slide, "Dado é qualquer informação que ajuda a decidir melhor.", "#303030", 350, 38);
    addLightFooterNumber(slide, 11);
  }

  // 12
  {
    const slide = darkSlide(presentation, "linear(115deg, #050505 0%, #090512 62%, #13091F 100%)");
    addGlow(slide, COLORS.violet, { left: 330, top: 84, width: 620, height: 520 }, 18);
    addTitle(slide, "Os 3 tipos de dados que olhamos", COLORS.white, 74, 58);
    addMetricCard(slide, 120, "Operacionais", ["Diamantes", "Horas", "Ganhos"], COLORS.cyan);
    addMetricCard(slide, 480, "Humanos", ["Comportamento", "Motivação", "Relacionamento"], COLORS.gold);
    addMetricCard(slide, 840, "Estratégicos", ["Tabelas", "Campanhas", "Tendências"], COLORS.violetLight);
    addFooterNumber(slide, 12);
  }

  // 13
  {
    const slide = lightSlide(presentation, COLORS.light);
    addTitle(slide, "Na Unike, dados também são pessoas.", COLORS.textDark, 122, 69);
    addLineGroup(slide, [
      "Um creator que responde menos.",
      "Um colaborador sobrecarregado.",
      "Uma mudança de comportamento.",
      "Tudo isso é informação."
    ], "#303030", 314, 32);
    addLightFooterNumber(slide, 13);
  }

  // 14
  {
    const slide = lightSlide(presentation, COLORS.light);
    addTitle(slide, "E dados também são Estratégicos.", COLORS.cyanDeep, 140, 72);
    addLineGroup(slide, [
      "Quando o TikTok muda uma tabela, uma missão ou uma campanha...",
      "...ele está sinalizando oportunidades."
    ], "#303030", 346, 34);
    addLightFooterNumber(slide, 14);
  }

  // 15
  {
    const slide = darkSlide(presentation, "radial(#261148 0%, #050505 70%)");
    addGlow(slide, COLORS.violet, { left: 420, top: 110, width: 440, height: 440 }, 23);
    addTitle(slide, "A filosofia da Unike", COLORS.white, 138, 78);
    addLineGroup(slide, [
      "Não queremos transformar Creator Managers em analistas profissionais.",
      "Queremos fazer os dados conversarem com quem entende de pessoas."
    ], COLORS.muted, 350, 32);
    addFooterNumber(slide, 15);
  }

  // 16
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #120C05 55%, #201503 100%)");
    addGlow(slide, COLORS.gold, { left: 368, top: 150, width: 545, height: 370 }, 20);
    addEyebrow(slide, "Entrada Andressa");
    addTitle(slide, "Decisões", COLORS.gold, 214, 112);
    addSubtitle(slide, "Como essa filosofia acontece na prática.", COLORS.muted, 395, 36);
    addFooterNumber(slide, 16);
  }

  // 17
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #0B0615 66%, #16072B 100%)");
    addGlow(slide, COLORS.violet, { left: 820, top: 100, width: 430, height: 420 }, 18);
    addTitle(slide, "Na prática, dados ajudam a enxergar antes.", COLORS.white, 84, 62);
    addLineGroup(slide, [
      "Quem precisa de ajuda.",
      "Quem está crescendo.",
      "Quem está em risco.",
      "Quem merece mais atenção.",
      "O que precisa mudar?"
    ], COLORS.muted, 290, 33);
    addFooterNumber(slide, 17);
  }

  // 18
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #031014 70%, #061E25 100%)");
    addGlow(slide, COLORS.cyan, { left: 72, top: 110, width: 480, height: 410 }, 16);
    addTitle(slide, "Não analisamos apenas creators.", COLORS.white, 158, 76);
    addSubtitle(slide, "Também analisamos colaboradores, processos e sinais da operação.", COLORS.muted, 348, 35);
    addFooterNumber(slide, 18);
  }

  // 19
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #111006 65%, #191207 100%)");
    addGlow(slide, COLORS.gold, { left: 790, top: 120, width: 430, height: 390 }, 14);
    addTitle(slide, "Ler o TikTok antes dos outros.", COLORS.white, 124, 74);
    addLineGroup(slide, [
      "Cada nova tabela, missão ou campanha mostra o que a plataforma está incentivando.",
      "Aprender a interpretar esses sinais cria oportunidades."
    ], COLORS.muted, 342, 31);
    addFooterNumber(slide, 19);
  }

  // 20
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #0B0615 66%, #16072B 100%)");
    addGlow(slide, COLORS.violet, { left: 390, top: 172, width: 500, height: 360 }, 17);
    addTitle(slide, "O desafio é a escala.", COLORS.white, 174, 86);
    addLineGroup(slide, [
      "Quanto maior a operação...",
      "...mais difícil fica transformar informação em ação rapidamente."
    ], COLORS.muted, 365, 34);
    addFooterNumber(slide, 20);
  }

  // 21
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #031116 58%, #061F2B 100%)");
    addGlow(slide, COLORS.cyan, { left: 380, top: 110, width: 520, height: 460 }, 21);
    addTitle(slide, "Foi aí que a IA entrou.", COLORS.white, 178, 86);
    addLineGroup(slide, ["Não para substituir pessoas.", "Para acelerar decisões."], COLORS.muted, 362, 38);
    addFooterNumber(slide, 21);
  }

  // 22
  {
    const slide = darkSlide(presentation, "linear(145deg, #050505 0%, #080A0E 52%, #0B0712 100%)");
    addGlow(slide, COLORS.violet, { left: 700, top: 40, width: 520, height: 590 }, 16);
    addText(slide, "Inteligência Unike", { left: 58, top: 34, width: 720, height: 64 }, {
      fontSize: 52,
      bold: true,
      color: COLORS.white
    });
    addText(slide, "Como usamos IA hoje a nosso favor.", { left: 60, top: 100, width: 620, height: 36 }, {
      fontSize: 23,
      color: COLORS.muted
    });
    addRect(slide, { left: 58, top: 160, width: 890, height: 500 }, "#0B0B0D/94", {
      line: { style: "solid", fill: "#FFFFFF/16", width: 1.1 },
      borderRadius: 18,
      shadow: "shadow-xl"
    });
    addSoftwareDots(slide, 80, 182);
    addRect(slide, { left: 78, top: 212, width: 850, height: 418 }, COLORS.white, {
      geometry: "rect",
      line: { style: "solid", fill: "#FFFFFF/5", width: 1 },
      borderRadius: 0
    });
    await addImage(slide, crmPrintPath, "image/png", { left: 92, top: 225, width: 822, height: 390 }, "Print do CRM Unike", "contain");

    addRect(slide, { left: 978, top: 160, width: 244, height: 500 }, "#0D0D10/88", {
      line: { style: "solid", fill: "#FFFFFF/15", width: 1 },
      borderRadius: 18,
      shadow: "shadow-lg"
    });
    const items = [
      ["CRM Unike", COLORS.violetLight],
      ["ChatGPT", "#6EE7D8"],
      ["Ferramentas Internas", "#70B7FF"],
      ["Automações", COLORS.violetLight],
      ["Análise de Dados", COLORS.cyan]
    ];
    items.forEach(([label, color], index) => {
      const top = 190 + index * 82;
      addRect(slide, { left: 1000, top, width: 200, height: 58 }, index === 0 ? `${COLORS.violet}/17` : "#FFFFFF/04", {
        line: { style: "solid", fill: index === 0 ? `${COLORS.violetLight}/75` : "#FFFFFF/12", width: 1 },
        borderRadius: 10
      });
      addRect(slide, { left: 1016, top: top + 19, width: 10, height: 10 }, color, {
        geometry: "ellipse",
        line: noLine,
        borderRadius: 0
      });
      addText(slide, label, { left: 1038, top: top + 15, width: 150, height: 30 }, {
        fontSize: 19,
        bold: index === 0,
        color: COLORS.white
      });
    });
    addFooterNumber(slide, 22);
  }

  // 23
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #031014 70%, #061E25 100%)");
    addGlow(slide, COLORS.cyan, { left: 398, top: 160, width: 485, height: 360 }, 16);
    addTitle(slide, "IA não faz o trabalho.", COLORS.white, 196, 88);
    addSubtitle(slide, "Ela potencializa quem sabe decidir.", COLORS.muted, 382, 38);
    addFooterNumber(slide, 23);
  }

  // 24
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #131108 65%, #1C1505 100%)");
    addGlow(slide, COLORS.goldLight, { left: 720, top: 94, width: 460, height: 410 }, 18);
    const title = addText(slide, "Menos tempo procurando\ninformação.", { left: 120, top: 170, width: 1040, height: 178 }, {
      fontSize: 72,
      bold: true,
      color: COLORS.white,
      alignment: "center"
    });
    title.text.get("tempo").style = { fontSize: 72, bold: true, color: COLORS.goldLight };
    addSubtitle(slide, "Mais tempo decidindo o que fazer com ela.", COLORS.muted, 362, 38);
    addFooterNumber(slide, 24);
  }

  // 25
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #130D05 58%, #211505 100%)");
    addGlow(slide, COLORS.gold, { left: 120, top: 120, width: 470, height: 420 }, 16);
    addTitle(slide, "O que isso muda para vocês?", COLORS.white, 108, 74);
    addLineGroup(slide, [
      "Quando uma operação já movimenta milhões de diamantes...",
      "...a diferença não está apenas em trabalhar mais.",
      "Esta em decidir melhor."
    ], COLORS.muted, 332, 32);
    addFooterNumber(slide, 25);
  }

  // 26
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #110F06 65%, #1A1404 100%)");
    addGlow(slide, COLORS.goldLight, { left: 365, top: 120, width: 550, height: 390 }, 19);
    addTitle(slide, "Automatizar a coleta e análise de dados traz", COLORS.white, 98, 54);
    addText(slide, "TEMPO", { left: 110, top: 240, width: 1060, height: 150 }, {
      fontSize: 132,
      bold: true,
      color: COLORS.goldLight,
      alignment: "center"
    });
    addLineGroup(slide, [
      "Tempo para olhar onde realmente importa.",
      "Creators.",
      "Colaboradores.",
      "Oportunidades.",
      "Mudanças do mercado.",
      "Tomadas de decisão."
    ], COLORS.muted, 438, 25);
    addFooterNumber(slide, 26);
  }

  // 27
  {
    const slide = darkSlide(presentation, "linear(130deg, #050505 0%, #0B0615 66%, #16072B 100%)");
    addGlow(slide, COLORS.violet, { left: 820, top: 110, width: 430, height: 420 }, 17);
    addTitle(slide, "Tempo para desenvolver creators.", COLORS.white, 150, 72);
    addLineGroup(slide, [
      "Tempo para apoiar colaboradores.",
      "Tempo para tomar decisões melhores."
    ], COLORS.muted, 348, 36);
    addFooterNumber(slide, 27);
  }

  // 28
  {
    const slide = darkSlide(presentation, "linear(135deg, #050505 0%, #031014 70%, #061E25 100%)");
    addGlow(slide, COLORS.cyan, { left: 390, top: 145, width: 500, height: 400 }, 17);
    addTitle(slide, "A maior ferramenta da Unike", COLORS.white, 118, 78);
    addLineGroup(slide, [
      "Nossa experiência...",
      "aliada à IA...",
      "aos dados...",
      "e principalmente às pessoas."
    ], COLORS.muted, 316, 36);
    addFooterNumber(slide, 28);
  }

  // 29
  {
    const slide = darkSlide(presentation);
    addGlow(slide, COLORS.violet, { left: 330, top: 90, width: 620, height: 500 }, 24);
    await addImage(slide, logoPath, "image/png", { left: 385, top: 95, width: 510, height: 510 }, "Logo UNIKE", "contain");
    addText(slide, "Ser único é o que nos conecta.", { left: 280, top: 540, width: 720, height: 54 }, {
      fontSize: 31,
      color: COLORS.violetLight,
      alignment: "center",
      italic: true
    });
    addFooterNumber(slide, 29);
  }

  const deck = await PresentationFile.exportPptx(presentation);
  await deck.save(finalPptx);
  if (descriptivoPath) {
    const repoDescription = await fs.readFile(path.join(projectRoot, "outputs", "descritivo-slides-unike.txt"), "utf8");
    await fs.writeFile(descriptivoPath, repoDescription);
  }
}

const projectRoot = path.resolve(argValue("--project-root", path.resolve(__dirname, "..")));
const finalPptx = path.resolve(argValue("--out", path.join(projectRoot, "outputs", "unike-apresentacao-offline.pptx")));
const descriptivoPath = argValue("--descritivo", path.join(projectRoot, "outputs", "descritivo-slides-unike.txt"));

buildDeck(projectRoot, finalPptx, descriptivoPath).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
