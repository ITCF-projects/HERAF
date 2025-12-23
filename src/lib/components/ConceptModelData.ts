import type { ModelNode, ModelConnection } from './ConceptModelTypes';

export const nodes: ModelNode[] = [
    // Row 1: Top boxes (purple)
    {
        id: 'arkitekturperspektiv',
        title: 'Arkitekturperspektiv',
        x: 2610,
        y: 1144,
        width: 1362,
        height: 536,
        color: 'primary'
    },
    {
        id: 'aspekter',
        title: 'Aspekter',
        x: 5083,
        y: 1141,
        width: 1362,
        height: 536,
        color: 'primary'
    },
    
    // Row 2: Middle boxes
    {
        id: 'malgruppsperspektiv',
        title: 'Målgruppsperspektiv',
        x: 138,
        y: 2581,
        width: 1362,
        height: 536,
        color: 'primary'
    },
    {
        id: 'referensarkitektur',
        title: 'Referensarkitektur',
        x: 2610,
        y: 2581,
        width: 1362,
        height: 536,
        color: 'neutral'
    },
    {
        id: 'omrade',
        title: 'Område',
        x: 5080,
        y: 2581,
        width: 1362,
        height: 536,
        color: 'neutral'
    },
    
    // Row 3: Bottom boxes (teal)
    {
        id: 'styrande-principer',
        title: 'Styrande principer',
        x: 138,
        y: 3970,
        width: 1362,
        height: 536,
        color: 'secondary'
    },
    {
        id: 'arkitekturprinciper',
        title: 'Arkitekturprinciper',
        x: 2610,
        y: 3970,
        width: 1362,
        height: 536,
        color: 'secondary'
    },
    {
        id: 'monster-patterns',
        title: 'Mönster / Patterns',
        x: 5080,
        y: 3970,
        width: 1362,
        height: 536,
        color: 'secondary'
    },
    
    // Row 4: Bottom row (teal)
    {
        id: 'riktlinjer-regler',
        title: 'Riktlinjer / Regler',
        x: 2610,
        y: 5242,
        width: 1362,
        height: 536,
        color: 'secondary'
    }
];

