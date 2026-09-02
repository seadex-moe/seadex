import { writable, type Writable } from 'simple-store-svelte'
import { type ProgressBar } from '@prgm/sveltekit-progress-bar'
import type { Entry } from './schemas'
import type { SortKey } from 'svelte-headless-table/plugins'
import { idList, type alResponse, type media } from '$lib/anilist'
import { client } from '$lib/pocketbase'
import type { ListResult } from 'pocketbase'
import type { AnilistResponse, EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

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
  if ((isPocketBaseSort && (search != null && search != undefined) && !isPocketBaseSearch) || !isPocketBase) 
    alRes = await doIDList({ ids, pageIndex, perPage, search, sort, format: (filterValues.format as string[])?.length ? filterValues.format as string[] : undefined })
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
    skipTotal: !(isPocketBaseSearch || isPocketBaseSort),
    expand: 'trs'
  })

  // Check needed to use sorting from pocketbase or anilist.
  if (isPocketBase) {
    if (!alRes || isPocketBaseSearch) { alRes = await doIDList({ ids: res.items.map(x => x.alID), pageIndex: 0, perPage, search: isPocketBaseSearch ? undefined : search, sort, format: undefined }) }
    const dbmap: { [key: string]: media } = {}
    for (const media of alRes!.media) {
      dbmap[media.id] = media
    }

    for (const entry of res.items) {
      if (!(entry.alID in dbmap)) continue
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
  if (isPocketBaseSearch || isPocketBaseSort) {
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

function mapToAnilistResp(resp:ListResult<AnilistResponse<Texpand>>, ): alResponse {
  return {
    pageInfo: {
      hasNextPage: false,
      total: resp.totalItems
    },
    media: resp.items.map((item) => {
      return {
        id: item.alID,
        title: {
          userPreferred: item.title_userPreferred,
          english: item.title_english
        },
        coverImage: {
          extraLarge: item.coverImage_extraLarge,
          medium: item.coverImage_medium,
          color: item.coverImage_color
        },
        season: item.season,
        seasonYear: item.seasonYear,
        startDate: {
          year: item.startDate_year
        },
        type: item.type,
        format: item.format,
        status: item.status,
        episodes: item.episodes,
        duration: item.duration,
        averageScore: item.averageScore,
        genres: item?.genres.split(","),
      }
    })
  }
}

export async function searchLocal(search:string, id?: string): Promise<alResponse> { 

  let filter = ""
  if (search)
    filter = `title_english~"${search}"||title_userPreferred~"${search}"`
  else if (id) 
    filter = `alID=${id}`

  const resp: ListResult<AnilistResponse<Texpand>> = await client.collection('anilist').getList(1, 50, {filter})

  return mapToAnilistResp(resp)
  
}

const SORT_ID_MAP_PB: { [key: string]: string } = {
  EPISODES: 'episodes',
  EPISODES_DESC: '-episodes',
  START_DATE: 'startDate_year',
  START_DATE_DESC: '-startDate_year',
  TITLE_ROMAJI: 'title_english,title_userPreferred',
  TITLE_ROMAJI_DESC: '-title_english,-title_userPreferred',
  FORMAT: 'format',
  FORMAT_DESC: '-format',
}

export async function idListLocal({ ids, pageIndex = 0, perPage = 10, sort = 'SEARCH_MATCH', search, format }: { ids?: number[], pageIndex: number, perPage: number, sort?: string | string[], search?: string, format?: string[] }): Promise<alResponse> { 

  let filter = ""
  
  let sort_params
  if (Array.isArray(sort)) {
    sort_params = sort.map((sorting) => SORT_ID_MAP_PB[sorting] || undefined).filter((value) => !value).join(",")
  } else {
    sort_params = SORT_ID_MAP_PB[sort] || ""
  }

  if (search)
    filter = `title_english~"${search}"||title_userPreferred~"${search}"`

  if (format)
    filter = filter + (filter ? '&&' : '') + `format="${format}"`

  if (ids && ids?.length <= 500)
    filter = ids.map((id) => `alID=${id}`).join('||')
  const resp: ListResult<AnilistResponse<Texpand>> = await client.collection('anilist').getList(pageIndex + 1, perPage, {filter, sort: sort_params})

  return mapToAnilistResp(resp)
  
}


export async function doIDList({ ids, pageIndex = 0, perPage = 10, sort = 'SEARCH_MATCH', search, format }: { ids?: number[], pageIndex: number, perPage: number, sort?: string | string[], search?: string, format?: string[] }) {
  if (!ids || ids?.length == 0)
    return await idList({ ids, pageIndex, perPage, search, sort, format})
  else
    return await idListLocal({ ids, pageIndex, perPage, search, sort, format})

}