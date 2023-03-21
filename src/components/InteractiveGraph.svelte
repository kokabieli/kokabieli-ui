<script lang='ts'>
    import { createEventDispatcher, getContext, onMount } from 'svelte';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
    import { schemeCategory10 } from 'd3-scale-chromatic';
    import { select, selectAll } from 'd3-selection';
    import { drag } from 'd3-drag';
    import type { Simulation } from 'd3-force';
    import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation } from 'd3-force';
    import { showLabels } from '../lib/store.js';
    import type { Graph, Link, Node } from '../lib/Graph';

    import { icons } from '../data/icons.json';

    import { GraphicalDataFlow, ZoomFit } from 'carbon-icons-svelte';
    import MultiIcon from './MultiIcon.svelte';

    const icon = icons;
    export let graph: Graph = { links: [], nodes: [] };
    const dispatch = createEventDispatcher();

    let d3 = {
        zoom,
        zoomIdentity,
        zoomTransform,
        scaleLinear,
        scaleOrdinal,
        schemeCategory10,
        select,
        selectAll,
        drag,
        forceSimulation,
        forceLink,
        forceManyBody,
        forceCenter,
        forceCollide
    };

    const { width, height } = getContext('LayerCake');
    let svg;
    let actualWidth = $width;
    let actualHeight = $height;
    const nodeRadius = 20;
    let links: Link[] = [];
    let nodes: Node[] = [];

    let transform = d3.zoomIdentity;
    let simulation: Simulation<Node, Link> | undefined;


    function mergeNodes(nodes: Node[], nodes2: Node[]): { nodes: Node[], recalcLinks: boolean } {
        const result: Node[] = [];
        let removedNode = false;
        let addedNode = false;
        for (let i = 0; i < nodes.length; i++) {
            const existing = nodes2.find((n) => n.id == nodes[i].id);
            if (!existing) {
                removedNode = true;
            }
        }

        for (let i = 0; i < nodes2.length; i++) {
            const node = nodes2[i];
            const existing = nodes.find((n) => n.id == node.id);
            if (existing) {
                existing.name = node.name;
                existing.shortName = node.shortName;
                existing.description = node.description;
                existing.type = node.type;
                existing.color = node.color;
                existing.icon = node.icon;
                existing.data = node.data;
                existing.selected = node.selected;
                existing.matched = node.matched;
                existing.includeSources = node.includeSources;
                existing.includeTargets = node.includeTargets;
                result.push(existing);
            } else {
                addedNode = true;
                result.push(node);
            }
        }

        return { nodes: result, recalcLinks: removedNode || addedNode };
    }

    function addNodesToLinks(newLinks: Link[], nodes: Node[]) {
        for (let i = 0; i < newLinks.length; i++) {
            const link = newLinks[i];
            const source = nodes.find((n) => n.id == link.sourceId);
            const target = nodes.find((n) => n.id == link.targetId);
            if (source && target) {
                link.source = source;
                link.target = target;
            }
        }
    }

    $:{
        let newLinks = graph.links.map((d) => Object.create(d));
        let newNodes = mergeNodes(nodes, graph.nodes);
        addNodesToLinks(newLinks, newNodes.nodes);
        if (simulation != undefined) {
            //simulation.stop();
            if (newNodes.recalcLinks) {
                nodes = newNodes.nodes;
                links = newLinks;
                simulation.stop();
                startSimulation();
            }
        } else {
            nodes = newNodes.nodes;
            links = newLinks;
            startSimulation();
        }
    }

    function startSimulation() {
        simulation = d3
            .forceSimulation(nodes)
            .force('center', d3.forceCenter($width / 2, $height / 2).strength(1.2))
            .force('collide', d3.forceCollide().radius(nodeRadius + 25).iterations(2))
            .force('link', d3.forceLink(links).strength(0.4).iterations(3).strength(0.05).distance((d) => (d.trigger ? 60 : 90)))
            .force('charge', d3.forceManyBody().strength(-400).distanceMin(100).distanceMax(400))
            .alphaDecay(0.01)
            .on('tick', simulationUpdate);

        d3.select(svg)
            .call(
                d3
                    .drag()
                    .container(svg)
                    .subject(dragsubject)
                    .on('start', dragstarted)
                    .on('drag', dragged)
                    .on('end', dragended)
            )
            .call(
                d3
                    .zoom()
                    .scaleExtent([1 / 10, 8])
                    .on('zoom', zoomed)
            );
    }

    onMount(() => {
        // I'm too stupid to wait for width properly initializing, so we just wait a bit,
        // before starting the animation, so that it centers properly
        setTimeout(startSimulation, 50);
    });

    function simulationUpdate() {
        simulation.tick();
        nodes = [...nodes];
        links = [...links];
    }

    function zoomed(currentEvent) {
        transform = currentEvent.transform;
        simulationUpdate();
    }

    function dragsubject(currentEvent) {
        const node = simulation.find(
            transform.invertX(currentEvent.x),
            transform.invertY(currentEvent.y),
            nodeRadius
        );
        if (node) {
            node.x = transform.applyX(node.x);
            svg;
            node.y = transform.applyY(node.y);
        }
        return node;
    }

    function dragstarted(currentEvent) {
        if (!currentEvent.active) simulation?.alphaTarget(0.3).restart();
        currentEvent.subject.fx = transform.invertX(currentEvent.subject.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.subject.y);
    }

    function dragged(currentEvent) {
        currentEvent.subject.fx = transform.invertX(currentEvent.x);
        currentEvent.subject.fy = transform.invertY(currentEvent.y);
    }

    function dragended(currentEvent) {
        if (!currentEvent.active) simulation.alphaTarget(0);
        currentEvent.subject.fx = null;
        currentEvent.subject.fy = null;
    }

    function resize() {
        ({ actualWidth, actualHeight } = svg.getBoundingClientRect());
    }


    function mapLink(d) {
        const m_size = nodeRadius + 22;
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const gamma = Math.atan2(dy, dx); // Math.atan2 returns the angle in the correct quadrant as opposed to Math.atan
        const tx2 = d.target.x - (Math.cos(gamma) * m_size);
        const ty2 = d.target.y - (Math.sin(gamma) * m_size);
        const tx1 = d.source.x + (Math.cos(gamma) * nodeRadius);
        const ty1 = d.source.y + (Math.sin(gamma) * nodeRadius);
        if (isNaN(tx1)) {
            return {
                link: d,
                x1: d.source.x,
                y1: d.source.y,
                x2: d.target.x,
                y2: d.target.y
            };
        }
        return {
            link: d,
            x1: tx1,
            y1: ty1,
            x2: tx2,
            y2: ty2
        };
    }

    function clickNode(e) {
        hoveredNode = null;
        dispatch('nodeClick', {
            id: e.target.id
        });
    }

    function zoomFit() {
        const box = svg.getBBox();
        const boxX = transform.invertX(box.x);
        const boxY = transform.invertY(box.y);
        const boxW = transform.invertX(box.x+box.width)-boxX
        const boxH = transform.invertY(box.y+box.height)-boxY;
        const bounds = svg.getBoundingClientRect()

        const scale = Math.min(bounds.width / boxW, bounds.height / boxH);

        transform = d3.zoomIdentity;
        transform = transform.translate(bounds.width / 2, bounds.height / 2);
        transform = transform.scale(scale*0.9);
        transform = transform.translate(-boxX - boxW / 2, -boxY - boxH / 2);

        d3.zoom().transform(d3.select(svg), transform);

    }

    let hoveredNode = null;
    let hoverX = 100;
    let hoverY = 100;

    function mouseMove(e) {
        let bounding = svg.getBoundingClientRect();
        const x = transform.invertX(e.clientX-bounding.x);
        const y = transform.invertY(e.clientY-bounding.y);
        const node = simulation.find(x, y, nodeRadius+5);
        if (node) {
            hoveredNode = node;
            hoverX = transform.applyX(node.x-nodeRadius-10);
            hoverY = transform.applyY(node.y+nodeRadius+25);
        } else {
            hoveredNode = null;
        }
    }

