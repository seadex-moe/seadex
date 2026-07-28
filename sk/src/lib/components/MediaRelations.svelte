<script lang='ts'>
  import { formatMap, type media } from '$lib/anilist'

  export let edges: { node: media }[] | undefined

  export let edit = false

  const edgesFiltered = edges?.filter(({ node }) => node.type === 'ANIME' && node.format !== 'MUSIC' && node.format !== 'CHARACTER') || []
</script>

{#if edgesFiltered?.length}
  <h2 class='font-bold my-4 text-2xl'>Relations</h2>
  <div class='w-full flex flex-wrap gap-4'>
    {#each edgesFiltered as { node }}
      <a href='/{node.id}/{edit ? 'edit' : '' }' class='min-w-[250px] max-w-xs text-decoration-none mb-3'>
        <div class='w-full min-h-32 max-h-36 flex flex-row border rounded items-stretch'>
          <div class="w-32">
            <img src={node.coverImage.extraLarge} alt='cover' class='h-full' style:object-fit='cover' />
          </div>
          <div class='p-2 ps-3 flex flex-col w-full' style:min-width='0'>
            <span class='font-bold w-full'>{node.title.english || node.title.userPreferred}</span>
            <div class='mt-auto flex flex-wrap gap-2'>
              {#if (node.format ?? '') in formatMap}
                <span class='bg-green-100 text-green-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'>{formatMap[node.format]}</span>
              {/if}
              {#if node.seasonYear || node.startDate?.year}
                <span class='bg-blue-100 text-blue-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300'>{node.seasonYear || node.startDate?.year}</span>
              {/if}
              {#if node.episodes && !(node.episodes === 1 && node.format === 'MOVIE')}
                <span class='bg-gray-100 text-gray-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300'>{node.episodes} Episode{node.episodes > 1 ? 's' : ''}</span>
              {/if}
              {#if node.status}
                <span class='bg-gray-100 text-gray-800 text-xs font-medium me-1 px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-300 capitalize'>{node.status.replaceAll('_', '').toLowerCase()}</span>
              {/if}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
