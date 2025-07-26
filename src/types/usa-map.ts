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

// This type is already defined in the USAMap types, but we'll import it
export type USAStateAbbreviation = string;
