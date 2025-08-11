'use client';

import React, { useMemo } from 'react';
import { Bars, Radar, Weighted } from '../SharedSelectionCharts';
import { BlockbusterData } from '@types';
import { ChartComponents } from '@types';
import { useBlockbusterData } from '@providers';

type Props = {
  data: BlockbusterData;
  regionName: string;
  showTitle?: boolean;
};

const useRegionComponents = (data: BlockbusterData, regionName: string) => {
  const { regionComponentsAverageByName } = useBlockbusterData();
  return useMemo(() => {
    if (!regionComponentsAverageByName) return {} as ChartComponents;
    return regionComponentsAverageByName[regionName] || {};
  }, [regionComponentsAverageByName, regionName]);
};

export const SelectedRegionCharts: React.FC<Props> = ({
  data,
  regionName,
  showTitle = false,
}) => {
  const components = useRegionComponents(data, regionName);
  return (
    <div
      data-testid="selected-region-charts"
      className={`w-full flex flex-col items-center justify-center mt-3 lg:mt-20`}
    >
      <h2
        className={`${showTitle ? 'block' : 'hidden'} hidden lg:block text-base text-xl font-normal text-white mb-5 md:mb-8`}
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
