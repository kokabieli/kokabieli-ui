<script lang="ts">
  import { LayerCake } from "layercake";
  import InteractiveGraph from "./InteractiveGraph.svelte";
  import { globalGraph, selectedGraph } from "$lib/store";

    import '../lib/calculator';
    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import { getDrawerStore } from '@skeletonlabs/skeleton';


  let openDetails = false;
  const drawerStore = getDrawerStore();

  function handleNodeClick(event: any) {
    for (let n of $globalGraph.nodes) {
      if (n.id === event.detail.id) {
        const settings: DrawerSettings = {
          id: "NodeInfo",
          meta: { node: n }
        };
        drawerStore.open(settings);
      }
    }
    openDetails = true;
  }

  function closeOverlay() {
    openDetails = false;
  }

  function closePress(event: any) {
    if (event.key === "Escape") {
      openDetails = false;
    }
  }
</script>

<!-- Primary column -->
<section aria-labelledby="primary-heading"
         class="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last"
         on:keypress={closePress}>
  <LayerCake>
    <InteractiveGraph graph={$selectedGraph} on:nodeClick={handleNodeClick} />
  </LayerCake>
</section>

<style>

</style>
