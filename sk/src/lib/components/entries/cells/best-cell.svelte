<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { sortTorrents } from "$lib/util";
  import type { Entry } from "../schemas";

  export let entry: Entry;
  export let value: string;
  export let best: boolean;
</script>

{#if value === entry.theoreticalBest}
  <span class="text-gray-400 block whitespace-nowrap">{value}</span>
{:else}
  {#each [...new Map(sortTorrents(entry.expand?.trs)
        .filter(({ isBest }) => isBest == best)
        .map((torrent) => [torrent.releaseGroup, torrent])).values()] as trs}
    <div class="flex items-center gap-2 min-h-5">
      <span class="text-sm block">
        {trs.releaseGroup}
      </span>
      {#if trs.dualAudio}
        <Badge class="inline-flex items-center justify-center h-5 px-1 text-[11px] bg-white text-zinc-800 dark:bg-zinc-800 dark:text-white">
          Dual
        </Badge>
      {/if}
    </div>
  {/each}
{/if}
