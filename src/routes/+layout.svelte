<script lang='ts'>

    //import '../theme.postcss';
    import '../app.postcss';
    import '@fortawesome/fontawesome-free/css/all.css';
    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import {
        AppBar,
        AppShell,
        Drawer,
        InputChip,
        LightSwitch,
        SlideToggle,
        storeHighlightJs,
        getDrawerStore,
        Toast,
        initializeStores
    } from '@skeletonlabs/skeleton';
    import Query from 'carbon-icons-svelte/lib/Query.svelte';

    import { includeNeighbours, labelsFilter, search, showLabels, triggersOnly } from "$lib/store";

    import hljs from 'highlight.js';
    import 'highlight.js/styles/github-dark.css';
    import NodeInfo from '../components/NodeInfo.svelte';
    import type { Constellation } from "$lib/Constellation";
    import { onMount } from 'svelte';
    import { queryParam, ssp } from 'sveltekit-search-params';
    import { fetchData } from '$lib/graphLoader';

    storeHighlightJs.set(hljs);


    initializeStores();

    // Drawer Handler
    function drawerOpen(): void {
        const s: DrawerSettings = { id: 'doc-sidenav' };
        getDrawerStore().open(s);
    }


    async function showInfo(): Promise<Constellation> {
        const res = await fetch(`/api/info`);
        console.log(await res.text());
    }

    onMount(() => {
        showInfo();

        const searchParam = queryParam('search', ssp.string(''));

        let unsubSearch = search.subscribe((v) => {
            searchParam.set(v);
            console.log('search changed', v);
        });
        let unsubSearchParam = searchParam.subscribe((v) => {
            search.set(v);
            console.log('search param changed', v);
        });

        return () => {
            unsubSearch();
            unsubSearchParam();
        };
    });


    console.log('                             .,\n' +
        '                  ...,     .+D     `.V!\n' +
        '            ..JgMMMMM!    .M#`  ` .dF       .\n' +
        '         .JMMMMMMMMM%    dMM\'    JM#     .+F\n' +
        '      .J,.TMMMMMMMM#    dMMF    JMM:    JMF\n' +
        '    .dMMM@  `TMMMMM@   JMMM:   .MMF    dMM`    .#^`\n' +
        '   .MMMMMr     `TMM# `.MMMM:  .MMM:   JMMF   .dM\'       ` .\n' +
        '  .MMMMMML       ..= MMMMMM\'JMMMM#!...MMM%  .MM%    `.JNM@\'\n' +
        ' .M^,MMMMMe   ` .MMb MMMM3.rdMM#1+,JMMMMY`.JMMM:   .+MM#\'\n' +
        '.MMNbJMMMMMN...MMMM# MMM%.M%?M#.MM;JMMM!d%dMMM=.,.NMMMB\n' +
        '.MMMMMMMMMMMMMMMMMM% ?Y7.MMr   ,MMr   `JMr,YW\'JMFJMM@..,\n' +
        '.TMMMMMM2    ?TMM9!     .MM@    dMb    `Mb    ?Mr.T9.MMN,\n' +
        ' ...J7TY9   JaJ..        JMN.   .MN.    WN     Wb   .TMMMJ\n' +
        '  dMNJMN.JgMMMMN,         MMr    ,Mb`    Wl     T       `?\'\n' +
        '    7MMMMMMMMMMMN,        .MN.    .Wl     7\n' +
        '       ?THMMMMMMMMN,       .Hb      ?\n' +
        '             ?TWMMMMMx       T,`');
</script>

<svelte:head>
    <title>kokabieli - your constellation info</title>
</svelte:head>


<Toast />

<Drawer>
    {#if getDrawerStore().id === 'NodeInfo'}
        <NodeInfo node={getDrawerStore().meta.node} />
    {:else if getDrawerStore().id === 'doc-sidenav' }
        <div class='p-4'>
            <div class='p-4'>
                <h3>
                    <span
                        class='bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone'>
                        kokabieli
                    </span>
                    <LightSwitch class='ml-48' />
                </h3>
            </div>
            <div class='label w-96 p-4'>
                <div class='input-group input-group-divider grid-cols-[auto_1fr_auto]'>
                    <div class='input-group-shim'>
                        <Query />
                    </div>
                    <input type='search' placeholder='Search...' bind:value={$search} />
                </div>
            </div>
            <div class='label w-96 p-4'>
                <InputChip name='labels' placeholder='enter labels (app=selected)' bind:value={$labelsFilter}>labels
                </InputChip>
            </div>
            <div class='p-4'>
                <SlideToggle name='triggers' size='sm' bind:checked={$triggersOnly}>only triggers</SlideToggle>
            </div>
            <div class='p-4'>
                <SlideToggle name='neighbours' size='sm' bind:checked={$includeNeighbours}>include neighbours
                </SlideToggle>
            </div>
            <div class='p-4'>
                <SlideToggle name='labels' size='sm' bind:checked={$showLabels}>show labels</SlideToggle>
            </div>
            <div class='p-4'>
                <button class='btn variant-ghost-primary' on:click={fetchData}>fetch graph</button>
            </div>
        </div>
    {:else }
        <p>(no info)</p>
    {/if}
</Drawer>
<!-- App Shell -->
<AppShell>
    <svelte:fragment slot='header'>
        <!-- App Bar -->
        <AppBar padding='p-2'>
            <svelte:fragment slot='lead'>
                <div class='flex items-center px-2 lg:px-0'>
                    <div class='flex-shrink-0 sm:px-4'>
                        <img alt='kokabieli' class='block h-8 w-8' src='/kokabieli.svg'>

                    </div>
                    <div class='ml-10 block'>
                        <h3>
                            <span
                                class='bg-gradient-to-br from-primary-500 via-tertiary-500 to-secondary-500 bg-clip-text text-transparent box-decoration-clone'>
                                kokabieli
                            </span>
                        </h3>
                    </div>
                </div>
            </svelte:fragment>
            <svelte:fragment slot='trail'>
                <SlideToggle bind:checked={$triggersOnly} class='hidden lg:block' name='triggers' size='sm'>only
                    triggers
                </SlideToggle>
                <SlideToggle bind:checked={$includeNeighbours} class='hidden lg:block' name='neighbours' size='sm'>
                    include neighbours
                </SlideToggle>
                <SlideToggle bind:checked={$showLabels} class='hidden lg:block' name='labels' size='sm'>show labels
                </SlideToggle>
                <div class='label md:w-96 lg:w-64 hidden md:block'>
                    <div class='input-group input-group-divider grid-cols-[auto_1fr_auto]'>
                        <div class='input-group-shim'>
                            <Query />
                        </div>
                        <input bind:value={$search} placeholder='Search...' type='search' />
                    </div>
                </div>
                <LightSwitch class='hidden md:block' />
                <div>
                    <button class='btn-icon btn-icon-sm' on:click={drawerOpen}>
                        <i class='fa-solid fa-bars text-2xl' />
                    </button>
                </div>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>
