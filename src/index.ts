import '@/assets/styles.scss';

import type { ActionsType, NodeGraphType, NodeType, PositionType, SchemeGraphType, ThemeType } from '@/types/index';
import { ACTIONS_TYPE, CONNECTION_TYPE, NODE_GROUP_TYPE, POSITION_TYPES, THEME_TYPE } from '@/types/index';
import SchemeGraph from './components/SchemeGraph.vue';

type PositionConnectionType = Extract<PositionType, "top" | "bottom" | "left" | "right">;

export { ACTIONS_TYPE, CONNECTION_TYPE, NODE_GROUP_TYPE, POSITION_TYPES, SchemeGraph, THEME_TYPE, type ActionsType, type NodeGraphType, type NodeType, type PositionConnectionType, type SchemeGraphType, type ThemeType };

