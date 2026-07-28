<script lang='ts'>
  import EyeNone from 'svelte-radix/EyeNone.svelte'
  import ArrowDown from 'svelte-radix/ArrowDown.svelte'
  import ArrowUp from 'svelte-radix/ArrowUp.svelte'
  import CaretSort from 'svelte-radix/CaretSort.svelte'
  import { Paintbrush } from 'lucide-svelte'
  import type { TableViewModel } from 'svelte-headless-table'
  import type { Entry } from './schemas.js'
  import { cn } from '$lib/utils'
  import { Button } from '$lib/components/ui/button'
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'

  let className: string | undefined | null = ''
  export { className as class }
  export let props: {
    sort: {
      order: 'desc' | 'asc' | undefined;
      toggle: (_: Event) => void;
      clear: () => void;
      disabled: boolean;
    };
  }
  export let tableModel: TableViewModel<Entry>
  export let cellId: string

  const { hiddenColumnIds } = tableModel.pluginStates.hide

  function handleAscSort (e: Event) {
    if (props.sort.order === 'asc') {
      return
    }
    props.sort.toggle(e)
  }

  function handleDescSort (e: Event) {
    if (props.sort.order === 'desc') {
      return
    }
    if (props.sort.order === undefined) {
      // We can only toggle, so we toggle from undefined to 'asc' first
      props.sort.toggle(e)
    }
    props.sort.toggle(e) // Then we toggle from 'asc' to 'desc'
  }

  function handleHide () {
    hiddenColumnIds.update((ids: string[]) => {
      if (ids.includes(cellId)) {
        return ids
      }
      return [...ids, cellId]
    })
  }
</script>

{#if !props.sort.disabled}
  <div class={cn('flex items-center', className)}>
    <Button variant='ghost' class='h-8' size='sm' on:click={props.sort.toggle}>
      <slot />
      {#if props.sort.order === 'desc'}
        <ArrowDown class='ml-2 h-4 w-4' />
      {:else if props.sort.order === 'asc'}
        <ArrowUp class='ml-2 h-4 w-4' />
      {:else}
        <CaretSort class='ml-2 h-4 w-4' />
      {/if}
    </Button>
  </div>
{:else}
  <slot />
{/if}
