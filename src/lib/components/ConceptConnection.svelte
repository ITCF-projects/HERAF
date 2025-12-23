<script lang="ts">
    import type { ModelConnection } from './ConceptModelTypes';
    
    const {
        connection,
        highlighted = false
    }: {
        connection: ModelConnection;
        highlighted?: boolean;
    } = $props();
    
    // Generate SVG path data from connection points
    const pathData = $derived(() => {
        if (connection.points && connection.points.length >= 2) {
            // Use explicit points for multi-segment paths
            const firstPoint = connection.points[0];
            let path = `M${firstPoint.x} ${firstPoint.y}`;
            
            for (let i = 1; i < connection.points.length; i++) {
                const point = connection.points[i];
                path += ` L${point.x} ${point.y}`;
            }
            
            return path;
        }
        
        return '';
    });
    
    // Calculate label position based on arrow direction relative to line
    function calculateLabelPosition(arrow: string, text: string) {
        if (!connection.points || connection.points.length < 2) return { x: 0, y: 0 };
        
        if (arrow === '►') {
            // Right arrow: at start of line, below
            const startPoint = connection.points[0];
            return { x: startPoint.x + 30, y: startPoint.y + 100 };
        } else if (arrow === '◄') {
            // Left arrow: depends on line type
            // For multi-segment lines where first segment is horizontal, use start point
            // Otherwise use end point
            const textLines = text.split('\n').length;
            const textHeight = textLines * 100;
            
            if (connection.points.length > 2) {
                // Multi-segment line - check if first segment is horizontal (y values same)
                const firstPoint = connection.points[0];
                const secondPoint = connection.points[1];
                
                if (Math.abs(firstPoint.y - secondPoint.y) < 10) {
                    // Horizontal first segment - place at start (going left from start)
                    return { x: firstPoint.x - 30, y: firstPoint.y - 100 - textHeight };
                }
            }
            
            // Default: at end of line, above
            const endPoint = connection.points[connection.points.length - 1];
            return { x: endPoint.x - 30, y: endPoint.y - 100 - textHeight };
        } else if (arrow === '▼') {
            // Down arrow: at start of line, to the left
            const startPoint = connection.points[0];
            return { x: startPoint.x - 100, y: startPoint.y + 30 };
        } else if (arrow === '▲') {
            // Up arrow: at end of line, to the right
            // Need extra offset for arrow + text lines below it
            const textLines = text.split('\n').length;
            const extraOffset = textLines * 100; // Approximate height per line
            const endPoint = connection.points[connection.points.length - 1];
            return { x: endPoint.x + 100, y: endPoint.y - extraOffset - 30 };
        }
        
        return { x: 0, y: 0 };
    }
</script>

<g class="connection" class:highlighted>
    <path
        d={pathData()}
        fill="none"
        stroke="#262626"
        stroke-width={highlighted ? 30 : 27.5}
        stroke-dasharray={connection.type === 'dashed' ? '10,5' : 'none'}
        class="connection-line"
    />
    
    {#if connection.labels}
        {#each connection.labels as label}
            {@const position = calculateLabelPosition(label.arrow, label.text)}
            {@const textAnchor = label.arrow === '►' ? 'start' : label.arrow === '◄' ? 'end' : label.arrow === '▲' ? 'start' : 'end'}
            {@const dominantBaseline = label.arrow === '►' ? 'hanging' : label.arrow === '◄' ? 'auto' : label.arrow === '▲' ? 'auto' : 'hanging'}
            {@const textLines = label.text.split('\n')}
            {@const lines = (label.arrow === '►' || label.arrow === '▲') ? [label.arrow, ...textLines] : [...textLines, label.arrow]}
            <text
                x={position.x}
                y={position.y}
                text-anchor={textAnchor}
                dominant-baseline={dominantBaseline}
                fill="#262626"
                font-size="83"
                font-family="Aptos,Aptos_MSFontService,sans-serif"
                class="connection-label"
            >
                {#each lines as line, i}
                    <tspan x={position.x} dy={i === 0 ? 0 : '1.2em'}>
                        {line}
                    </tspan>
                {/each}
            </text>
        {/each}
    {/if}
</g>

<style>
    .connection {
        pointer-events: none;
    }
    
    .connection-label {
        pointer-events: none;
    }
</style>
