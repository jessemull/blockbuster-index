export const VIZ_OPTIONS = [
  {
    label: 'National Heat Map',
    value: 'map',
  },
  {
    label: 'National Lollipop Chart',
    value: 'lolli',
  },
  {
    label: 'Regional Heat Map',
    value: 'regional',
  },
  {
    label: 'Regional Bar Chart',
    value: 'hist',
  },
] as const;

export type VizType = (typeof VIZ_OPTIONS)[number]['value'];
