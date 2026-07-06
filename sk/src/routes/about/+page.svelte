<script lang='ts'>
  import * as Avatar from '$lib/components/ui/avatar'
  import { client } from '$lib/pocketbase'
  import hljs from 'highlight.js/lib/core'
  import js from 'highlight.js/lib/languages/javascript'
  import 'highlight.js/styles/github-dark.min.css'

  const { origin } = location

  hljs.registerLanguage('javascript', js)

  const pocketBaseExample = `import PocketBase from 'pocketbase'

const pb = new PocketBase('${origin}/')

const entriesList = await pb.collection('entries').getList(1, 50, { filter: 'alID=1' })`

  const tinyRestExample = `import tinyRest from 'tiny-rest'

const seadexEndpoint = tinyRest('${origin}/api/collections/')

const entriesResponse = await seadexEndpoint('entries/records', { filter: 'alID=1' })

const entriesList = await entriesResponse.json()`

  const { value: pocketBaseCode } = hljs.highlight(pocketBaseExample, { language: 'javascript' })
  const { value: tinyRestCode } = hljs.highlight(tinyRestExample, { language: 'javascript' })

  const editors = client.collection('editors').getList(1, 50)
</script>

<div class='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'>

  <!-- What is SeaDex -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>What is SeaDex?</h3>
    <p>SeaDex is an index of the highest quality releases for a given anime.</p>
    <p>We only provide release names and metadata. We do not host or distribute torrents.</p>
  </section>

  <!-- How are releases chosen -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>How are releases chosen?</h3>
    <p>Releases are evaluated using a range of factors.</p>
    <p>
      For the best slot, the release must use the highest quality video source as determined by image comparisons,
      and the best subtitles as determined by elements such as the quality of the script, typesetting, timing, etc.
      File size is not considered. Often the best release does not yet exist, so it will be listed as "Unmuxed", meaning that somebody will need to combine the best sources themselves to create the release.
    </p>
    <p>
      For the alt slot, the release should use a decent quality video source with the best subtitles. File size and availability are both considered.
    </p>
  </section>

  <!-- When are new releases added? -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>When are new releases added?</h3>

    <p>
      SeaDex only lists completed shows, for airing content or shows not present on SeaDex, you can refer to <a href='https://thewiki.moe/guides/quality/#releases' target='_blank' rel='noopener noreferrer'
        class='text-blue-600 dark:text-blue-400 hover:underline'>
        thewiki
      </a> for a general idea of good groups to download.
    </p>
    <p>
      Once a show has finished airing and a Blu-ray has been shared and compared against web sources, an entry will be added. Shows may be added before the Blu-ray releases in cases where there's a complete fansub, a Blu-ray is unlikely or far out, or other exceptional circumstances where the best option isn't necessarily obvious.
    </p>
    <p>
      Older shows are also regularly added once all the available Blu-ray regions and relevant encodes have been compared.
    </p>
  </section>

  <!-- How often is the site updated? -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>How often is the site updated?</h3>

    <p>
      As SeaDex is a community-run project there is no set schedule for updates. Factors such as new releases dropping, community members providing feedback or creating comparisons, how busy the editors are, all play a role. We try our best to make sure the information we provide stays relevant.
    </p>
    <p>
      Across 2026 there has been an average of 5 updates per day. You can keep up with them on the #seadex-update channel on our Discord, the last updated column on the site, or via the RSS feed.
    </p>
  </section>

  <!-- Player -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>Which player should I use?</h3>

    <p>
      We recommend using
      <a href='https://mpv.io/' target='_blank' rel='noopener noreferrer'
        class='text-blue-600 dark:text-blue-400 hover:underline'>
        mpv
      </a>
      with the high-quality profile, as it is the only player that guarantees high quality video and subtitle rendering.
    </p>

    <p>
      Other players are known to have issues such as inferior scaling, incorrect color reproduction, and subpar or even broken ASS support.
    </p>

    <p>
      Steer clear of pre-configured or custom mpv configs, as many use sub-optimal or outdated settings.
      The basic configuration in the guide below is all modern mpv needs to provide the best quality output.
    </p>

    <p>
      <a href='https://thewiki.moe/tutorials/mpv/' target='_blank' rel='noopener noreferrer'
        class='text-blue-600 dark:text-blue-400 hover:underline'>
        Setup Guide
      </a>
    </p>
  </section>

  <!-- Private tracker -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>How do I unlock the private tracker button?</h3>
    <p>
      Members of a popular anime private tracker should check the site enhancements section of the forums.
    </p>
    <p>
      For everyone else, unfortunately it's not available. Our community tries to mirror as many of the listed releases
      as possible to public trackers for everyone to enjoy, but many groups have exclusivity rules that we respect.
    </p>
  </section>

  <!-- Contribute -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>How can I contribute?</h3>

    <p>As a community project we appreciate any help we can get. Here are some ways you can contribute.</p>

    <ul class='space-y-2 list-disc list-inside'>
      <li>
        <a href='https://thewiki.moe/tutorials/comparison/' target='_blank' rel='noopener noreferrer'
          class='text-blue-600 dark:text-blue-400 hover:underline'>
          Making comparisons
        </a>
      </li>

      <li>
        <a href='https://thewiki.moe/advanced/muxing/' target='_blank' rel='noopener noreferrer'
          class='text-blue-600 dark:text-blue-400 hover:underline'>
          Making releases
        </a>
      </li>

      <li>
        Reporting issues or suggestions for any entries
        <a href='https://discord.gg/jPeeZewWRn' target='_blank' rel='noopener noreferrer'
          class='text-blue-600 dark:text-blue-400 hover:underline'>
          on our Discord
        </a>
      </li>

      <li>
        We do not accept donations, but purchasing Blu-rays that haven't been shared yet is a great way to support the project.
      </li>
    </ul>
  </section>

  <!-- Tools -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>Are there any tools/scripts?</h3>

    <ul class='space-y-3'>
      <li>
        <a href='/nyaablue.user.js' class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          NyaaBlue
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A userscript that highlights SeaDex releases on Nyaa</span>
      </li>

      <li>
        <a href='https://gitea.com/Jimbo/PT-Userscripts/src/branch/main/nekobt-seadex.user.js'
          class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          NekoBT SeaDex
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A userscript that highlights SeaDex releases on nekoBT</span>
      </li>

      <li>
        <a href='https://github.com/bbtufty/seadexarr'
          class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          SeaDexArr
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A tool that keeps your ARR library in sync with SeaDex</span>
      </li>

      <li>
        <a href='https://github.com/Ryder-C/seadexerr'
          class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          SeaDexErr
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A Prowlarr indexer for SeaDex</span>
      </li>

      <li>
        <a href='https://ravencentric.cc/seadex-data-refinement/'
          class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          SeaDex Data Refinement
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A statistical analysis of SeaDex</span>
      </li>

      <li>
        <a href='https://github.com/Ravencentric/seadex'
          class='font-medium text-blue-600 dark:text-blue-400 hover:underline'>
          Ravencentric/seadex
        </a>
        <span class='text-gray-600 dark:text-gray-400'>— A Python wrapper for the SeaDex API</span>
      </li>
    </ul>

    <p class='text-sm text-gray-600 dark:text-gray-400'>
      You may also find some userscripts on private sites or extensions built into your favorite apps!
    </p>
  </section>

  <!-- Tags -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4'>
    <h3 class='text-xl font-bold'>What are the tags?</h3>

    <p>Tags are used to indicate issues with compatibility or the release itself.</p>

    <div class='grid gap-3 md:grid-cols-2'>
      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Broken</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release has minor issues which are explained in the notes, but is still perfectly watchable.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Deband Recommended</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release has banding and should ideally be watched with MPV's built in deband feature, but it's still the best option even without debanding.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Deband Required</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release has banding and must be watched with MPV's built in deband feature, if you cannot use debanding then the alt release will provide better quality.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Dolby Vision</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release is Dolby Vision Profile 5 which requires a Dolby Vision compatible setup. Alternatively MPV with an HDR screen. Not meeting this criteria will result in a green and purple image.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>HDR</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release is HDR which requires an HDR screen. Not meeting this criteria will result in a washed out image. Alternatively some players can perform tone mapping, but we recommend using the SDR release instead unless otherwise specified.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Incomplete</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release does not contain all the episodes, used when it provides better video/subtitle quality for those episodes.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Misplaced Special</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release has specials at the top of the file list, generally these specials are intended to be watched after the main series. Make sure you watch in the correct order.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>Patch Required</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release requires you to download and apply a patch in order to fix issues with the release. Generally our community will upload the patched files to avoid this.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>VFR</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release has a variable framerate, which means it changes between 24, 30, and even 60fps depending on the scene. In order to display the content correctly your screen should either use VRR or be set to a multiple of 120Hz.
        </p>
      </div>

      <div class='rounded-lg border border-gray-200 dark:border-gray-800 p-4'>
        <p class='font-semibold'>YUV444P</p>
        <p class='mt-1 text-gray-600 dark:text-gray-400'>
          The release is encoded with 4:4:4 chroma which has poor hardware support. Generally it will not work on anything outside of a PC, so if you're using a streaming box/stick you'll want to avoid it.
        </p>
      </div>
    </div>
  </section>

  <!-- Sheet -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3'>
    <h3 class='text-xl font-bold'>What about the sheet?</h3>
    <p>The sheet has been largely phased out in favor of this site. Updates are still backported there but you'll miss out on all the new features such as tags.</p>
    <p>If you find any discrepancies in entries between the two, please report them
      <a href='https://discord.gg/jPeeZewWRn' class='text-blue-600 dark:text-blue-400 hover:underline'>on our Discord</a>.
    </p>
    <p>There are no plans to discontinue it without a suitable replacement.</p>
  </section>

  <!-- Editors -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4'>
    <h3 class='font-bold text-2xl'>Who are the editors?</h3>

    {#await editors}
      <p class='text-gray-600 dark:text-gray-400'>Loading...</p>
    {:then result}
      <div class='flex flex-wrap gap-4'>
        {#each result.items || [] as { avatar, username, id }}
          <div class='inline-flex items-center gap-3'>
            {#if avatar}
              <Avatar.Root class='h-8 w-8'>
                <Avatar.Image src={client.files.getUrl({ id, collectionName: 'users' }, avatar)} alt={username} />
                <Avatar.Fallback>{username}</Avatar.Fallback>
              </Avatar.Root>
            {/if}
            <span class='text-gray-800 dark:text-gray-200'>{username}</span>
          </div>
        {/each}
      </div>
    {/await}
  </section>

  <!-- API -->
  <section class='rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4'>

    <h3 class='font-bold text-2xl'>How to programmatically access the data?</h3>

    <p>
      We provide a REST API under
      <a href={`${origin}/api/collections`} class='text-blue-600 dark:text-blue-500 hover:underline'>
        {origin}/api/collections
      </a>.<br />
      Publicly available endpoints are:
    </p>

    <ul class='list-disc list-inside space-y-1'>
      <li><a href={`${origin}/api/collections/entries/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/entries/records</a></li>
      <li><a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/torrents/records</a></li>
      <li><a href={`${origin}/api/collections/releaseGroups/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/releaseGroups/records</a></li>
    </ul>

    <p>
      For details on how to use the query parameters, visit the
      <a class='text-blue-600 dark:text-blue-500 hover:underline'
        href='https://pocketbase.io/docs/api-records/#listsearch-records'>
        PocketBase documentation
      </a>.
    </p>

    <p>
      This API enables some very powerful automation, as you can query the data in any way you want. For example, you can get the best releases for a specific anime, or the best releases for a specific group.
    </p>

    <p>Some examples of what you can do with the API are:</p>

    <ul class='list-disc list-inside space-y-2'>
      <li><a href={`${origin}/api/collections/entries/records?filter=theoreticalBest!=%27%27`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries with theoretical releases which aren't yet muxed, to find what you could mux yourself</a></li>
      <li><a href={`${origin}/api/collections/entries/records?filter=comparison=%27%27`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries without comparisons, so you can create some and contribute them</a></li>
      <li><a href={`${origin}/api/collections/entries/records?filter=incomplete=false`} class='text-blue-600 dark:text-blue-500 hover:underline'>List entries that are complete</a></li>
      <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.tracker=%27Nyaa%27`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries which are only uploaded to Nyaa, and not any PTs, if you want to mirror public tracker entries to some PTs</a></li>
      <li><a href={`${origin}/api/collections/entries/records?sort=@random&perPage=1`} class='text-blue-600 dark:text-blue-500 hover:underline'>Get a single random entry</a></li>
      <li><a href={`${origin}/api/collections/entries/records?filter=alID=585`} class='text-blue-600 dark:text-blue-500 hover:underline'>Get an entry for a specific AniList ID</a></li>
      <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.files?~%27"name":"[OZR]%20Goblin%20Slayer%20-%20S01E04%20(BD%201080p%20HEVC%20FLAC)%20[Dual-Audio]%20[B2BDEAF3].mkv"%27&fields=alID`} class='text-blue-600 dark:text-blue-500 hover:underline'>Get the AniList ID using a torrent's file name</a></li>
      <li><a href={`${origin}/api/collections/torrents/records?filter=files=%27[{%22length%22:9415031919,%22name%22:%22Jujutsu%20Kaisen%200%20(2021)%20[v2]%20[BD%201080p%20HEVC%20Dual-Audio]%20[Vodes].mkv%22}]%27`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents that contain a specific set of files; this helps you find tracker links and infohashes by file size and/or name</a></li>
      <li><a href={`${origin}/api/collections/torrents/records?filter=tracker=%27RuTracker%27&sort=-updated`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific tracker and sort them by newest first</a></li>
      <li><a href={`${origin}/api/collections/torrents/records?filter=(isBest=true%26%26releaseGroup=%27GJM%27)`} class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific release group, which are marked as best</a></li>
    </ul>

    <p>
      The
      <a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>torrents</a>
      endpoint is also available as
      <a href={`${origin}/rss`} class='text-blue-600 dark:text-blue-500 hover:underline'>an RSS feed</a>
      instead of a JSON feed. This allows you to use the data in your torrent client or in a feed reader. The query parameters are the same as for the JSON torrent feed.
    </p>

    <p>
      This once again enables some powerful queries for your torrent client such as
      <a href={`${origin}/rss?filter=(isBest=true%26%26infoHash!=%27<redacted>%27)&sort=-updated`} class='text-blue-600 dark:text-blue-500 hover:underline'>
        an RSS feed for all public torrents, which are marked as best, sorted by newest first.
      </a>
    </p>

    <h3 class='font-bold text-2xl pt-6'>API usage examples using JavaScript:</h3>

    <p>Using the official pocketbase library:</p>

    <div class='py-3 px-4 border rounded bg-gray-50 dark:bg-gray-900 overflow-x-auto'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <code class='whitespace-pre text-sm'>{@html pocketBaseCode}</code>
    </div>

    <p class='pt-2'>Or if you want to use a smaller library:</p>

    <div class='py-3 px-4 border rounded bg-gray-50 dark:bg-gray-900 overflow-x-auto'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <code class='whitespace-pre text-sm'>{@html tinyRestCode}</code>
    </div>

  </section>

</div>
