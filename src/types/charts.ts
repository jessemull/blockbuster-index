export interface ChartComponents {
  [key: string]: number;
}

export interface BadgeData {
  type: 'state' | 'region';
  name?: string;
  stateCode?: string;
  score: number;
  rank: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface WeightedDataPoint {
  label: string;
  amount: number;
}

export interface StateData {
  rank: number;
  score: number;
  stateCode: string;
  type: 'state';
}

export interface RegionData {
  name: string;
  rank: number;
  score: number;
  type: 'region';
}

export interface BadgeProps {
  className?: string;
  data: StateData | RegionData;
  onViewStats?: () => void;
  showButton?: boolean;
  variant?: 'default' | 'mobile' | 'compact';
}
