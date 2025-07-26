import { USAStateAbbreviation } from '@constants';

export type OnStateClick = (state: USAStateAbbreviation) => void;

export interface State {
  fill?: string;
  stroke?: string;
  onClick?: OnStateClick;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export interface MapSettings {
  width?: string | number;
  title?: string;
}

export interface Props {
  defaultState?: State;
  customStates?: {
    [key in USAStateAbbreviation]?: State;
  };
  mapSettings?: MapSettings;
  className?: string;
}
