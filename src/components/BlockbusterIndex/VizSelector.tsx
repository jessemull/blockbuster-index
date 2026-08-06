'use client';

import React from 'react';
import { ChevronSelect } from '@components/Shared';
import { VIZ_OPTIONS, VizType } from '@constants';

type Props = {
  disabled?: boolean;
  onChange: (v: VizType) => void;
  value: VizType;
};

export const VizSelector: React.FC<Props> = ({
  disabled = false,
  onChange,
  value,
}) => {
  return (
    <div className="flex justify-center mb-4">
      <ChevronSelect
        aria-label="Select visualization"
        disabled={disabled}
        options={VIZ_OPTIONS}
        value={value}
        onChange={(v) => onChange(v as VizType)}
      />
    </div>
  );
};

export default VizSelector;
