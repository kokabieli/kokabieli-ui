<script lang='ts'>
    import InfoWrapper from '../../components/InfoWrapper.svelte';

    import { onMount } from 'svelte';
    import { load } from 'js-yaml';

    import { rawData } from "$lib/store";
    import type { Constellation } from "$lib/Constellation";
    import type { ToastSettings } from '@skeletonlabs/skeleton';
    import { getToastStore } from '@skeletonlabs/skeleton';


    const example = "interfaces:\n" +
        "  - id: di1\n" +
        "    name: Interface 1\n" +
        "    type: topic\n" +
        "    description: This is a kafka topic\n" +
        "  - id: di2\n" +
        "    name: Interface 2\n" +
        "    type: topic\n" +
        "    description: This is a kafka topic\n" +
        "  - id: di3\n" +
        "    name: Interface 3\n" +
        "    type: db\n" +
        "    description: This is a database\n" +
        "processes:\n" +
        "  - id: process1\n" +
        "    name: Process 1\n" +
        "    type: spring-boot\n" +
        "    inputs:\n" +
        "      - source: di1\n" +
        "        info: This is a source\n" +
        "        trigger: true\n" +
        "      - source: di2\n" +
        "        info: This is a source\n" +
        "    outputs:\n" +
        "      - target: di3\n" +
        "        info: This is a target\n" +
        "    labels:\n" +
        "      app: process1\n" +
        "    description: This is a process\n";

    let fullText = example;


    onMount(async () => {
        //rawData.set(load(example, {}) as Constellation);


        return () => {
            console.log('destroy');
        };
    });

    function loadGraph() {
        rawData.set({ interfaces: [], processes: [] });
        try {
            rawData.set(load(fullText, {}) as Constellation);
            const t: ToastSettings = {
                message: 'loaded graph',
                // Optional: Presets for primary | secondary | tertiary | warning
                preset: 'success',
                // Optional: The auto-hide settings
                autohide: true,
                timeout: 1000
                // Optional: Adds a custom action button

            };
            getToastStore().trigger(t);
        } catch (e) {
            console.error(e);
            const t: ToastSettings = {
                message: 'Error loading graph\n' + e.message,
                // Optional: Presets for primary | secondary | tertiary | warning
                preset: 'warning',
                // Optional: The auto-hide settings
                autohide: true,
                timeout: 5000
                // Optional: Adds a custom action button

            };
            getToastStore().trigger(t);
        }
    }

    function checkEnter(e) {
        console.log(e);
        if(e.code == "Enter" && e.ctrlKey) {
            loadGraph();
        }
    }

    let textArea;



</script>

<div class='flex flex-row h-full'>
    <div class='basis-1/2 lex h-full min-w-0 overflow-y-auto editor-side'>
        <button class='btn btn-default variant-filled-primary load-btn' on:click={loadGraph}>load graph</button>
        <textarea on:keydown={checkEnter} bind:this={textArea} bind:value={fullText} class='h-full w-full variant-ghost-secondary text-area' />
    </div>
    <div class='basis-1/2'>
        <InfoWrapper />
    </div>
</div>

<style>
    .editor-side {
        position: relative;
    }
    .load-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 1;
    }
    .text-area{
        font-family: monospace;
    }
</style>
