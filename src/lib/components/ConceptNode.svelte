<script lang="ts">
    import type { ModelNode } from './ConceptModelTypes';
    import { NODE_COLORS } from './ConceptModelTypes';
    
    const {
        node,
        highlighted = false,
        hovered = false,
        onclick,
        onmouseenter,
        onmouseleave
    }: {
        node: ModelNode;
        highlighted?: boolean;
        hovered?: boolean;
        onclick?: () => void;
        onmouseenter?: () => void;
        onmouseleave?: () => void;
    } = $props();
    
    const colorScheme = NODE_COLORS[node.color];
    const rx = 13.5;
</script>

<g 
    class="node"
    class:highlighted
    class:hovered
    role="button"
    tabindex="0"
    {onclick}
    {onmouseenter}
    {onmouseleave}
    onkeydown={(e) => e.key === 'Enter' && onclick?.()}
>
    <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        {rx}
        fill={colorScheme.fill}
        stroke={colorScheme.stroke}
        stroke-width="10.3125"
        class="node-rect"
    />
    <text
        x={node.x + node.width / 2}
        y={node.y + node.height / 2}
        text-anchor="middle"
        dominant-baseline="middle"
        fill={colorScheme.textFill}
        font-size="110"
        font-weight="700"
        font-family="Aptos,Aptos_MSFontService,sans-serif"
        class="node-text"
    >
        {node.title}
    </text>
</g>

<style>
    .node {
        cursor: pointer;
        transition: transform 0.2s ease, filter 0.2s ease;
        outline: none;
    }
    
    .node:hover .node-rect,
    .node:focus-visible .node-rect {
        stroke-width: 12;
        filter: brightness(1.02);
    }
    
    .node.hovered {
        transform: scale(1.005);
        transform-origin: center;
    }
    
    .node:focus-visible {
        outline: 3px solid #4A90E2;
        outline-offset: 5px;
    }
</style>
