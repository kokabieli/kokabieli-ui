<script lang='ts'>
    import { labelsFilter, searchFrom, searchTo } from '../lib/store';
    import type { Node } from '../lib/Graph';
    import { clearFromTo } from '../lib/calculatorSearchResult';
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import { Add,Subtract } from 'carbon-icons-svelte';

    export let node: Node;

    let labels: any[];
    $:{
        let newLabels = [];
        for (let label of node.labels) {
            newLabels.push({
                fullKey: label.key + '=' + label.value,
                fullFiltered: $labelsFilter.includes(label.key + '=' + label.value),
                key: label.key,
                value: label.value,
                keyFiltered: $labelsFilter.includes(label.key)
            });
        }
        labels = newLabels;
    }

    function removeFromTo() {
        clearFromTo();
    }

    function filterFrom() {
        searchFrom.set(node.id);
    }

    function filterTo() {
        searchTo.set(node.id);
    }

    function addLabel(label) {
        labelsFilter.update(f => [...f, label]);
    }

    function removeLabel(label) {
        labelsFilter.update(f => f.filter(f => f !== label));
    }

</script>
{#if node.data === undefined}
    <p>could not find data</p>
{:else }
    <div class='p-10'>
    <h2 class='p-5'>{node.name}</h2>
    <ul class='list p-5'>
        <li><span class='w-48'>Id</span>
            <span>{node.data.id}</span>
        </li>
        <li><span class='w-48'>Filter</span>
            <span>
                        <button
                            class='btn btn-sm'
                            class:variant-ghost-secondary={$searchFrom === node.id}
                            class:variant-ghost-primary={$searchFrom !== node.id}
                            on:click={filterFrom}>
                            From Node
                        </button>
                        <button
                            class='btn btn-sm variant-ghost-primary'
                            class:variant-ghost-secondary={$searchTo === node.id}
                            class:variant-ghost-primary={$searchTo !== node.id}
                            on:click={filterTo}>
                            To Node
                        </button>
                        <button
                            class='btn btn-sm variant-ghost-primary'
                            on:click={removeFromTo} disabled={!($searchFrom || $searchTo)}>
                            Remove Filter
                        </button>
        </span>
        </li>
        <li>
            <span class='w-48'>Description</span>
            <span>{node.data.description}</span>
        </li>
        <li><span class='w-48'>Type</span><span>{node.data.type}</span></li>
        <li><span class='w-48'>Labels</span><span> {#if (labels.length > 0)}
                    <ul class='divide-y divide-gray-200 rounded-md border border-gray-200'>
                        {#each labels as l}
                            <li class='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                                <dt class='flex-1 truncate'>{l.key}
                                    {#if l.keyFiltered}

                                        <button on:click={()=>removeLabel(l.key)}
                                                class='variant-ghost-secondary inline-flex items-center rounded-full p-0'>
                                            <Subtract class='h-4 w-4' />
                                        </button>
                                    {:else}
                                        <button on:click={()=>addLabel(l.key)}
                                                class='variant-ghost-primary inline-flex items-center rounded-full p-0'>
                                            <Add class='h-4 w-4' />
                                        </button>
                                    {/if}
                                     =
                                </dt>
                                <dd class='ml-4'>{l.value}
                                    {#if l.fullFiltered}

                                        <button on:click={()=>removeLabel(l.fullKey)}
                                                class='variant-ghost-secondary inline-flex items-center rounded-full p-0'>
                                            <Subtract class='h-4 w-4' />
                                        </button>
                                    {:else}
                                        <button on:click={()=>addLabel(l.fullKey)}
                                                class='variant-ghost-primary inline-flex items-center rounded-full p-0'>
                                            <Add class='h-4 w-4' />
                                        </button>
                                    {/if}
                                </dd>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class='text-sm text-gray-500'>No labels</p>
                {/if}
                </span></li>
        <li><span class='w-48'>Matched</span><span>{node.matched}</span></li>
        <li><span class='w-48'>Type</span><span>{node.data.type}</span></li>
        <li><span class='w-48'>Inputs</span><span>{#if (node.data.inputs != null && node.data.inputs.length > 0)}
                    <ul class='divide-y divide-gray-200 rounded-md border border-gray-200'>
                        {#each node.data.inputs as i}
                            <li class='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                                <dt class='ml-2 w-0 flex-1 truncate'>{i.source}</dt>
                                <dd>
                                    {#if (i.trigger)}is trigger{/if}
                                </dd>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>No defined Inputs</p>
                {/if}
                </span></li>
        <li><span class='w-48'>Outputs</span><span> {#if (node.data.outputs != null && node.data.outputs.length > 0)}
                    <ul class='divide-y divide-gray-200 rounded-md border border-gray-200'>
                        {#each node.data.outputs as o}
                            <li class='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                                <dt class='ml-2 w-0 flex-1 truncate'>{o.target}</dt>
                                <dd>
                                    {#if (o.trigger)}is trigger{/if}
                                </dd>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>No defined Outputs</p>
                {/if}
                </span></li>
        <li><span class='w-48'>Data</span><span><CodeBlock language='json' code={JSON.stringify(node.data, null, 2)} /></span>
        </li>
    </ul>
    </div>
{/if}
