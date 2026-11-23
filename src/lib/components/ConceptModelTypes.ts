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

// Matches the design tokens in app.css: petrol = HERAM, ink = the reference architecture itself
export const NODE_COLORS: Record<NodeColor, { fill: string; stroke: string; textFill: string }> = {
    // Perspectives and aspects
    primary: {
        fill: '#E2EFF1',
        stroke: '#0B5566',
        textFill: '#0B5566'
    },
    // Governance (principles, guidelines, rules, patterns)
    secondary: {
        fill: '#0B5566',
        stroke: '#0B5566',
        textFill: '#FFFFFF'
    },
    tertiary: {
        fill: '#4A3566',
        stroke: '#4A3566',
        textFill: '#FFFFFF'
    },
    // Reference architecture and area
    neutral: {
        fill: '#26232E',
        stroke: '#26232E',
        textFill: '#FFFFFF'
    }
};
