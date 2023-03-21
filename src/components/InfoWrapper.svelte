<script lang='ts'>
    import { LayerCake } from 'layercake';
    import InteractiveGraph from './InteractiveGraph.svelte';
    import NodeInfo from './NodeInfo.svelte';
    import { Transition, TransitionChild } from '@rgossiaux/svelte-headlessui';
    import { globalGraph } from '../lib/store';

    import '../lib/calculator';
    import { selectedGraph } from '$lib/store.js';
    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import { drawerStore } from '@skeletonlabs/skeleton';


    let openDetails = false;

    function handleNodeClick(event) {
        for (let n of $globalGraph.nodes) {
            if (n.id === event.detail.id) {
                const settings: DrawerSettings = {
                    id: 'NodeInfo',
                    meta: { node:n }
                };
                drawerStore.open(settings);
            }
        }
        openDetails = true;
    }

    function closeOverlay() {
        openDetails = false;
    }

    function closePress(event) {
        if (event.key === 'Escape') {
            openDetails = false;
        }
    }
</script>

<!-- Primary column -->
<section aria-labelledby='primary-heading'
         class='flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last'
         on:keypress={closePress}>
    <LayerCake>
        <InteractiveGraph graph={$selectedGraph} on:nodeClick={handleNodeClick} />
    </LayerCake>
</section>

<style>

</style>
