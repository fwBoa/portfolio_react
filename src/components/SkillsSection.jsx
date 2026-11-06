import { createRef, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import {
  SiClaude,
  SiDocker,
  SiFigma,
  SiGit,
  SiLangchain,
  SiN8N,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si';
import { LuWorkflow } from 'react-icons/lu';
import antigravityLogo from '../assets/logos/antigravity.svg';
import mcpLogo from '../assets/logos/modelcontextprotocol.svg';
import { skillGroups } from '../data/skills';

/**
 * Compétences — trois cartes empilées.
 *
 * Le CSS porte l'épinglage (`position: sticky`). Framer ne fait que réduire
 * l'échelle de la carte sortante quand la suivante arrive : deux valeurs
 * dérivées du défilement, pas une animation par logo.
 *
 * Le magnétisme est mesuré à l'entrée du curseur et les transformations sont
 * écrites par des MotionValues : aucun rendu React par déplacement de souris,
 * aucune lecture de layout dans la boucle.
 */

const LOGOS = {
  React: { Icon: SiReact, color: '#61DAFB' },
  'Next.js': { Icon: SiNextdotjs, color: '#000000' },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#06B6D4' },
  'Node.js': { Icon: SiNodedotjs, color: '#5FA04E' },
  Vite: { Icon: SiVite, color: '#646CFF' },
  Python: { Icon: SiPython, color: '#3776AB' },
  LangChain: { Icon: SiLangchain, color: '#1C3C3C' },
  'OpenAI API': { Icon: SiOpenai, color: '#000000' },
  'Claude Code': { Icon: SiClaude, color: '#D97757' },
  Codex: { Icon: SiOpenai, color: '#000000' },
  Antigravity: { src: antigravityLogo },
  n8n: { Icon: SiN8N, color: '#EA4B71' },
  MCP: { src: mcpLogo },
  'Agentic Workflows': { Icon: LuWorkflow, color: '#2d6b6b' },
  Git: { Icon: SiGit, color: '#F05032' },
  Docker: { Icon: SiDocker, color: '#2496ED' },
  Figma: { Icon: SiFigma, color: '#F24E1E' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  Supabase: { Icon: SiSupabase, color: '#3FCF8E' },
  Vercel: { Icon: SiVercel, color: '#000000' },
};

const LogoIcon = ({ name }) => {
  const logo = LOGOS[name];

  if (!logo) return null;

  if (logo.src) {
    return (
      <img
        src={logo.src}
        alt=""
        width="18"
        height="18"
        className="h-[18px] w-[18px] object-contain"
      />
    );
  }

  const { Icon, color } = logo;
  return <Icon size={18} color={color} aria-hidden="true" />;
};

const LogoTile = ({ name, index, centers, pointerX, pointerY, magnetic }) => {
  const x = useTransform([pointerX, pointerY], ([px, py]) => {
    if (!magnetic) return 0;
    const center = centers.current[index];
    if (!center) return 0;
    const dx = px - center.x;
    const dy = py - center.y;
    const distance = Math.hypot(dx, dy);
    const max = 130;
    if (distance >= max) return 0;
    return (dx / (distance || 1)) * (1 - distance / max) * 6;
  });

  const y = useTransform([pointerX, pointerY], ([px, py]) => {
    if (!magnetic) return 0;
    const center = centers.current[index];
    if (!center) return 0;
    const dx = px - center.x;
    const dy = py - center.y;
    const distance = Math.hypot(dx, dy);
    const max = 130;
    if (distance >= max) return 0;
    return (dy / (distance || 1)) * (1 - distance / max) * 6;
  });

  return (
    <li className="flex min-w-0 items-center gap-2.5 text-[13px] font-medium leading-tight text-os-reading">
      <motion.span
        data-logo-mark
        style={{ x, y }}
        className="grid h-8 w-8 flex-none place-items-center rounded-[9px] border border-os-border bg-white"
      >
        <LogoIcon name={name} />
      </motion.span>
      <span>{name}</span>
    </li>
  );
};

const LogoGrid = ({ items, magnetic }) => {
  const gridRef = useRef(null);
  const centers = useRef([]);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);

  const measure = () => {
    if (!gridRef.current) return;
    centers.current = Array.from(gridRef.current.querySelectorAll('[data-logo-mark]')).map(
      (el) => {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      },
    );
  };

  const move = (event) => {
    if (!magnetic) return;
    pointerX.set(event.clientX);
    pointerY.set(event.clientY);
  };

  const leave = () => {
    pointerX.set(-9999);
    pointerY.set(-9999);
  };

  return (
    <ul
      ref={gridRef}
      onPointerEnter={(event) => {
        measure();
        move(event);
      }}
      onPointerMove={move}
      onPointerLeave={leave}
      className="relative z-10 mt-5 grid grid-cols-2 gap-2.5 sm:mt-[26px] sm:grid-cols-3 lg:grid-cols-6"
    >
      {items.map((name, index) => (
        <LogoTile
          key={name}
          name={name}
          index={index}
          centers={centers}
          pointerX={pointerX}
          pointerY={pointerY}
          magnetic={magnetic}
        />
      ))}
    </ul>
  );
};

const SkillCard = ({ category, index, cardRef, nextRef }) => {
  const reduce = useReducedMotion();
  const [magnetic, setMagnetic] = useState(false);
  const [stacked, setStacked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const glowRef = useRef(null);
  const cardRect = useRef(null);
  const glowFrame = useRef(null);
  const glowPoint = useRef({ x: 0, y: 0 });
  const touchGlowTimer = useRef(0);

  // La carte se réduit quand la suivante la recouvre : on lit le défilement
  // du haut de la carte suivante, pas le sien.
  const { scrollYProgress } = useScroll({
    target: nextRef || cardRef,
    offset: ['start 80%', 'start 38%'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  // L'échelle n'a de sens qu'avec l'épinglage desktop. Sous 1100 px, les
  // cartes sont dans le flux : les réduire au défilement créait un effet
  // parasite et un travail de composition inutile sur mobile.
  const displayScale = stacked && nextRef && !reduce ? scale : 1;

  useEffect(() => {
    const desktopStack = window.matchMedia('(min-width: 1101px)');
    const updateStack = () => setStacked(desktopStack.matches);
    updateStack();
    desktopStack.addEventListener('change', updateStack);
    return () => desktopStack.removeEventListener('change', updateStack);
  }, []);

  useEffect(() => {
    if (reduce) return;

    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setMagnetic(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [reduce]);

  useEffect(
    () => () => {
      if (glowFrame.current) cancelAnimationFrame(glowFrame.current);
      if (touchGlowTimer.current) window.clearTimeout(touchGlowTimer.current);
    },
    [],
  );

  const paintGlow = () => {
    glowFrame.current = null;
    if (!glowRef.current) return;
    // Un petit calque déplacé par transform, plutôt qu'un gradient plein
    // cadre repeint à chaque déplacement de souris.
    glowRef.current.style.transform = `translate3d(${glowPoint.current.x}px, ${glowPoint.current.y}px, 0)`;
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      style={{ scale: displayScale }}
      whileTap={stacked ? undefined : { scale: 0.995, transition: { duration: 0.12 } }}
      onClick={(event) => {
        // Retour tactile : un halo naît à l'endroit du tap, puis s'efface.
        // Au pointeur fin, c'est le survol qui pilote déjà le halo.
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect || !glowRef.current) return;
        glowPoint.current = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        paintGlow();
        glowRef.current.style.opacity = '1';
        window.clearTimeout(touchGlowTimer.current);
        touchGlowTimer.current = window.setTimeout(() => {
          if (glowRef.current) glowRef.current.style.opacity = '';
        }, 550);
      }}
      onPointerEnter={(event) => {
        const rect = cardRef.current?.getBoundingClientRect();
        cardRect.current = rect
          ? { left: rect.left, top: rect.top }
          : null;
        if (rect) {
          glowPoint.current = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          };
          paintGlow();
        }
      }}
      onPointerMove={(event) => {
        if (!magnetic || !cardRect.current) return;
        glowPoint.current = {
          x: event.clientX - cardRect.current.left,
          y: event.clientY - cardRect.current.top,
        };
        if (!glowFrame.current) glowFrame.current = requestAnimationFrame(paintGlow);
      }}
      onPointerLeave={() => {
        if (glowFrame.current) {
          cancelAnimationFrame(glowFrame.current);
          glowFrame.current = null;
        }
      }}
      className={`skill-card relative flex flex-col overflow-hidden rounded-[22px] border border-white/55 bg-white p-5 text-os-text shadow-[0_34px_70px_-46px_rgba(39,94,94,0.6)] sm:p-7 lg:px-9 lg:py-[34px] ${
        expanded ? 'is-expanded' : ''
      }`}
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="skill-glow pointer-events-none absolute z-0"
      />
      <span
        aria-hidden="true"
        className="absolute left-5 right-5 top-0 z-10 h-px bg-os-text/20 sm:left-7 sm:right-7 lg:left-9 lg:right-9"
      />

      <span className="relative z-10 text-[11px] font-medium tracking-[0.12em] text-os-reading">
        {category.num}
      </span>
      <h3 className="relative z-10 mt-2.5 font-display text-[clamp(1.7rem,2.7vw,2.4rem)] font-bold leading-none tracking-[-0.04em] text-os-text">
        {category.title}
      </h3>
      <p
        id={`skill-desc-${category.num}`}
        className={`skill-desc relative z-10 mt-3 max-w-[74ch] text-[15px] leading-[1.7] text-os-body sm:text-[16px] sm:leading-[1.7] ${
          expanded ? 'is-expanded' : 'is-clamped'
        }`}
      >
        {category.desc}
      </p>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`skill-desc-${category.num}`}
        className="skill-desc-toggle relative z-10 mt-2 inline-flex min-h-11 items-center gap-1.5 self-start text-[12px] font-medium text-os-text"
      >
        {expanded ? 'Réduire' : 'Lire la suite'}
        <span
          aria-hidden="true"
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          ⌄
        </span>
      </button>

      <LogoGrid items={category.items} magnetic={magnetic} />
    </motion.article>
  );
};

const SkillsSection = () => {
  const refs = useRef([]);
  const stackRef = useRef(null);
  const [carousel, setCarousel] = useState(false);
  const [activeSkill, setActiveSkill] = useState(0);

  if (refs.current.length === 0) {
    refs.current = skillGroups.map(() => createRef());
  }

  // Le carrousel est le rendu mobile par défaut. La mise en grille et le
  // masquage des libellés sont faits en CSS : rien ne bouge à l'hydratation.
  // Cet état ne sert qu'à l'observateur et aux attributs ARIA.
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setCarousel(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Suit la carte réellement alignée dans le carrousel.
  useEffect(() => {
    if (!carousel) {
      setActiveSkill(0);
      return undefined;
    }

    const root = stackRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.findIndex((ref) => ref.current === entry.target);
          if (index >= 0) setActiveSkill(index);
        });
      },
      { root, threshold: 0.55 },
    );

    refs.current.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [carousel]);

  const goToSkill = (index) => {
    const root = stackRef.current;
    const card = refs.current[index]?.current;
    if (!root || !card) return;

    const left =
      card.getBoundingClientRect().left - root.getBoundingClientRect().left + root.scrollLeft;
    root.scrollTo({
      left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  return (
    <section id="skills" className="relative bg-os-text text-white">
      <div className="px-5 py-[72px] sm:px-10 sm:py-24 lg:px-12 lg:py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8 grid gap-[22px] lg:mb-14"
          >
            <h2 className="font-display text-[clamp(2.6rem,7.5vw,7rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white">
              Compétences.
            </h2>
            <p className="max-w-[44ch] text-[15px] leading-[1.75] text-white/85 sm:text-[16px] sm:leading-[1.75] lg:justify-self-end">
              Trois terrains, une même exigence. Le détail reste à portée.
            </p>
          </motion.header>

          <div className="skills-carousel-nav mb-5 items-center justify-between gap-4">
            <span
              aria-live="polite"
              className="font-display text-[11px] font-bold tracking-[0.14em] text-white/80"
            >
              {String(activeSkill + 1).padStart(2, '0')} /{' '}
              {String(skillGroups.length).padStart(2, '0')}
            </span>
            <div className="flex items-center">
              {skillGroups.map((group, index) => (
                <button
                  key={group.num}
                  type="button"
                  onClick={() => goToSkill(index)}
                  aria-label={`Voir la compétence ${index + 1} : ${group.title}`}
                  aria-current={activeSkill === index ? 'true' : undefined}
                  className="grid h-11 w-11 place-items-center rounded-full"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-300 ${
                      activeSkill === index ? 'w-6 bg-white' : 'w-3 bg-white/35'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div
            ref={stackRef}
            role={carousel ? 'region' : undefined}
            aria-label={carousel ? 'Compétences, faites défiler horizontalement' : undefined}
            aria-roledescription={carousel ? 'carrousel' : undefined}
            tabIndex={carousel ? 0 : undefined}
            className="skills-stack skills-carousel"
          >
            {skillGroups.map((category, index) => (
              <SkillCard
                key={category.num}
                category={category}
                index={index}
                cardRef={refs.current[index]}
                nextRef={refs.current[index + 1] || null}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
