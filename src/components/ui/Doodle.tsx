import styles from './Doodle.module.css';

const line = styles.line;
const detail = `${styles.line} ${styles.detail}`;
const filled = `${styles.line} ${styles.fill}`;
const faint = `${styles.line} ${styles.detail} ${styles.faint}`;

export const LostTourist = () => (
  <svg className={styles.doodle} viewBox="0 0 360 220" aria-hidden>
    <path className={faint} d="M150 112 C200 64 290 40 350 56" />
    {[
      [214, 78, 0],
      [254, 60, 1.3],
      [294, 50, 2.6],
    ].map(([x, y, delay]) => (
      <g key={x}>
        <path className={faint} d={`M${x - 4} ${y} L${x + 15} ${y - 14} L${x + 34} ${y} Z`} />
        <rect className={`${faint} ${styles.fill}`} x={x} y={y} width="30" height="26" />
        {[0, 11, 22].map((dx) => (
          <rect
            key={dx}
            className={styles.window}
            style={{ animationDelay: `${delay + dx / 10}s` }}
            x={x + 3 + dx / 1.15}
            y={y + 6}
            width="5"
            height="9"
            rx="1"
          />
        ))}
      </g>
    ))}
    {[0, 1, 2, 3].map((row) => (
      <path
        key={row}
        className={styles.water}
        style={{ animationDelay: `${row * -0.7}s` }}
        d={`M0 ${190 + row * 8} C40 ${186 + row * 8} 80 ${194 + row * 8} 120 ${190 + row * 8} S200 ${186 + row * 8} 240 ${190 + row * 8} S320 ${194 + row * 8} 360 ${190 + row * 8}`}
      />
    ))}
    <path
      className={filled}
      d={`${[286, 218, 150, 82, 14].reduce(
        (d, x) => `${d} L${x + 56} 214 L${x + 56} 172 C${x + 56} 152 ${x} 152 ${x} 172 L${x} 214`,
        'M10 214 L10 138 L350 138 L350 214',
      )} Z`}
    />
    <path className={detail} d="M10 148 L350 148" />
    <path className={line} d="M10 116 L350 116" />
    {Array.from({ length: 11 }, (_, i) => (
      <path key={i} className={detail} d={`M${20 + i * 32} 116 L${20 + i * 32} 138`} />
    ))}
    <g transform="translate(110 138)">
      <rect className={`${line} ${styles.soft}`} x="-20" y="-62" width="11" height="25" rx="4" />
      <path className={filled} d="M-9 -2 L-8 -34 L8 -34 L9 -2 L2 -2 L0 -24 L-2 -2 Z" />
      <path className={`${line} ${styles.ink}`} d="M-13 0 C-13 -5 -2 -5 -1 0 Z M1 0 C2 -5 13 -5 13 0 Z" />
      <path className={`${line} ${styles.shirt}`} d="M-11 -34 C-12 -52 -10 -62 0 -64 C10 -62 12 -52 11 -34 Z" />
      <path className={line} d="M-7 -58 C0 -48 12 -50 22 -54 M7 -58 C12 -54 16 -56 22 -58" />
      <g className={styles.tilt}>
        <circle className={filled} cx="0" cy="-75" r="10" />
        <path className={`${line} ${styles.soft}`} d="M-9 -81 C-9 -93 9 -93 9 -81 Z" />
        <path className={line} d="M-16 -80 C-8 -83 8 -83 16 -80" />
        <circle className={styles.ink} cx="5" cy="-75" r="1.6" />
      </g>
      <g className={styles.turn}>
        <rect className={filled} x="20" y="-68" width="38" height="28" rx="2" />
        <path className={detail} d="M32.7 -68 L32.7 -40 M45.3 -68 L45.3 -40" />
        <path className={styles.route} d="M25 -46 C32 -62 44 -46 53 -62" />
      </g>
      <text className={`${styles.label} ${styles.bob}`} x="-6" y="-102">?</text>
    </g>
  </svg>
);

export const FlatTireJeep = () => (
  <svg className={styles.doodle} viewBox="0 0 360 220" aria-hidden>
    <path className={faint} d="M20 180 L90 96 L118 114 L170 52 L226 122 L258 100 L340 180" />
    <path className={`${faint} ${styles.fill}`} d="M156 69 L170 52 L184 69 L177 65 L170 72 L163 65 Z" />
    <path className={line} d="M10 180 L350 180" />
    <path className={faint} strokeDasharray="12 10" d="M20 190 L340 190" />
    <g className={styles.sag}>
      <circle className={`${line} ${styles.ink}`} cx="76" cy="124" r="13" />
      <circle className={filled} cx="76" cy="124" r="4" />
      <path className={`${line} ${styles.shirt}`} d="M84 152 L84 112 L112 112 L120 84 L222 84 L238 112 L288 116 C295 117 298 122 298 128 L298 152 Z" />
      <path className={detail} d="M126 84 L126 76 L214 76 L214 84" />
      <path className={`${detail} ${styles.soft}`} d="M126 92 L166 92 L166 112 L121 112 Z M174 92 L216 92 L228 112 L174 112 Z" />
      <path className={detail} d="M170 112 L170 150 M178 122 L188 122 M240 118 L240 150" />
      <circle className={filled} cx="290" cy="128" r="4" />
      <path className={line} d="M298 146 L306 146" />
    </g>
    <path className={`${line} ${styles.ink}`} d="M90 180 C84 172 96 160 120 160 C144 160 156 172 150 180 Z" />
    <circle className={filled} cx="120" cy="172" r="5" />
    <circle className={`${line} ${styles.ink}`} cx="252" cy="162" r="18" />
    <circle className={filled} cx="252" cy="162" r="7" />
    {[0, 0.8, 1.6].map((delay) => (
      <circle key={delay} className={`${faint} ${styles.fill} ${styles.puff}`} style={{ animationDelay: `${delay}s` }} cx="276" cy="104" r="7" />
    ))}
    <text className={`${styles.label} ${styles.bob}`} x="44" y="168">pfff</text>
  </svg>
);
