<script lang='ts'>
    import { sortTorrents } from "$lib/util";
    import test from "node:test";
    import { trailingSlash } from "../../../../routes/+layout";
    import type { Entry } from "../schemas";   

    export let entry: Entry
    export let value: string
    export let best: boolean

</script>

{#if value === entry.theoreticalBest}
    <span class='text-gray-400 block whitespace-nowrap'>{value}</span>
{:else}
    {#each [...new Map( sortTorrents(entry.expand?.trs).filter(({ isBest }) => isBest == best).map(torrent => [torrent.releaseGroup, torrent]) ).values() ] as trs}
        <span
        class="text-sm block"
        class:bold={trs.dualAudio}
        class:font-bold={trs.dualAudio}
        >
            {trs.releaseGroup}
        </span>
    {/each}
{/if}
