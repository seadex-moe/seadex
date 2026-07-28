<script lang='ts'>
  import type { TableViewModel } from 'svelte-headless-table'
  import type { Entry } from '../schemas.js'
  import * as Select from '$lib/components/ui/select'
  import type { Writable } from 'svelte/store'
  import {searchTypes } from '../data.js';


  export let tableModel: TableViewModel<Entry>

  export let value: string = 'title'

  const { pluginStates } = tableModel

</script>

<Select.Root selected={{ value: value, label: searchTypes.get(value)}} onSelectedChange={(selected) => value=selected?.value||'title'}>
  <Select.Trigger class='h-8 w-[150px]'>
    <Select.Value placeholder='Select filter type' />
  </Select.Trigger>
  <Select.Content>
    {#each searchTypes.entries() as [key, value]}
      <Select.Item value='{key}'>{value}</Select.Item>      
    {/each}
  </Select.Content>
</Select.Root>
