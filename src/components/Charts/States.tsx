'use client';

import Bars from './Bars';
import Radar from './Radar';
import React from 'react';
import Weighted from './Weighted';
import { BlockbusterData } from '@types';

type Props = {
  data: BlockbusterData;
  stateCode: string;
};

export const States: React.FC<Props> = ({ stateCode, data }) => {
  const state = data.states[stateCode];
  const components = state.components || {};
  return (
    <div className="w-full flex flex-wrap gap-8 mt-12 justify-center">
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
  );
};

export default States;
