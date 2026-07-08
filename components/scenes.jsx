"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { BrainCircuit, Database, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { stormWords as premiumStormWords } from "./chaos-words";
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
    <SceneShell className="center">
      <motion.img
        className="openingLogoMark"
        src={presentationAssets.opening.logo.src}
        alt={presentationAssets.opening.logo.alt}
        initial={{ opacity: 0, scale: 0.94, filter: "blur(18px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease }}
      />
    </SceneShell>
  );
}

function Scene5() {
  return (
    <SceneShell className="statementScene warmScene">
      <Eyebrow>Entrada Raphael</Eyebrow>
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
    <SceneShell className="center stacked questionGlowScene">
      <Title>A pergunta que mudou tudo</Title>
      <Subtitle className="why" delay={0.18}>Como?</Subtitle>
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
    <SceneShell className="center stacked processGlowScene">
      <Title>Esse era apenas um processo.</Title>
      <Subtitle delay={0.2}>E quando olhamos para toda a operação?</Subtitle>
    </SceneShell>
  );
}

function Scene12({ stage }) {
  if (stage === 0) {
    return (
      <SceneShell className="center chaosIntroScene">
        <motion.h1
          className="chaosIntroTitle"
          initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(18px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease }}
        >
          O caos dos dados
        </motion.h1>
      </SceneShell>
    );
  }

  return (
    <SceneShell className="chaosScene stormScene">
      <div className="chaosField stormField">
        {premiumStormWords.map(({ word, focus, mega, category }, index) => {
          const left = ((index * 41 + (index % 17) * 29) % 140) - 18;
          const top = ((index * 53 + (index % 19) * 23) % 130) - 12;
          const depth = 12 + ((index * 37) % 260);
          const size = mega
            ? 7.2 + ((index * 11) % 58) / 10
            : focus
              ? 4.4 + ((index * 7) % 40) / 10
              : 0.74 + ((index * 13) % 34) / 10;
          const driftX = ((index % 15) - 7) * (18 + (index % 6) * 6);
          const dropHeight = -1200 - ((index * 29) % 980);
          const delay = (index % 22) * 0.045;
          const duration = 4.8 + (index % 12) * 0.38 + (focus ? 0.6 : 0) + (mega ? 1.1 : 0);
          const settleScale = mega ? 1.12 : focus ? 1.05 : 1;
          return (
            <motion.span
              className={[
                "floatingWord",
                "stormWord",
                "fallingChaosWord",
                category,
                focus ? "focusWord" : "",
                mega ? "megaWord" : "",
              ].filter(Boolean).join(" ")}
              key={`${word}-${index}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                zIndex: depth,
                fontSize: `${size}rem`,
                rotate: `${((index * 19) % 38) - 19}deg`
              }}
              initial={{
                opacity: 0,
                x: driftX,
                y: dropHeight,
                scale: mega ? 1.22 : 1.08,
                filter: "blur(18px)"
              }}
              animate={{
                opacity: [0, focus ? 0.96 : 0.78, focus ? 0.98 : 0.88],
                x: [driftX, driftX * 0.42, 0],
                y: [dropHeight, 36 + (index % 8) * 8, 0],
                scale: [mega ? 1.22 : 1.08, mega ? 1.18 : 1.05, settleScale],
                filter: ["blur(18px)", "blur(4px)", "blur(0px)"]
              }}
              transition={{
                duration,
                delay,
                times: [0, 0.82, 1],
                ease: [0.18, 1, 0.32, 1]
              }}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
      <motion.div
        className="stormWhiteout"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.1, 0.68, 1] }}
        transition={{ duration: 10.6, times: [0, 0.82, 0.9, 0.965, 1], ease }}
      />
    </SceneShell>
  );
}

function Scene13() {
  return (
    <SceneShell className="center stacked lightScene">
      <Title>O problema nunca foi ter dados.</Title>
      <Subtitle delay={0.2}>O problema sempre foi transformar dados em decisões.</Subtitle>
    </SceneShell>
  );
}

function Scene14() {
  return (
    <SceneShell className="center stacked lightScene">
      <Title className="blueTitle">Dado não é só número.</Title>
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
    <SceneShell className="dataTypesScene dataTypesLightScene">
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
    <SceneShell className="center stacked lightScene humanLightScene">
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
    <SceneShell className="center stacked lightScene strategicLightScene">
      <Title className="blueTitle">E dados também são Estratégicos.</Title>
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
    <SceneShell className="center stacked eclipseScene">
      <motion.div
        className="eclipseHalo"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.35 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.45, ease }}
      />
      <Eyebrow>Entrada Andressa</Eyebrow>
      <Title>A filosofia da <span className="unikePurple">Unike</span></Title>
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
      <Title className="goldTitle">Decisões</Title>
      <Subtitle delay={0.2}>Como essa filosofia acontece na prática.</Subtitle>
    </SceneShell>
  );
}

function Scene20() {
  return (
    <SceneShell className="center stacked purpleScene">
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
    <SceneShell className="center stacked cyanScene">
      <Title>Não analisamos apenas creators.</Title>
      <Subtitle delay={0.2}>Também analisamos colaboradores, processos e sinais da operação.</Subtitle>
    </SceneShell>
  );
}

function Scene22() {
  return (
    <SceneShell className="center stacked softWarmScene">
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
    <SceneShell className="center stacked purpleScene">
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

function Scene27() {
  return (
    <SceneShell className="center stacked cyanScene">
      <Title>IA não faz o trabalho.</Title>
      <Subtitle delay={0.2}>Ela potencializa quem sabe decidir.</Subtitle>
    </SceneShell>
  );
}

function Scene28() {
  return (
    <SceneShell className="center stacked softWarmScene">
      <Title>Menos <span className="tempoHighlight">tempo</span> procurando informação.</Title>
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

function Scene31() {
  return (
    <SceneShell className="center stacked purpleScene">
      <Title><span className="tempoHighlight">Tempo</span> para desenvolver creators.</Title>
      <Subtitle delay={0.2}>
        <p><span className="tempoHighlight">Tempo</span> para apoiar colaboradores.</p>
        <p><span className="tempoHighlight">Tempo</span> para tomar decisões melhores.</p>
      </Subtitle>
    </SceneShell>
  );
}

function Scene32() {
  return (
    <SceneShell className="center stacked cyanScene">
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
          Porque, no fim, tecnologia evolui. Os dados mudam. O mercado muda. Mas o futuro deve ser construído pelas pessoas que escolhem tomar decisões melhores.
        </motion.p>
      ) : (
        <div className="finalLogoStack">
          <motion.img
            className="finalLogoImage"
            src={presentationAssets.final.logo.src}
            alt={presentationAssets.final.logo.alt}
            initial={{ opacity: 0, scale: 0.62, filter: "blur(24px)" }}
            animate={{ opacity: 1, scale: [0.62, 1.28, 1.62], filter: "blur(0px)" }}
            transition={{ duration: 3.8, ease }}
          />
          <motion.p
            className="finalSlogan"
            initial={{ opacity: 0, y: 14, scale: 0.96, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.35, delay: 1.05, ease }}
          >
            Ser único é o que nos conecta.
          </motion.p>
        </div>
      )}
    </SceneShell>
  );
}

export const scenes = [
  { id: 1, label: "UNIKE", Component: Scene1 },
  { id: 5, label: "DADOS", Component: Scene5 },
  { id: 6, label: "74%", Component: Scene6, stages: 1 },
  { id: 7, label: "Contexto", Component: Scene7 },
  { id: 8, label: "Como?", Component: Scene8 },
  { id: 9, label: "O que fizemos", Component: Scene9, stages: 4 },
  { id: 10, label: "74% → 55%", Component: Scene10 },
  { id: 11, label: "Operação", Component: Scene11 },
  { id: 12, label: "Caos dos dados", Component: Scene12, stages: 1 },
  { id: 13, label: "Decisões", Component: Scene13, theme: "light" },
  { id: 14, label: "Informação", Component: Scene14, theme: "light" },
  { id: 15, label: "Tipos de dados", Component: Scene15, theme: "light" },
  { id: 16, label: "Pessoas", Component: Scene16, theme: "light" },
  { id: 17, label: "Estratégicos", Component: Scene17, theme: "light" },
  { id: 18, label: "Filosofia", Component: Scene18 },
  { id: 19, label: "Andressa", Component: Scene19 },
  { id: 20, label: "Enxergar antes", Component: Scene20 },
  { id: 21, label: "Operação", Component: Scene21 },
  { id: 22, label: "TikTok", Component: Scene22 },
  { id: 23, label: "Escala", Component: Scene23 },
  { id: 27, label: "Potencializa", Component: Scene27 },
  { id: 28, label: "Informação", Component: Scene28 },
  { id: 29, label: "Decidir melhor", Component: Scene29 },
  { id: 31, label: "Desenvolver", Component: Scene31 },
  { id: 32, label: "Ferramenta", Component: Scene32 },
  { id: 33, label: "UNIKE", Component: Scene33, stages: 1 }
];
