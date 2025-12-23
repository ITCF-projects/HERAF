export type NodeColor = 'primary' | 'secondary' | 'tertiary' | 'neutral';

export interface ModelNode {
    id: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: NodeColor;
    description?: string;
}

export interface ConnectionLabel {
    text: string;
    arrow: '►' | '◄' | '▲' | '▼';
    position: { x: number; y: number };
}

export interface ModelConnection {
    id: string;
    from: string;
    to: string;
    labels?: ConnectionLabel[];
    type: 'solid' | 'dashed' | 'straight' | 'multi';
    points?: { x: number; y: number }[];
}

export const NODE_COLORS: Record<NodeColor, { fill: string; stroke: string; textFill: string }> = {
    primary: {
        fill: '#F2F2F2',
        stroke: '#262626',
        textFill: '#262626'
    },
    secondary: {
        fill: '#352F44',
        stroke: '#000000',
        textFill: '#FFFFFF'
    },
    tertiary: {
        fill: '#0D3B4F',
        stroke: '#000000',
        textFill: '#FFFFFF'
    },
    neutral: {
        fill: '#E0E0E0',
        stroke: '#262626',
        textFill: '#262626'
    }
};
