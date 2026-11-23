<script lang="ts">
    import ConceptNode from './ConceptNode.svelte';
    import ConceptConnection from './ConceptConnection.svelte';
    import { nodes, connections } from './ConceptModelData';

    let {
        onNodeClick
    }: {
        onNodeClick?: (nodeId: string) => void;
    } = $props();
</script>

<svg
    class="concept-map-svg"
    viewBox="0 1000 6500 5000"
    role="group"
    aria-label="Konceptkarta över HERAM"
    xmlns="http://www.w3.org/2000/svg"
>
    <g class="connections">
        {#each connections as conn (conn.id)}
            <ConceptConnection connection={conn} />
        {/each}
    </g>

    <g class="nodes">
        {#each nodes as node (node.id)}
            <ConceptNode {node} onclick={() => onNodeClick?.(node.id)} />
        {/each}
    </g>
</svg>

<style>
    .concept-map-svg {
        display: block;
        width: 100%;
        height: auto;
        font-family: var(--font-sans);
    }

    .connections {
        pointer-events: none;
    }
</style>
