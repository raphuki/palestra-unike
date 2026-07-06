"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { BrainCircuit, Database, Sparkles, UsersRound } from "lucide-react";
import { useEffect, useMemo } from "react";
import { presentationAssets } from "./presentation-assets";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(14px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, delay, ease }
  })
};

function SceneShell({ children, className = "" }) {
  return <div className={`sceneShell ${className}`}>{children}</div>;
}

function Eyebrow({ children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="eyebrow">
      {children}
    </motion.div>
  );
}

function Title({ children, className = "", delay = 0 }) {
  return (
    <motion.h1
      className={`title ${className}`}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {children}
    </motion.h1>
  );
}

function Subtitle({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      className={`subtitle ${className}`}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

function LineGroup({ lines, delay = 0.18, className = "" }) {
  return (
    <Subtitle className={className} delay={delay}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </Subtitle>
  );
}

function Scene1() {
  return (
    <SceneShell className="center stacked warmScene openingScene">
      <Eyebrow>Entrada Raphael</Eyebrow>
      <motion.h1
        className="unikeMark"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease }}
      >
        UNIKE
      </motion.h1>
    </SceneShell>
  );
}

function Scene5() {
  return (
    <SceneShell className="statementScene">
      <div className="transformWord" aria-label="DADOS não mudam empresas. Decisões mudam.">
        <motion.span
          className="transformGhost"
          initial={{ opacity: 1, filter: "blur(0px)" }}
          animate={{ opacity: 0, filter: "blur(18px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          UNIKE
        </motion.span>
        <motion.div
          className="sentenceLine"
          initial={{ x: "28vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, delay: 0.88, ease }}
        >
          <motion.span
            className="dataWord"
            initial={{ opacity: 0, filter: "blur(18px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
          >
            DADOS
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.72, delay: 1.55, ease }}
          >
            não mudam empresas.
          </motion.span>
        </motion.div>
      </div>
      <motion.div
        className="decisionLine"
        initial={{ opacity: 0, y: 32, filter: "blur(16px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 2.1, ease }}
      >
        <span>Decisões</span> mudam.
      </motion.div>
    </SceneShell>
  );
}

function BigNumberContext({ stage, subtitle }) {
  return (
    <SceneShell className="numberContext">
      <motion.div
        className="bigNumber fixedNumber"
        initial={{ opacity: 0, scale: 0.92, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.95, ease }}
      >
        74%
      </motion.div>
      {stage > 0 || subtitle ? (
        <Subtitle className="numberSubtitle" delay={0.08}>
          {subtitle}
        </Subtitle>
      ) : null}
    </SceneShell>
  );
}

function Scene6({ stage }) {
  return <BigNumberContext stage={stage} subtitle={stage > 0 ? "Sem contexto, isso não significa nada." : ""} />;
}

function Scene7() {
  return (
    <BigNumberContext
      stage={1}
      subtitle="das mensagens enviadas para recrutamento não receberam resposta."
    />
  );
}

function Scene8() {
  return (
    <SceneShell className="center stacked">
      <Title>A pergunta que mudou tudo</Title>
      <Subtitle className="why" delay={0.18}>Por quê?</Subtitle>
    </SceneShell>
  );
}

function Scene9({ stage }) {
  const steps = ["Analisamos os dados", "Mensagem, Algoritmo e Perfis", "Padrões", "Treinamentos"];
  return (
    <SceneShell className="timelineScene">
      <Title>O que fizemos</Title>
      <div className="timeline">
        {steps.map((step, stepIndex) => {
          const visible = stage > stepIndex;
          return (
            <motion.div
              className={visible ? "timelineStep visible" : "timelineStep"}
              key={step}
              animate={{
                opacity: visible ? 1 : 0.08,
                y: visible ? 0 : 18,
                filter: visible ? "blur(0px)" : "blur(10px)"
              }}
              transition={{ duration: 0.65, ease }}
            >
              <span className="timelineDot" />
              <span>{step}</span>
            </motion.div>
          );
        })}
      </div>
    </SceneShell>
  );
}

function CountNumber({ from, to }) {
  const value = useMotionValue(from);
  const rounded = useTransform(value, (latest) => `${Math.round(latest)}%`);

  useEffect(() => {
    const controls = animate(value, to, { duration: 1.8, ease });
    return controls.stop;
  }, [to, value]);

  return <motion.span>{rounded}</motion.span>;
}

function Scene10() {
  return (
    <SceneShell className="center stacked">
      <motion.div
        className="reduction"
        initial={{ opacity: 0, scale: 0.9, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease }}
      >
        <CountNumber from={74} to={55} />
      </motion.div>
      <LineGroup
        delay={1.05}
        className="compactLines"
        lines={[
          "Os dados não fizeram o trabalho.",
          "Pessoas fizeram.",
          "Mas os dados mostraram o caminho."
        ]}
      />
    </SceneShell>
  );
}

function Scene11() {
  return (
    <SceneShell className="center stacked">
      <Title>Esse era apenas um processo.</Title>
      <Subtitle delay={0.2}>E quando olhamos para toda a operação?</Subtitle>
    </SceneShell>
  );
}

const chaosWords = [
  { word: "Diamantes", focus: true },
  { word: "Horas", focus: true },
  { word: "Campanhas", focus: true },
  { word: "Incentivos", focus: true },
  { word: "Humor", focus: true },
  { word: "Eventos", focus: true },
  { word: "Guifters", focus: true },
  { word: "Horas de live", focus: true },
  { word: "Diamantes", focus: true },
  { word: "Campanhas", focus: true },
  { word: "Eventos", focus: true },
  { word: "Incentivos", focus: true },
  { word: "Humor", focus: true },
  { word: "Guifters", focus: true },
  { word: "Retenção" },
  { word: "Liga" },
  { word: "Power Ups" },
  { word: "Co-host" },
  { word: "Metas" },
  { word: "Ranking" },
  { word: "Creators" },
  { word: "Recrutamento" },
  { word: "Atendimento" },
  { word: "Colaboradores" },
  { word: "TikTok" },
  { word: "Pagamentos" },
  { word: "Frequência" },
  { word: "Oportunidades" },
  { word: "Risco" },
  { word: "Evolução" },
  { word: "Desenvolvimento" },
  { word: "Turnover" },
  { word: "Metas semanais" },
  { word: "Tabela" },
  { word: "Bônus" },
  { word: "Missões" },
  { word: "Lives" },
  { word: "Top creators" },
  { word: "Quedas" },
  { word: "Respostas" },
  { word: "Mensagens" },
  { word: "Onboarding" },
  { word: "Performance" },
  { word: "Sinais" },
  { word: "Atrasos" },
  { word: "Engajamento" },
  { word: "Comunidade" },
  { word: "Agenda" },
  { word: "Rotina" },
  { word: "Alertas" },
  { word: "Relatórios" },
  { word: "Análise" },
  { word: "Qualidade" },
  { word: "Crescimento" },
  { word: "Queda brusca" },
  { word: "Potencial" },
  { word: "Prioridade" },
  { word: "Saturação" },
  { word: "Histórico" },
  { word: "Conversas" },
  { word: "Feedback" },
  { word: "Conteúdo" },
  { word: "Alcance" },
  { word: "Timing" },
  { word: "Operação" },
  { word: "Escala" },
  { word: "Sinal fraco" },
  { word: "Decisão" }
];

function Scene12() {
  return (
    <SceneShell className="chaosScene">
      <Title className="chaosTitle">O caos dos dados</Title>
      <div className="chaosField">
        {chaosWords.map(({ word, focus }, index) => {
          const left = ((index * 19) % 118) - 9;
          const top = ((index * 31) % 108) - 9;
          const depth = index % 16;
          const size = focus ? 1.85 + ((index * 5) % 8) / 10 : 0.9 + ((index * 7) % 13) / 10;
          const driftX = ((index % 2 ? -1 : 1) * (80 + index * 9)) % 320;
          const driftY = ((index % 3 ? 1 : -1) * (58 + index * 7)) % 250;
          return (
            <motion.span
              className={focus ? "floatingWord focusWord" : "floatingWord"}
              key={`${word}-${index}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                zIndex: 10 + depth,
                fontSize: `clamp(${1.05 * size}rem, ${2.05 * size}vw, ${3.8 * size}rem)`,
                rotate: `${((index * 11) % 28) - 14}deg`
              }}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
              animate={{
                opacity: focus ? [0.42, 0.96, 0.22, 0.82] : [0.18, 0.7, 0.12, 0.5],
                x: [0, driftX, driftX * -0.45, 0],
                y: [0, driftY, driftY * -0.6, 0],
                scale: focus ? [1.06, 1.22, 0.98, 1.12] : [0.94, 1.12, 0.9, 1.02],
                filter: focus
                  ? ["blur(0px)", "blur(0px)", "blur(5px)", "blur(1px)"]
                  : ["blur(1px)", "blur(0px)", "blur(6px)", "blur(2px)"]
              }}
              transition={{
                duration: 5.4 + (index % 9) * 0.8,
                delay: index * 0.035,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </SceneShell>
  );
}

function Scene13() {
  return (
    <SceneShell className="center stacked">
      <Title>O problema nunca foi ter dados.</Title>
      <Subtitle delay={0.2}>O problema sempre foi transformar dados em decisões.</Subtitle>
    </SceneShell>
  );
}

function Scene14() {
  return (
    <SceneShell className="center stacked">
      <Title>Dado não é só número.</Title>
      <Subtitle delay={0.2}>Dado é qualquer informação que ajuda a decidir melhor.</Subtitle>
    </SceneShell>
  );
}

const dataCards = [
  {
    title: "Operacionais",
    glow: "cyan",
    icon: Database,
    words: ["Diamantes", "Horas", "Ganhos"]
  },
  {
    title: "Humanos",
    glow: "gold",
    icon: UsersRound,
    words: ["Comportamento", "Motivação", "Relacionamento"]
  },
  {
    title: "Estratégicos",
    glow: "white",
    icon: BrainCircuit,
    words: ["Tabelas", "Campanhas", "Tendências"]
  }
];

function Scene15() {
  return (
    <SceneShell className="dataTypesScene">
      <Title>Os 3 tipos de dados que olhamos</Title>
      <div className="dataCards">
        {dataCards.map(({ title, glow, icon: Icon, words }, index) => (
          <motion.div
            className={`dataCard ${glow}`}
            key={title}
            initial={{ opacity: 0, y: 28, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.12, ease }}
          >
            <Icon size={30} strokeWidth={1.35} />
            <h2>{title}</h2>
            <div>
              {words.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SceneShell>
  );
}

function Scene16() {
  return (
    <SceneShell className="center stacked humanScene">
      <Title>Na Unike, dados também são pessoas.</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Um creator que responde menos.",
          "Um colaborador sobrecarregado.",
          "Uma mudança de comportamento.",
          "Tudo isso é informação."
        ]}
      />
    </SceneShell>
  );
}

function Scene17() {
  return (
    <SceneShell className="center stacked">
      <Title>E dados também são Estratégicos.</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Quando o TikTok muda uma tabela, uma missão ou uma campanha...",
          "...ele está sinalizando oportunidades."
        ]}
      />
    </SceneShell>
  );
}

function Scene18() {
  return (
    <SceneShell className="center stacked">
      <Title>A filosofia da Unike</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Não queremos transformar Creator Managers em analistas profissionais.",
          "Queremos fazer os dados conversarem com quem entende de pessoas."
        ]}
      />
    </SceneShell>
  );
}

function Scene19() {
  return (
    <SceneShell className="center stacked warmScene">
      <Eyebrow>Entrada Andressa</Eyebrow>
      <Title className="goldTitle">Decisões</Title>
      <Subtitle delay={0.2}>Como essa filosofia acontece na prática.</Subtitle>
    </SceneShell>
  );
}

function Scene20() {
  return (
    <SceneShell className="center stacked">
      <Title>Na prática, dados ajudam a enxergar antes.</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Quem precisa de ajuda.",
          "Quem está crescendo.",
          "Quem está em risco.",
          "Quem merece mais atenção.",
          "O que precisa mudar?"
        ]}
      />
    </SceneShell>
  );
}

function Scene21() {
  return (
    <SceneShell className="center stacked">
      <Title>Não analisamos apenas creators.</Title>
      <Subtitle delay={0.2}>Também analisamos colaboradores, processos e sinais da operação.</Subtitle>
    </SceneShell>
  );
}

function Scene22() {
  return (
    <SceneShell className="center stacked">
      <Title>Ler o TikTok antes dos outros.</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Cada nova tabela, missão ou campanha mostra o que a plataforma está incentivando.",
          "Aprender a interpretar esses sinais cria oportunidades."
        ]}
      />
    </SceneShell>
  );
}

function Scene23() {
  return (
    <SceneShell className="center stacked">
      <Title>O desafio é a escala.</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Quanto maior a operação...",
          "...mais difícil fica transformar informação em ação rapidamente."
        ]}
      />
    </SceneShell>
  );
}

function Scene24() {
  return (
    <SceneShell className="center stacked aiScene">
      <Title>Foi aí que a IA entrou.</Title>
      <LineGroup delay={0.2} lines={["Não para substituir pessoas.", "Para acelerar decisões."]} />
    </SceneShell>
  );
}

const intelligenceItems = [
  "CRM Unike",
  "ChatGPT",
  "Ferramentas internas",
  "Automações",
  "Análise de dados",
  "Organização de informações",
  "Apoio à tomada de decisão"
];

function Scene25() {
  return (
    <SceneShell className="intelligenceScene">
      <Title>Inteligência Unike</Title>
      <Subtitle delay={0.18}>Como usamos IA hoje a nosso favor.</Subtitle>
      <div className="assetGrid">
        <AssetSlot className="primarySlot" asset={presentationAssets.scene25.primary} />
        <div className="intelligenceList">
          {intelligenceItems.map((item, index) => (
            <motion.div
              key={item}
              className="intelligenceItem"
              initial={{ opacity: 0, x: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.58, delay: 0.28 + index * 0.06, ease }}
            >
              <Sparkles size={16} strokeWidth={1.5} />
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

function AssetSlot({ asset, className = "" }) {
  return (
    <div className={`assetSlot ${asset?.type === "video" ? "videoSlot" : ""} ${className}`}>
      {asset?.type === "video" ? (
        <div className="windowBar" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <MediaAsset asset={asset} />
    </div>
  );
}

function MediaAsset({ asset }) {
  if (!asset) return null;
  if (asset.type === "video") {
    return (
      <video
        className="slotMedia"
        src={asset.src}
        aria-label={asset.alt}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return <img className="slotMedia" src={asset.src} alt={asset.alt} />;
}

function Scene26() {
  return (
    <SceneShell className="crmScene">
      <div className="screenRail">
        <motion.div
          className="crmScreen largeScreen"
          initial={{ opacity: 0, x: -34, filter: "blur(14px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease }}
        >
          <div className="windowBar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <MediaAsset asset={presentationAssets.scene26.large} />
        </motion.div>
        <motion.div
          className="crmScreen mediumScreen"
          initial={{ opacity: 0, y: 34, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
        >
          <MediaAsset asset={presentationAssets.scene26.medium} />
        </motion.div>
        <motion.div
          className="crmScreen smallScreen"
          initial={{ opacity: 0, x: 34, filter: "blur(14px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.32, ease }}
        >
          <MediaAsset asset={presentationAssets.scene26.small} />
        </motion.div>
      </div>
    </SceneShell>
  );
}

function Scene27() {
  return (
    <SceneShell className="center stacked">
      <Title>IA não faz o trabalho.</Title>
      <Subtitle delay={0.2}>Ela potencializa quem sabe decidir.</Subtitle>
    </SceneShell>
  );
}

function Scene28() {
  return (
    <SceneShell className="center stacked">
      <Title>Menos tempo procurando informação.</Title>
      <Subtitle delay={0.2}>Mais tempo decidindo o que fazer com ela.</Subtitle>
    </SceneShell>
  );
}

function Scene29() {
  return (
    <SceneShell className="center stacked warmScene">
      <Title>O que isso muda para vocês?</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Quando uma operação já movimenta milhões de diamantes...",
          "...a diferença não está apenas em trabalhar mais.",
          "Está em decidir melhor."
        ]}
      />
    </SceneShell>
  );
}

const letterMaps = {
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"]
};

function makeTempoParticles() {
  const letters = "TEMPO";
  const points = [];
  letters.split("").forEach((letter, letterIndex) => {
    const grid = letterMaps[letter];
    grid.forEach((row, y) => {
      row.split("").forEach((cell, x) => {
        if (cell !== "1") return;
        for (let dot = 0; dot < 3; dot += 1) {
          const jitterX = ((dot % 3) - 1) * 0.62;
          const jitterY = (dot - 1) * 0.42;
          points.push({
            id: `${letter}-${letterIndex}-${x}-${y}-${dot}`,
            left: 8 + letterIndex * 18 + x * 2.45 + jitterX,
            top: 19 + y * 8.5 + jitterY,
            scatterX: Math.sin(points.length * 2.71) * 420,
            scatterY: Math.cos(points.length * 1.93) * 240
          });
        }
      });
    });
  });
  return points;
}

function TempoParticles() {
  const particles = useMemo(makeTempoParticles, []);

  return (
    <div className="tempoParticles" aria-label="TEMPO">
      {particles.map((particle, index) => (
        <motion.span
          key={particle.id}
          className="tempoParticle"
          style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
          initial={{
            x: particle.scatterX,
            y: particle.scatterY,
            opacity: 0,
            scale: 0.25
          }}
          animate={{ x: 0, y: 0, opacity: 0.82, scale: 1 }}
          transition={{ duration: 1.65, delay: 0.05 + (index % 32) * 0.018, ease }}
        />
      ))}
      <motion.div
        className="tempoFinal"
        initial={{ opacity: 0, filter: "blur(16px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: 1.55, ease }}
      >
        TEMPO
      </motion.div>
    </div>
  );
}

function Scene30({ stage }) {
  return (
    <SceneShell className="center stacked tempoScene">
      {stage === 0 ? (
        <>
          <Title>Automatizar a coleta e análise de dados traz</Title>
          <motion.div
            className="tempoWord"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.24, ease }}
          >
            TEMPO
          </motion.div>
        </>
      ) : (
        <>
          <TempoParticles />
          <LineGroup
            delay={2.05}
            className="tempoSubtitle"
            lines={[
              "Tempo para olhar onde realmente importa.",
              "Creators.",
              "Colaboradores.",
              "Oportunidades.",
              "Mudanças do mercado.",
              "Tomadas de decisão."
            ]}
          />
        </>
      )}
    </SceneShell>
  );
}

function Scene31() {
  return (
    <SceneShell className="center stacked">
      <Title>Tempo para desenvolver creators.</Title>
      <LineGroup
        delay={0.2}
        lines={["Tempo para apoiar colaboradores.", "Tempo para tomar decisões melhores."]}
      />
    </SceneShell>
  );
}

function Scene32() {
  return (
    <SceneShell className="center stacked">
      <Title>A maior ferramenta da Unike</Title>
      <LineGroup
        delay={0.2}
        lines={[
          "Nossa experiência...",
          "aliada à IA...",
          "aos dados...",
          "e principalmente às pessoas."
        ]}
      />
    </SceneShell>
  );
}

function Scene33({ stage }) {
  return (
    <SceneShell className="center stacked closingScene">
      {stage === 0 ? (
        <motion.p
          className="closingPhrase closingPhraseOnly"
          initial={{ opacity: 0, y: 22, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 18, filter: "blur(18px)" }}
          transition={{ duration: 0.9, delay: 0.32, ease }}
        >
          Porque, no fim, tecnologia evolui. Os dados mudam. O mercado muda. Mas o futuro sempre será construído pelas pessoas que escolhem tomar decisões melhores.
        </motion.p>
      ) : (
        <motion.img
          className="finalLogoImage"
          src={presentationAssets.final.logo.src}
          alt={presentationAssets.final.logo.alt}
          initial={{ opacity: 0, scale: 0.78, filter: "blur(22px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.45, ease }}
        />
      )}
    </SceneShell>
  );
}

export const scenes = [
  { id: 1, label: "UNIKE", Component: Scene1 },
  { id: 5, label: "DADOS", Component: Scene5 },
  { id: 6, label: "74%", Component: Scene6, stages: 1 },
  { id: 7, label: "Contexto", Component: Scene7 },
  { id: 8, label: "Por quê?", Component: Scene8 },
  { id: 9, label: "O que fizemos", Component: Scene9, stages: 4 },
  { id: 10, label: "74% → 55%", Component: Scene10 },
  { id: 11, label: "Operação", Component: Scene11 },
  { id: 12, label: "Caos dos dados", Component: Scene12 },
  { id: 13, label: "Decisões", Component: Scene13 },
  { id: 14, label: "Informação", Component: Scene14 },
  { id: 15, label: "Tipos de dados", Component: Scene15 },
  { id: 16, label: "Pessoas", Component: Scene16 },
  { id: 17, label: "Estratégicos", Component: Scene17 },
  { id: 18, label: "Filosofia", Component: Scene18 },
  { id: 19, label: "Andressa", Component: Scene19 },
  { id: 20, label: "Enxergar antes", Component: Scene20 },
  { id: 21, label: "Operação", Component: Scene21 },
  { id: 22, label: "TikTok", Component: Scene22 },
  { id: 23, label: "Escala", Component: Scene23 },
  { id: 24, label: "IA", Component: Scene24 },
  { id: 25, label: "Inteligência Unike", Component: Scene25 },
  { id: 26, label: "CRM", Component: Scene26 },
  { id: 27, label: "Potencializa", Component: Scene27 },
  { id: 28, label: "Informação", Component: Scene28 },
  { id: 29, label: "Decidir melhor", Component: Scene29 },
  { id: 30, label: "TEMPO", Component: Scene30, stages: 1 },
  { id: 31, label: "Desenvolver", Component: Scene31 },
  { id: 32, label: "Ferramenta", Component: Scene32 },
  { id: 33, label: "UNIKE", Component: Scene33, stages: 1 }
];
