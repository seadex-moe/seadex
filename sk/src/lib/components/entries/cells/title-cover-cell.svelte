<script lang='ts'>
    import type { Entry } from "../schemas";
    import { ExclamationTriangle } from 'svelte-radix'    

    export let entry: Entry
</script>

<div class="flex items-center gap-2">
    <img loading='lazy' src={entry.coverImage.medium || ''} alt='cover' class='rounded h-full w-10' style:--color={entry.coverImage.color || '#1890ff'} />
    <span class="ml-3 align-middle ">{entry.title.english || entry.title.userPreferred}</span>
    {#if entry.incomplete}
        <span title="Incomplete">
            <ExclamationTriangle class='h-4 w-4 text-red-500'/>
        </span>
    {/if}
</div>
