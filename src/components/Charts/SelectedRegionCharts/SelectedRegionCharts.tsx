'use client';

import React, { useMemo } from 'react';
import { useBlockbusterData } from '@providers';
import { BlockbusterData } from '@types';
import { Bars, Radar, Weighted } from '../SharedSelectionCharts';

type Props = {
  data: BlockbusterData;
  regionName: string;
  showTitle?: boolean;
};

const useRegionComponents = (regionName: string) => {
  const { regionComponentsAverageByName } = useBlockbusterData();
  return useMemo(() => {
    return regionComponentsAverageByName[regionName] || {};
  }, [regionComponentsAverageByName, regionName]);
};

export const SelectedRegionCharts: React.FC<Props> = ({
  data: _data,
  regionName,
  showTitle = false,
}) => {
  const components = useRegionComponents(regionName);
  return (
    <div
      className={`w-full flex flex-col items-center justify-center mt-3 lg:mt-20`}
      data-testid="selected-region-charts"
    >
      <h2
        className={`${showTitle ? 'hidden lg:block' : 'hidden'} text-base text-xl font-normal text-white mb-5 md:mb-8`}
      >
        {regionName}
      </h2>
      <div className="w-full flex flex-wrap gap-8 justify-center">
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Radar components={components} />
        </div>
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Bars components={components} title={`Signal Scores`} />
        </div>
        <div className="p-0 max-w-[340px] md:max-w-[360px]">
          <Weighted components={components} />
        </div>
      </div>
    </div>
  );
};

export default SelectedRegionCharts;
