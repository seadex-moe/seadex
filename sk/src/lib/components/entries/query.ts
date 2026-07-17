import { writable, type Writable } from 'simple-store-svelte'
import { type ProgressBar } from '@prgm/sveltekit-progress-bar'
import type { Entry } from './schemas'
import type { SortKey } from 'svelte-headless-table/plugins'
import { idList, type alResponse, type media } from '$lib/anilist'
import { client } from '$lib/pocketbase'
import type { ListResult } from 'pocketbase'
import type { EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'
import { searchTypes } from './data'

export const data = writable<Entry[]>([])

export const serverItemCount = writable(0)

export const progress: Writable<ProgressBar | null> = writable(null)

export const loading = writable(false)

type Texpand = {
  trs: TorrentsResponse[]
}

const SORT_ID_MAP: { [key: string]: string } = {
  episodes: 'EPISODES',
  seasonYear: 'START_DATE',
  title: 'TITLE_ROMAJI',
  format: 'FORMAT'
}

const POCKETBASE_SORTERS_LIST: string[] = ['updated']
const POCKETBASE_SEARCH_LIST: string[] = ['release_group', 'release_group_best', 'release_group_alt']

function getPocketBaseFilter(search:string | undefined, searchType:string) {

  if (search == null || search == undefined) return ''

  let filter = ''
  if (searchType.startsWith("release_group")) {
    filter += `trs.releaseGroup?~"${search}"`

    if (searchType.endsWith("best")) {
      filter += '&&trs.isBest?=true'
    } else if (searchType.endsWith("alt")) {
      filter += '&&trs.isBest?=false'
    }
  } 

  return filter
}

// these loads have race conditions, oh well

async function load (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids?: number[]) {
  const sortID = sortKeys[0]?.id
  let sort = SORT_ID_MAP[sortID] || undefined
  const search = filterValues.title as string || undefined
  const searchType = filterValues.searchType as string || 'title'

  const entries: Entry[] = []

  const isPocketBaseSort = POCKETBASE_SORTERS_LIST.includes(sortID)
  const isPocketBaseSearch = POCKETBASE_SEARCH_LIST.includes(searchType)
  const isPocketBase = isPocketBaseSort || isPocketBaseSearch

  if (sort && sortKeys[0].order === 'desc') {
    sort += '_DESC'
  }

  
  let alRes: alResponse | undefined
  if ((isPocketBaseSort && (search != null && search != undefined) ) || !isPocketBase) alRes = await idList({ ids, pageIndex, perPage, search, sort, format: (filterValues.format as string[])?.length ? filterValues.format as string[] : undefined })
  let filter = (alRes) ? alRes?.media.map(({ id }) => 'alID=' + id).join('||') : ''

  const pbFilter = getPocketBaseFilter(search, searchType)
  if (isPocketBaseSearch && pbFilter) {
    if (filter) {
      filter = `${filter}||${pbFilter}`
    } else {
      filter = pbFilter
    }
  }

  progress.value?.setWidthRatio(0.7)
  progress.value?.animate()
  const res: ListResult<EntriesResponse<Texpand>> = await client.collection('entries').getList(isPocketBase ? pageIndex + 1 : 1, perPage, {
    filter: filter,
    sort: isPocketBaseSort ? `${sortKeys[0].order === 'desc' ? '-' : ''}${sortID}` : '',
    skipTotal: !isPocketBaseSearch,
    expand: 'trs'
  })

  // Check needed to use sorting from pocketbase or anilist.
  if (isPocketBase) {
    if (!alRes) { alRes = await idList({ ids: res.items.map(x => x.alID), pageIndex: 0, perPage, search: isPocketBaseSearch ? undefined : search, sort, format: undefined }) }
    const dbmap: { [key: string]: media } = {}
    for (const media of alRes!.media) {
      dbmap[media.id] = media
    }

    for (const entry of res.items) {
      const media = dbmap[entry.alID] || {}
      const obj = {
        ...entry,
        ...media,
        dbid: entry?.alID ? '' + entry.alID : ''
      } as Entry
      entries.push(obj)
    }
  } else {
    const dbmap: { [key: string]: EntriesResponse<Texpand> } = {}
    for (const entry of res.items) {
      dbmap[entry.alID] = entry
    }

    for (const media of alRes!.media) {
      const entry = dbmap[media.id] || {}
      const obj = {
        ...entry,
        ...media,
        dbid: entry?.id ? '' + entry.id : ''
      } as Entry
      entries.push(obj)
    }
  }
  if (isPocketBaseSearch) {
    serverItemCount.value = Math.min(ids?.length || Infinity, res!.totalItems)
  } else {
    serverItemCount.value = Math.min(ids?.length || Infinity, alRes!.pageInfo.total)
  }
  progress.value?.complete()
  return entries
}

export async function loadFromCache (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids: number[]) {
  const cache = localStorage.getItem('entries')
  if (cache) {
    try {
      const entries = JSON.parse(cache) as Entry[]
      data.value = entries.filter(entry => ids.includes(entry.alID))
      serverItemCount.value = entries.length
    } catch (e) {
      localStorage.removeItem('entries')
    }
  }
  const res = await load(pageIndex, perPage, filterValues, sortKeys, ids)
  data.value = res
  localStorage.setItem('entries', JSON.stringify(res))
}

export async function query (pageIndex: number, perPage: number, filterValues: Record<string, unknown>, sortKeys: SortKey[], ids?: number[]) {
  progress.value?.start()
  loading.value = true
  data.value = []
  data.value = await load(pageIndex, perPage, filterValues, sortKeys, ids)
  loading.value = false
}
