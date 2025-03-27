export interface MovmentElementType {
  x: number,
  y: number
}

export interface PositionElementType {
  x: number,
  y: number
  movement?: MovmentElementType
}

export interface ConnectedType {
  node: string
  path: string
}

export const SIDE_TYPE = {
  start: 'start',
  end: 'end'
} as const;

export type SideType = keyof typeof SIDE_TYPE;


export interface NodePathType {
  position: PositionElementType
  value?: string | number | boolean
  side: SideType
  connected: ConnectedType
  dummy?: boolean
}

export interface NodeGraphType {
  unique?: string
  dummy?: boolean
  position: PositionElementType
  paths: Record<string, NodePathType>
  icon?: string
  count?: number
  connectionType?: ConnectionType
  canRemove?: boolean
  canMove?: boolean
  description?: string
  connections?: Position[]
  connectionDisabled?: boolean
}

export interface SchemeGraphType {
  scale: number;
  nodes: Record<string, NodeGraphType>
}

export const POSITION_TYPES = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  topLeft: 'topLeft',
  topRight: 'topRight',
  bottomLeft: 'bottomLeft',
  bottomRight: 'bottomRight',
} as const;

export type PositionType = keyof typeof POSITION_TYPES;

export const NODE_GROUP_TYPE = {
  group: 'group',
  node: 'node',
} as const;

export type NodeGroupType = keyof typeof NODE_GROUP_TYPE;

export const CONNECTION_TYPE = {
  boolean: 'boolean',
  empty: 'empty'
} as const;

export type ConnectionType = keyof typeof CONNECTION_TYPE;

export const ACTIONS_TYPE = {
  SAVE_SCHEME: 'SAVE_SCHEME',
  SAVE_DRAFT: 'SAVE_DRAFT'
} as const;

export type ActionsType = keyof typeof ACTIONS_TYPE;

export const THEME_TYPE = {
  LIGHT_MODE: 'LIGHT_MODE',
  DARK_MODE: 'DARK_MODE'
} as const;

export type ThemeType = keyof typeof THEME_TYPE;

export interface NodeConnectionType {
  top?: ConnectionType,
  bottom?: ConnectionType,
  left?: ConnectionType,
  right?: ConnectionType
}

type Position = Extract<PositionType, "top" | "bottom" | "left" | "right">;

export const COLORS_PATH = {
  ACTIVE: '#3b82f6',
  DEFAULT: '#d4d4d4',
  CONTROL_BOOLEAN_TRUE: '#bbf451',
  CONTROL_BOOLEAN_FALSE: '#ffa2a2',
  REMOVE: '#e74c3c',
  REMOVE_TEXT: '#FFFFFF',
  DEFAULT_TEXT: '#454545'
};


export interface NodeType {
  unique: string,
  label: string
  type: NodeGroupType,
  color?: string,
  icon?: string
  count?: number
  canRemove?: boolean
  canMove?: boolean
  description?: string
  position?: PositionElementType
  connections?: Position[]
  connectionType?: ConnectionType
  childrens?: NodeType[]
}
