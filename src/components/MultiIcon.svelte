<script lang="ts">
    import { icons } from '../data/icons.json';
    import { onMount } from 'svelte';
    export let icon: string;

    let svgData;
    onMount(() => {
        let iconData = icons[icon];
        // fetch icon
        fetch("/static/icons/"+iconData+".svg", {cache: "force-cache"})
            .then(response => response.text())
            .then(svg => {
                // replace svg fill color
                svgData = svg;

            });
    });
</script>
{@html svgData}