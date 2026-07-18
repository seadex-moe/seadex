<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { ExclamationTriangle } from "svelte-radix";
  import { sortTorrents } from "$lib/util";
  import type { TorrentsResponse } from "$lib/pocketbase/generated-types";

  export let entry;

  const bestReleases = [
    ...new Map(
      sortTorrents(entry.expand?.trs)
        .filter(({ isBest }) => isBest)
        .map(trs => [trs.releaseGroup, trs])
    ).values()
  ];

  const altReleases = [
    ...new Map(
      sortTorrents(entry.expand?.trs)
        .filter(({ isBest }) => !isBest)
        .map(trs => [trs.releaseGroup, trs])
    ).values()
  ];

</script>

<a
  href="./{entry.id}"
  class="block rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors"
>
  <div class="flex gap-3">
    <img
      loading="lazy"
      src={entry.coverImage.medium}
      alt={entry.title.userPreferred}
      class="h-28 w-20 rounded object-cover flex-shrink-0"
    />

    <div class="min-w-0 flex-1 space-y-3">

      <div class="flex items-center gap-2">
        <h3 class="font-semibold leading-tight">
          {entry.title.english || entry.title.userPreferred}
        </h3>
        {#if entry.incomplete}
          <span title="Incomplete">
            <ExclamationTriangle class='h-4 w-4 text-red-500'/>
          </span>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="min-w-0">
            <h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Best
            </h4>

            {#if bestReleases.length}
            <div class="space-y-1">
              {#each bestReleases as trs}
                <div class="flex items-center gap-2">
                  <span
                    class="truncate text-sm"
                  >
                    {trs.releaseGroup}
                  </span>

                  {#if trs.dualAudio}
                    <Badge class="bg-white text-zinc-800 dark:bg-zinc-800 dark:text-white">
                      <span>Dual</span>
                    </Badge>
                  {/if}
                </div>
              {/each}
            </div>
            {:else}
            <span class="text-sm text-muted-foreground">
                {entry.theoreticalBest}
            </span>
            {/if}
        </div>

        {#if altReleases.length}
        <div class="min-w-0">
            <h4 class="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Alt
            </h4>

            <div class="space-y-1">
              {#each altReleases as trs}
                <div class="flex items-center gap-2">
                  <span class="truncate text-sm">
                    {trs.releaseGroup}
                  </span>

                  {#if trs.dualAudio}
                    <Badge class="bg-white text-zinc-800 dark:bg-zinc-800 dark:text-white">
                      <span>Dual</span>
                    </Badge>
                  {/if}
              </div>
            {/each}
          </div>
          </div>
          {/if}
        </div>

    </div>
  </div>
</a>