</script>

{#if (hoveredNode)}
    <div class='shadow-xl border-2 variant-filled-surface' style="position: absolute; left: {hoverX}px; top: {hoverY}px" transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
        <ul class="list text-sm">
            <li>
                <span class='w-12'>Name</span>
                <span class="flex-auto">{hoveredNode.name}</span>
            </li>
            {#if hoveredNode.description}
                <li>
                    <span class='w-12'>Description</span>
                    <span class="flex-auto">{hoveredNode.description}</span>
                </li>
            {/if}
            {#if hoveredNode.type}
                <li>
                    <span class='w-12'>Type</span>
                    <span class="flex-auto">{hoveredNode.type}</span>
                </li>
            {/if}
            {#if hoveredNode.labels.length > 0}
                <li>
                    <span class='w-12'>Labels</span>
                    <span class="flex-auto">
                        <ul class='list'>
                        {#each hoveredNode.labels as label}
                            <li>{label.key}:{label.value}</li>
                        {/each}
                        </ul>
                    </span>
                </li>
            {/if}
        </ul>

</div>
{/if}


<svelte:window on:resize={resize} />
<!-- SVG was here -->
<svg bind:this={svg} on:mousemove={mouseMove}>
    <defs>
        <marker
            class='marker'
            id='arrow'
            markerHeight='6'
            markerWidth='6'
            orient='auto'
            refX='0'
            refY='0'
            viewBox='0 -5 10 10'>
            <path d='M0,-5L10,0L0,5'></path>
        </marker>
    </defs>
    {#each links.map(mapLink) as link}
        <g class:trigger={link.link.trigger}
           class='graph-link'>
            <line
                x1={link.x1}
                y1={link.y1}
                x2={link.x2}
                y2={link.y2}
                marker-end='url(#arrow)'
                transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'
            >
                <title>{link.link.name}</title>
            </line>
        </g>
    {/each}

    {#each nodes as point}
        {#if !isNaN(point.x)}
            <g id={point.data.id+'-parent'}
               class:selected={point.selected}>

                <circle
                    on:click={clickNode}
                    on:keypress={clickNode}
                    id={point.data.id}
                    class='node'
                    stroke-width='3'
                    r={nodeRadius}
                    cx={point.x}
                    cy={point.y}
                    transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'
                >
                </circle>
                <g transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
                    <svg
                        x={point.x-nodeRadius+6} y={point.y-nodeRadius+6}
                        width={nodeRadius*2-12} height={nodeRadius*2-12}
                        style='pointer-events: none'
                        class='node-icon'
                    >
                        <MultiIcon icon={point.icon} />
                    </svg>
                </g>
            </g>
            {#if $showLabels}
                <text x={point.x} y={point.y+nodeRadius*2-4} text-anchor='middle' font-size={nodeRadius-8}
                      class='name-text'
                      transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>{point.shortName}</text>
            {/if}
        {/if}
    {/each}
</svg>

<div class='button-bar flex p-3'>
    <div class=' p-1'>
        <button class='inline-flex items-center btn btn-sm variant-ringed-surface'
                on:click={startSimulation}>
            <GraphicalDataFlow size='32' />
        </button>
    </div>
    <div class='p-1'>
        <button class='inline-flex items-center btn btn-sm variant-ringed-surface'
                on:click={zoomFit}>
            <ZoomFit size='32' />
        </button>
    </div>
</div>
<style lang='postcss'>
    svg {
        width: 100%;
        height: 100%;
    }

    .name-text {
        paint-order: stroke;
        stroke: #ffffff;
        stroke-opacity: 0.9;
        stroke-width: 4px;
        stroke-linecap: butt;
        stroke-linejoin: miter;
        font-weight: 800;
    }

    .button-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
    }



    .node-icon  {
        fill: rgba(var(--theme-font-color-dark))
    }
    :global(.dark) .node-icon {
        fill: rgba(var(--theme-font-color-base))
    }

    .node {
        fill: rgba(var(--color-surface-900))
    }
    :global(.dark) .node {
        fill: rgba(var(--color-surface-50))
    }

    .selected .node {
        fill: rgba(var(--color-primary-900))

    }
    :global(.dark) .selected .node{
        fill: rgba(var(--color-primary-50))
    }

    .graph-link {
        stroke-width: 2px;
        stroke: rgba(var(--color-surface-900))
    }

    :global(.dark) .graph-link {
        stroke: rgba(var(--color-surface-50))
    }

    .graph-link.trigger {
        stroke: rgba(var(--color-primary-900))
    }

    :global(.dark) .graph-link.trigger {
        stroke: rgba(var(--color-primary-50))
    }

    .marker {
        fill: rgba(var(--color-surface-900))
    }
    :global(.dark) .marker {
        fill: rgba(var(--color-surface-50))
    }



</style>
