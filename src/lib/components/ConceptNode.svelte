<script lang="ts">
    import type { ModelNode } from './ConceptModelTypes';
    import { NODE_COLORS } from './ConceptModelTypes';

    const {
        node,
        onclick
    }: {
        node: ModelNode;
        onclick?: () => void;
    } = $props();

    const colorScheme = NODE_COLORS[node.color];
</script>

<g
    class="node"
    role="link"
    tabindex="0"
    aria-label="{node.title} – gå till beskrivningen"
    {onclick}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onclick?.())}
>
    <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx="24"
        fill={colorScheme.fill}
        stroke={colorScheme.stroke}
        stroke-width="10"
        class="node-rect"
    />
    <text
        x={node.x + node.width / 2}
        y={node.y + node.height / 2}
        text-anchor="middle"
        dominant-baseline="middle"
        fill={colorScheme.textFill}
        font-size="118"
        font-weight="600"
        class="node-text"
    >
        {node.title}
    </text>
</g>

<style>
    .node {
        cursor: pointer;
        outline: none;
    }

    .node:hover .node-rect {
        opacity: 0.88;
    }

    .node:focus-visible .node-rect {
        stroke: var(--color-petrol);
        stroke-width: 36;
        paint-order: stroke;
    }
</style>
