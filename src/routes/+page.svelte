<script lang="ts">
    import InfoWrapper from "../components/InfoWrapper.svelte";

    import { onMount } from "svelte";
    import { ProgressRadial } from "@skeletonlabs/skeleton";
    import { availableConstellations, selectedConstellation } from "$lib/store";
    import { fetchData, fetchIndex } from "$lib/graphLoader";
    import { queryParam, ssp } from "sveltekit-search-params";

    let loading = true;


    onMount(async () => {
        let sub1 = selectedConstellation.subscribe(async (value: string) => {
            if (value != "") {
                loading = true;
                await fetchData(value);
                loading = false;
            }
        });

        await fetchIndex();
        loading = false;

        const file = queryParam("file", ssp.string(""));
        let sub2 = file.subscribe((value) => {
            if (value != "") {
                selectedConstellation.set(value);
            }
        });

        return () => {
            sub1();
            sub2();
        };
    });

    function triggerFetch(f: string) {
        const file = queryParam("file", ssp.string(""));
        file.set(f);
    }

</script>


{#if !loading}
    {#if $selectedConstellation !== ""}
        <InfoWrapper />
    {:else }
        <!-- show list of available constellations -->
        <h1 class="p-10">Available Constellations</h1>
        <h2 class="p-10">Click on a constellation to view it</h2>
        {#each $availableConstellations as v}
            <h3 class="p-10">
                <button class='btn variant-ghost-primary' on:click={triggerFetch(v.fileName)}>{v.name}</button>
            </h3>
        {/each}
    {/if}
{:else }
    <div class="loading">
        <h1 class="p-10">Loading...</h1>
        <div class="w-full max-w-[320px] mx-auto space-y-4">
            <ProgressRadial stroke="40" value={undefined} />
        </div>
    </div>
{/if}

<style>
    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>