export const connections: ModelConnection[] = [
    // Arkitekturperspektiv to Referensarkitektur (vertical)
    {
        id: 'ark-perspektiv-ref-arkitektur',
        from: 'arkitekturperspektiv',
        to: 'referensarkitektur',
        type: 'straight',
        points: [
            { x: 3298, y: 1680 },
            { x: 3298, y: 2569 }
        ],
        labels: [{
            text: 'beskriver/\nvisualiserar',
            arrow: '▼',
            position: { x: 0, y: 0 }
        }]
    },
    
    // Arkitekturperspektiv to Aspekter (horizontal)
    {
        id: 'ark-perspektiv-aspekter',
        from: 'arkitekturperspektiv',
        to: 'aspekter',
        type: 'straight',
        points: [
            { x: 3972, y: 1405 },
            { x: 5083, y: 1405 }
        ],
        labels: [
            {
                text: 'visualiserar',
                arrow: '►',
                position: { x: 0, y: 0 }
            },
            {
                text: 'validerar\nvisualisering i',
                arrow: '◄',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Arkitekturperspektiv to Målgruppsperspektiv (L-shaped)
    {
        id: 'ark-perspektiv-malgrupp',
        from: 'arkitekturperspektiv',
        to: 'malgruppsperspektiv',
        type: 'multi',
        points: [
            { x: 2611, y: 1405 },
            { x: 826, y: 1405 },
            { x: 826, y: 2568 }
        ],
        labels: [{
            text: 'adresserar',
            arrow: '◄',
            position: { x: 0, y: 0 }
        },
        {
            text: 'styr utformningen\nav',
            arrow: '▲',
            position: { x: 0, y: 0 }
        }
    ]
    },
    
    // Målgruppsperspektiv to Referensarkitektur (horizontal) - bidirectional
    {
        id: 'malgrupp-ref-arkitektur',
        from: 'malgruppsperspektiv',
        to: 'referensarkitektur',
        type: 'straight',
        points: [
            { x: 1513, y: 2843 },
            { x: 2610, y: 2843 }
        ],
        labels: [
            {
                text: 'ska beskriva\nför',
                arrow: '◄',
                position: { x: 0, y: 0 }
            },
            {
                text: 'vägleder\nInnehållet för',
                arrow: '►',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Referensarkitektur to Område (horizontal) - bidirectional
    {
        id: 'ref-arkitektur-omrade',
        from: 'referensarkitektur',
        to: 'omrade',
        type: 'straight',
        points: [
            { x: 3972, y: 2843 },
            { x: 5080, y: 2843 }
        ],
        labels: [
            {
                text: 'beskriver\nönskat läge\nför',
                arrow: '►',
                position: { x: 0, y: 0 }
            },
            {
                text: 'ger syfte\ntill',
                arrow: '◄',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Referensarkitektur to Arkitekturprinciper (vertical) - bidirectional
    {
        id: 'ref-arkitektur-ark-principer',
        from: 'referensarkitektur',
        to: 'arkitekturprinciper',
        type: 'straight',
        points: [
            { x: 3298, y: 3117 },
            { x: 3298, y: 3957 }
        ],
        labels: [{
            text: 'följer',
            arrow: '▼',
            position: { x: 0, y: 0 }
        },
        {
            text: 'styr utformningen\nav',
            arrow: '▲',
            position: { x: 0, y: 0 }
        }
    ]
    },
    
    // Område to Aspekter (vertical) - bidirectional
    {
        id: 'omrade-aspekter',
        from: 'omrade',
        to: 'aspekter',
        type: 'straight',
        points: [
            { x: 5767, y: 1677 },
            { x: 5767, y: 2568 }
        ],
        labels: [
            {
                text: 'är baserade\npå',
                arrow: '▼',
                position: { x: 0, y: 0 }
            },
            {
                text: 'har olika',
                arrow: '▲',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Område to Mönster/Patterns (vertical)
    {
        id: 'omrade-monster',
        from: 'omrade',
        to: 'monster-patterns',
        type: 'straight',
        points: [
            { x: 5767, y: 3117 },
            { x: 5767, y: 3957 }
        ],
        labels: [
            {
                text: 'innehåller',
                arrow: '▼',
                position: { x: 0, y: 0 }
            },
            {
                text: 'beskriver bästa\npraxis inom',
                arrow: '▲',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Arkitekturprinciper to Riktlinjer/Regler (vertical) - bidirectional
    {
        id: 'ark-principer-riktlinjer',
        from: 'arkitekturprinciper',
        to: 'riktlinjer-regler',
        type: 'straight',
        points: [
            { x: 3298, y: 4506 },
            { x: 3298, y: 5229 }
        ],
        labels: [
            {
                text: 'ger syfte\ntill',
                arrow: '▼',
                position: { x: 0, y: 0 }
            },
            {
                text: 'motiveras\nav',
                arrow: '▲',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Arkitekturprinciper to Styrande principer (horizontal) - bidirectional
    {
        id: 'ark-principer-styrande',
        from: 'arkitekturprinciper',
        to: 'styrande-principer',
        type: 'straight',
        points: [
            { x: 1513, y: 4232 },
            { x: 2610, y: 4232 }
        ],
        labels: [
            {
                text: 'följer / refererar\ntill',
                arrow: '◄',
                position: { x: 0, y: 0 }
            },
            {
                text: 'påverkar utformning\nav',
                arrow: '►',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Arkitekturprinciper to Mönster/Patterns (horizontal) - bidirectional
    {
        id: 'ark-principer-monster',
        from: 'arkitekturprinciper',
        to: 'monster-patterns',
        type: 'straight',
        points: [
            { x: 3985, y: 4232 },
            { x: 5080, y: 4232 }
        ],
        labels: [
            {
                text: 'påverkar val\nav',
                arrow: '►',
                position: { x: 0, y: 0 }
            },
            {
                text: 'förenklar\nefterlevnad av',
                arrow: '◄',
                position: { x: 0, y: 0 }
            }
        ]
    },
    
    // Mönster/Patterns to Referensarkitektur (vertical - different x)
    // {
    //     id: 'monster-ref-arkitektur',
    //     from: 'monster-patterns',
    //     to: 'referensarkitektur',
    //     type: 'straight',
    //     points: [
    //         { x: 3382, y: 3117 },
    //         { x: 3382, y: 3957 }
    //     ],
    //     labels: [{
    //         text: 'styr utformningen\nav',
    //         arrow: '▲',
    //         position: { x: 0, y: 0 }
    //     }]
    // }
];
