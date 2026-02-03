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

<div>
  <h3 class='font-bold text-2xl pb-4'>What is SeaDex?</h3>
  <p>
    SeaDex is an index of the highest quality releases for a given anime.<br />
    We only provide names and metadata, there are no actual torrents here.
  </p>
    <h3 class='font-bold text-2xl pb-4'>How are releases chosen?</h3>
  <p>
    Releases are chosen based on a multitude of factors.<br />
    For the best slot, the release must use the highest quality video source as determined by image comparisons, and the best subtitles as determined by elements such as the quality of the script, typesetting, timing, etc. File size is not taken into account.<br />
    For the alt slot, the release should use a decent quality video source with the best subtitles. File size and availability are both considered.
  </p>
    <h3 class='font-bold text-2xl py-4'>How do I unlock the private tracker button?</h3>
  <p>
    Members of a popular anime private tracker should check the site enhancements section of the forums.<br />
    For everyone else, unfortunately it's not available. Our community tries to mirror as many of the listed releases as possible to public trackers for everyone to enjoy, but many groups have exclusivity rules that we respect.
  </p>
      <h3 class='font-bold text-2xl py-4'>How can I contribute?</h3>
  <p>
    As a community project we appreciate any help we can get. There are many ways to contribute.
  </p>
  <ul class='list-disc list-inside'>
    <li><a href="https://thewiki.moe/tutorials/comparison/" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>Making comparisons</a></li>
    <li><a href="https://thewiki.moe/advanced/muxing/" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>Making releases</a></li>
    <li>Reporting issues or suggestions for any entries <a href="https://discord.gg/seadex" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>on our Discord</a></li>
    <li>We do not accept donations, but purchasing Blu-rays that haven't been shared yet is a great way to support the project.</li>
  </ul>
  <h3 class='font-bold text-2xl py-4'>Are there any tools/scripts?</h3>
  <ul class='list-disc list-inside'>
    <li><a href={`${origin}/nyaablue.user.js`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>NyaaBlue</a> - A userscript to highlight SeaDex releases on Nyaa</li>
    <li><a href="https://gitea.com/Jimbo/PT-Userscripts/src/branch/main/nekobt-seadex.user.js" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>NekoBT SeaDex</a> - A userscript to highlight SeaDex releases on nekoBT</li>
    <li><a href="https://github.com/bbtufty/seadexarr" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>SeaDexArr</a> - A tool to keep your ARR library in sync with SeaDex</li>
    <li><a href="https://github.com/Ryder-C/seadexerr" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>SeaDexErr</a> - A Prowlarr indexer for SeaDex</li>
    <li><a href="https://ravencentric.cc/seadex-data-refinement/" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>SeaDex Data Refinement</a> - A breakdown of SeaDex statistics and data analysis</li>
    <li><a href="https://github.com/Ravencentric/seadex" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>Ravencentric/seadex</a> - A Python wrapper for the SeaDex API</li>
  </ul>
  <p class='mt-2'>You may also find some userscripts on private sites or extensions built into your favorite apps!</p>
    <h3 class='font-bold text-2xl py-4'>What are the tags?</h3>
  <p>
    Tags are used to indicate issues with compatibility or the release itself.
  </p>
  <ul class='list-disc list-inside'>
    <li><strong>Broken:</strong> The release has minor issues which are explained in the notes, but is still perfectly watchable.</li>
    <li><strong>Deband Recommended:</strong> The release has banding and should ideally be watched with MPV's built in deband feature, but it's still the best option even without debanding.</li>
    <li><strong>Deband Required:</strong> The release has banding and must be watched with MPV's built in deband feature, if you cannot deband then the alt release will provide better quality.</li>
    <li><strong>Dolby Vision:</strong> The release is Dolby Vision Profile 5 which requires a Dolby Vision supported player, device, and screen. Alternatively MPV with an HDR screen. Not meeting this criteria will result in a green/purple image. </li>
    <li><strong>HDR:</strong> The release is HDR which requires an HDR screen. Not meeting this criteria will result in a washed out image. Alternatively some players will tonemap, but we recommend getting the SDR release instead.</li>
    <li><strong>Incomplete:</strong> The release does not contain all the episodes, used when it provides better video/subtitle quality for those episodes.</li>
    <li><strong>Misplaced Special:</strong> The release has specials at the top of the file list, often times these specials should be watched after the main series. Make sure you watch in the correct order.</li>
    <li><strong>Patch Required:</strong> The release requires you to download and run a patch in order to fix issues with the release. Generally our community will upload the pre-patched files to avoid this.</li>
    <li><strong>VFR:</strong> The release has a variable framerate, which means it changes between 24, 30, and even 60fps depending on the scene. In order to display the content correctly your screen should either use VRR or be set to a multiple of 120Hz.</li>
    <li><strong>YUV444P:</strong> The release is encoded with 4:4:4 chroma which has poor hardware support. Generally it will not work on anything outside of a PC, so if you're using a streaming box/stick you'll want to avoid it.</li>
  </ul>
  <h3 class='font-bold text-2xl py-4'>What about the sheet?</h3>
  <p>
    The sheet is largely being phased out in favor of this site. Updates are still backported there but you'll miss out on all the new features.<br />
    If you find any discrepancies in entries between the two, please report them <a href="https://discord.gg/seadex" target='_blank' rel="noopener noreferrer" class='text-blue-600 dark:text-blue-500 hover:underline'>on our Discord</a>.<br />
    There are no plans to discontinue it currently, but due to the additional workload it requires this may not be the case forever.
  </p>
  <h3 class='font-bold text-2xl py-4'>Who are the editors?</h3>

  {#await editors}
    Loading...
  {:then { items }}
    <div>
      {#each items || [] as { avatar, username, id }}
        <div class='inline-flex items-center'>
          {#if avatar}
            <Avatar.Root class='h-8 w-8'>
              <Avatar.Image src={client.files.getUrl({ id, collectionName: 'users' }, avatar)} alt={username} />
              <Avatar.Fallback>{username}</Avatar.Fallback>
            </Avatar.Root>
          {/if}
          <span class='me-8 ms-4'>
            {username}
          </span>
        </div>
      {/each}
    </div>
  {/await}

  <h3 class='font-bold text-2xl py-4'>How to programmatically access the data?</h3>
  <p>
    We provide a REST API under <a href={`${origin}/api/collections`} class='text-blue-600 dark:text-blue-500 hover:underline'>{origin}/api/collections</a>.<br />
    Publicly available endpoints are:
  </p>
  <ul class='list-disc list-inside py-4'>
    <li><a href={`${origin}/api/collections/entries/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/entries/records</a></li>
    <li><a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/torrents/records</a></li>
    <li><a href={`${origin}/api/collections/releaseGroups/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>/releaseGroups/records</a></li>
  </ul>
  <p>
    For details on how to use the query parameters, visit the <a class='text-blue-600 dark:text-blue-500 hover:underline' href='https://pocketbase.io/docs/api-records/#listsearch-records'>PocketBase documentation</a>.
  </p>
  <p>
    This API enables some very powerful automation, as you can query the data in any way you want. For example, you can get the best releases for a specific anime, or the best releases for a specific group.
  </p>
  <p>
    Some examples of what you can do with the API are:
  </p>
  <ul class='list-disc list-inside py-4'>
    <li><a href={`${origin}/api/collections/entries/records?filter=theoreticalBest!=%27%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries with theoretical releases which aren't yet muxed, to find what you could mux yourself</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=comparison=%27%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries without comparisons, so you can create some and contribute them</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=incomplete=false`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List entries that are complete</a></li>
    <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.tracker=%27Nyaa%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all entries which are only uploaded to Nyaa, and not any PTs, if you want to mirror public tracker entries to some PTs</a></li>
    <li><a href={`${origin}/api/collections/entries/records?sort=@random&perPage=1`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get a single random entry</a></li>
    <li><a href={`${origin}/api/collections/entries/records?filter=alID=585`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get an entry for a specific AniList ID</a></li>
    <li><a href={`${origin}/api/collections/entries/records?expand=trs&filter=trs.files?~%27"name":"[OZR]%20Goblin%20Slayer%20-%20S01E04%20(BD%201080p%20HEVC%20FLAC)%20[Dual-Audio]%20[B2BDEAF3].mkv"%27&fields=alID`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>Get the AniList ID using a torrent's file name</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=files=%27[{%22length%22:9415031919,%22name%22:%22Jujutsu%20Kaisen%200%20(2021)%20[v2]%20[BD%201080p%20HEVC%20Dual-Audio]%20[Vodes].mkv%22}]%27`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents that contain a specific set of files; this helps you find tracker links and infohashes by file size and/or name</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=tracker=%27RuTracker%27&sort=-updated`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific tracker and sort them by newest first</a></li>
    <li><a href={`${origin}/api/collections/torrents/records?filter=(isBest=true%26%26releaseGroup=%27GJM%27)`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>List all torrents from a specific release group, which are marked as best</a></li>
  </ul>
  <p>
    The <a href={`${origin}/api/collections/torrents/records`} class='text-blue-600 dark:text-blue-500 hover:underline'>torrents</a> endpoint is also available as <a href={`${origin}/rss`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>an RSS feed</a> instead of a JSON feed. This allows you to use the data in your torrent client or in a feed reader. The query parameters are the same as for the JSON torrent feed.
  </p>
  <p>
    This once again enables some powerful queries for your torrent client such as <a href={`${origin}/rss?filter=(isBest=true%26%26infoHash!=%27<redacted>%27)&sort=-updated`} target='_blank' class='text-blue-600 dark:text-blue-500 hover:underline'>an RSS feed for all public torrents, which are marked as best, sorted by newest first.</a>
  </p>

  <h3 class='font-bold text-2xl py-4'>API usage examples using JavaScript:</h3>
  <p>Using the official pocketbase library:</p>
  <div class='py-2 px-3 mb-3 mt-2 border rounded'>
    <code class='whitespace-pre leading-none text-sm'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html pocketBaseCode}
    </code>
  </div>
  <p>Or if you want to use a smaller library:</p>
  <div class='py-2 px-3 mb-3 mt-2 border rounded'>
    <code class='whitespace-pre leading-none text-sm'>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html tinyRestCode}
    </code>
  </div>
</div>
