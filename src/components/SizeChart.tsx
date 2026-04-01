import React, { useState } from 'react';

interface SizeData {
  label: string;
  values: string[];
}

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG'];

const DATA = {
  oversized: [
    { label: 'Largura', values: ['50 cm', '52 cm', '54 cm', '58 cm', '61 cm', '64 cm'] },
    { label: 'Altura', values: ['72 cm', '75 cm', '78 cm', '81 cm', '84 cm', '87 cm'] },
    { label: 'Manga', values: ['26 cm', '28 cm', '30 cm', '32 cm', '34 cm', '36 cm'] },
  ],
  boxy: [
    { label: 'Largura', values: ['50 cm', '52 cm', '54 cm', '58 cm', '61 cm', '64 cm'] },
    { label: 'Altura', values: ['61 cm', '64 cm', '67 cm', '70 cm', '73 cm', '76 cm'] },
    { label: 'Manga', values: ['20 cm', '22 cm', '24 cm', '26 cm', '28 cm', '30 cm'] },
  ],
  shorts: [
    { label: 'Largura', values: ['34 cm', '36 cm', '38 cm', '40 cm', '42 cm', '44 cm'] },
    { label: 'Altura', values: ['42 cm', '43 cm', '44 cm', '45 cm', '46 cm', '47 cm'] },
    { label: 'Coxa', values: ['30 cm', '31 cm', '32 cm', '33 cm', '34 cm', '35 cm'] },
  ]
};

interface SizeChartProps {
  type: keyof typeof DATA;
}

export const SizeChart = ({ type }: SizeChartProps) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(3);
  const measurements = DATA[type];

  return (
    <div className="w-full py-4 font-sans select-none">
      <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-0 text-center items-stretch">
        {/* Header Row */}
        <div className="flex items-center justify-start pr-4 text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
          Medidas
        </div>
        {SIZES.map((size, idx) => (
          <div
            key={size}
            onClick={() => setSelectedIdx(idx)}
            className={`cursor-pointer py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center
              ${selectedIdx === idx ? 'bg-black text-white' : 'text-black hover:bg-neutral-50'}`}
          >
            {size}
          </div>
        ))}

        {/* Measurement Rows */}
        {measurements.map((m) => (
          <React.Fragment key={m.label}>
            <div className="flex items-center justify-start pr-4 h-12 text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
              {m.label}
            </div>
            {m.values.map((val, idx) => (
              <div
                key={`${m.label}-${idx}`}
                onClick={() => setSelectedIdx(idx)}
                className={`cursor-pointer flex items-center justify-center text-[13px] transition-all duration-200 h-12
                  ${selectedIdx === idx ? 'bg-black text-white' : 'text-black hover:bg-neutral-50'}`}
              >
                {val}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      
      <p className="mt-6 text-[10px] text-neutral-400 uppercase tracking-widest text-center">
        * Medidas aproximadas em centímetros.
      </p>
    </div>
  );
};
