<script lang='ts'>
    import InfoWrapper from '../components/InfoWrapper.svelte';

    import { onMount } from 'svelte';
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { fetchData } from '../lib/graphLoader';

    let loading = true;



    onMount(async () => {
        await fetchData();
        loading = false;
    });

</script>


{#if !loading}
    <InfoWrapper />
{:else }
    <div class='loading'>
        <h1 class='p-10'>Loading...</h1>
        <div class="w-full max-w-[320px] mx-auto space-y-4">
            <ProgressRadial stroke='40' value={undefined} />
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