<script lang="ts">
    import ConceptNode from './ConceptNode.svelte';
    import ConceptConnection from './ConceptConnection.svelte';
    import { nodes, connections } from './ConceptModelData';
    
    let { 
        size = 800,
        onNodeClick,
        highlightedNodeId = $bindable<string | null>(null)
    }: {
        size?: number;
        onNodeClick?: (nodeId: string) => void;
        highlightedNodeId?: string | null;
    } = $props();
    
    let hoveredNodeId = $state<string | null>(null);
    
    function handleNodeClick(nodeId: string) {
        highlightedNodeId = nodeId;
        onNodeClick?.(nodeId);
    }
    
    // Get connections related to highlighted node
    const highlightedConnections = $derived(
        highlightedNodeId 
            ? connections.filter(c => c.from === highlightedNodeId || c.to === highlightedNodeId).map(c => c.id)
            : []
    );
</script>

<svg viewBox="0 1000 6500 5000" style="width: 100%; height: auto; max-width: {size}px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" overflow="hidden">
    <defs>
        <!-- Filters for shadow effects -->
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
        </filter>
    </defs>
    
    <!-- Connections layer -->
    <g class="connections">
        {#each connections as conn (conn.id)}
            <ConceptConnection 
                connection={conn}
            />
        {/each}
    </g>
    
    <!-- Nodes layer -->
    <g class="nodes">
        {#each nodes as node (node.id)}
            <ConceptNode 
                {node}
                hovered={hoveredNodeId === node.id}
                onclick={() => handleNodeClick(node.id)}
                onmouseenter={() => hoveredNodeId = node.id}
                onmouseleave={() => hoveredNodeId = null}
            />
        {/each}
    </g>
</svg>

<style>
    svg {
        font-family: 'Aptos', 'Segoe UI', sans-serif;
    }
    
    :global(.connections) {
        pointer-events: none;
    }
    
    :global(.node) {
        transition: all 0.2s ease;
    }
</style>