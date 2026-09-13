import PocketBase from 'pocketbase'
import { env } from '$env/dynamic/private'
import type { AnilistResponse, EntriesResponse, TorrentsResponse } from '$lib/pocketbase/generated-types'

const client = new PocketBase(env.POCKETBASE_URL || 'http://0.0.0.0:59992')

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const handle = async ({ event, resolve }) => {
  if (!event.params.id || !Number(event.params.id)) return resolve(event)
  const ua = event.request.headers.get('user-agent')

  if (!ua?.includes('Discordbot')) return resolve(event)
  try {
    const item = await client.collection('entries').getFirstListItem<EntriesResponse<{
      trs: TorrentsResponse[]
    }>>(`alID="${event.params.id}"`, { expand: 'trs' })

    const data = await client.collection('anilist').getFirstListItem<AnilistResponse>(`alID="${event.params.id}"`)

    let desc = ''
    
    if (item.theoreticalBest) desc += `**Theoretical Best:** ${item.theoreticalBest}\n`

    const best = item.expand?.trs.filter(({ isBest }) => isBest)
    if (best?.length) {
      desc += `**Best:** ${[...new Set(best.map(({ releaseGroup, dualAudio }) => dualAudio ? `**${releaseGroup}**` : releaseGroup))].join('/')}\n`
    }
    const alt = item.expand?.trs.filter(({ isBest }) => !isBest)
    if (alt?.length) {
      desc += `**Alt:** ${[...new Set(alt.map(({ releaseGroup, dualAudio }) => dualAudio ? `**${releaseGroup}**` : releaseGroup))].join('/')}\n`
    }

    if (item.notes) desc += `\n${item.notes}\n`
    // if (item.comparison) desc += `\n${item.comparison.replaceAll(',', ' ')}\n`

    let title: string = data.title_english || data.title_userPreferred
    if (!title.includes(""+data.seasonYear)) title += ` (${data.seasonYear})`

    desc = escapeHtml(desc)

    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html.replace(
          '<meta name="twitter:image" content="/favicon.png">',
          `<meta name="twitter:image" content="${data.coverImage_extraLarge}">`
        ).replace(
          '<meta property="og:image" content="/favicon.png">',
          `<meta property="og:image" content="${data.coverImage_extraLarge}"><meta property="og:site_name" content="SeaDex" />`
        ).replace(
          '<meta property="og:title" content="SeaDex">',
          `<meta property="og:title" content="${title}">`
        ).replace(
          '<meta name="twitter:title" content="SeaDex">',
          `<meta name="twitter:title" content="${title}">`
        ).replace(
          '<meta name="twitter:description" content="Your portal to the ultimate enthusiast releases - anime with unparalleled video, audio, and subtitle perfection, backed by in-depth comparisons.">',
          `<meta name="twitter:description" content="${desc}">`
        ).replace(
          '<meta property="og:description" content="Your portal to the ultimate enthusiast releases - anime with unparalleled video, audio, and subtitle perfection, backed by in-depth comparisons.">',
          `<meta property="og:description" content="${desc}">`
        ).replace(
          '<meta name="theme-color" content="#ff4242">',
          `<meta name="theme-color" content="${data.coverImage_color || '#3db4f2'}">`
        ).replace(
          '<meta property="og:type" content="object">',
          '<meta property="og:type" content="rich">'
        )
      }
    })
  } catch (error) {
    return resolve(event)
  }
}
