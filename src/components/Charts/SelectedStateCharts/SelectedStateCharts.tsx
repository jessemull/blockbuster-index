'use client';

import React from 'react';
import { Bars, Radar, Weighted } from '../SharedSelectionCharts';
import { BlockbusterData } from '@types';
import { StateNames, USAStateAbbreviation } from '@constants';

type Props = {
  data: BlockbusterData;
  showTitle?: boolean;
  stateCode: string;
};

export const SelectedStateCharts: React.FC<Props> = ({
  data,
  showTitle = false,
  stateCode,
}) => {
  const state = data.states[stateCode];
  const components = state.components || {};
  return (
    <div
      className={`w-full flex flex-col items-center justify-center mt-3 lg:mt-20`}
    >
      <h2
        className={`${showTitle ? 'block' : 'hidden'} hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8`}
      >
        {StateNames[stateCode as USAStateAbbreviation]}
      </h2>
      <div className="w-full flex flex-wrap gap-8 justify-center">
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Radar components={components} />
        </div>
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Bars components={components} title="Signal Scores" />
        </div>
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Weighted components={components} />
        </div>
      </div>
    </div>
  );
};

export default SelectedStateCharts;
