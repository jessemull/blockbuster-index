'use client';

import React, { useMemo } from 'react';
import { Bars, Radar, Weighted } from '@components/Charts';
import { CENSUS_DIVISIONS } from '@utils/regions';
import { BlockbusterData } from '@types';

type Props = {
  data: BlockbusterData;
  regionName: string;
};

// Aggregate component scores by region
const useRegionComponents = (data: BlockbusterData, regionName: string) => {
  return useMemo(() => {
    const states = CENSUS_DIVISIONS[regionName] || [];
    const componentSums: Record<string, number> = {};
    let count = 0;
    for (const code of states) {
      const st = data.states[code];
      if (!st) continue;
      const comps = st.components || {};
      Object.keys(comps).forEach((k) => {
        componentSums[k] = (componentSums[k] || 0) + (comps[k] ?? 0);
      });
      count += 1;
    }
    const averages: Record<string, number> = {};
    Object.keys(componentSums).forEach((k) => {
      averages[k] = count ? Number((componentSums[k] / count).toFixed(2)) : 0;
    });
    return averages;
  }, [data, regionName]);
};

export const RegionCharts: React.FC<Props> = ({ data, regionName }) => {
  const components = useRegionComponents(data, regionName);
  return (
    <div className="w-full flex flex-col items-center justify-center mt-3 lg:mt-20">
      <h2 className="text-base text-xl font-normal text-white mb-5 md:mb-8">
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

export default RegionCharts;
