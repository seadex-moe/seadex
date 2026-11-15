import { createHash } from 'node:crypto'
import { execFile, spawn } from 'node:child_process'
import {
  chmod,
  mkdir,
  rename,
  rm,
  writeFile
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { unzipSync } from 'fflate'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const pocketBaseDirectory = resolve(scriptDir, '../../pb')
const pocketBaseVersion = '0.22.57'
const execFileAsync = promisify(execFile)

/**
 * @typedef {object} PocketBaseTarget
 * @property {string} url
 * @property {string} checksum
 */

/** @type {Record<string, PocketBaseTarget>} */
const targets = {
  'linux-x64': {
    url: `https://github.com/pocketbase/pocketbase/releases/download/v${pocketBaseVersion}/pocketbase_${pocketBaseVersion}_linux_amd64.zip`,
    checksum: 'c1192ffbb40f8c82e5cbab42d9f6385be149870a1cf185c7585bf9b3d648d1d8'
  },
  'win32-x64': {
    url: `https://github.com/pocketbase/pocketbase/releases/download/v${pocketBaseVersion}/pocketbase_${pocketBaseVersion}_windows_amd64.zip`,
    checksum: '643f5946122c36303fbe84788d0c8755b030fac9d248ec84c7bff3ff5c7fb8ef'
  }
}

const platform = `${process.platform}-${process.arch}`
const target = targets[platform]

if (!target) {
  throw new Error(
    `Unsupported platform: ${platform}. Only x64 Linux and Windows are supported.`
  )
}

const binaryName = process.platform === 'win32'
  ? 'pocketbase.exe'
  : 'pocketbase'
const binaryPath = join(pocketBaseDirectory, binaryName)

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function hasCurrentVersion (path) {
  try {
    const { stdout } = await execFileAsync(path, ['--version'], { timeout: 5000 })
    return stdout.trim().endsWith(` version ${pocketBaseVersion}`)
  } catch {
    return false
  }
}

/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
async function download (url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`
    )
  }

  return Buffer.from(await response.arrayBuffer())
}

/** @returns {Promise<void>} */
async function installPocketBase () {
  if (await hasCurrentVersion(binaryPath)) {
    return
  }

  console.log(`Downloading PocketBase for ${platform}...`)

  const archive = await download(target.url)
  const actualChecksum = createHash('sha256')
    .update(archive)
    .digest('hex')

  if (actualChecksum !== target.checksum) {
    throw new Error(`Checksum verification failed for ${target.url}`)
  }

  await mkdir(pocketBaseDirectory, { recursive: true })

  const extractedFiles = unzipSync(archive, {
    filter: (file) => file.name === binaryName
  })
  const binary = extractedFiles[binaryName]

  if (!binary) {
    throw new Error(`${binaryName} was not found in ${target.url}`)
  }

  const temporaryBinaryPath = join(
    pocketBaseDirectory,
    `.${binaryName}.${process.pid}.tmp`
  )

  try {
    await writeFile(temporaryBinaryPath, binary)

    if (process.platform !== 'win32') {
      await chmod(temporaryBinaryPath, 0o755)
    }

    await rename(temporaryBinaryPath, binaryPath)
  } finally {
    await rm(temporaryBinaryPath, { force: true })
  }
}

/** @returns {void} */
function startPocketBase () {
  const pocketBase = spawn(binaryPath, [
    'serve',
    '--http=localhost:59992',
    '--dir=pb_data',
    '--hooksDir=pb_hooks',
    '--migrationsDir=pb_migrations'
  ], {
    cwd: pocketBaseDirectory,
    stdio: 'inherit'
  })

  pocketBase.on('error', (error) => {
    console.error(`Failed to start PocketBase: ${error.message}`)
    process.exitCode = 1
  })

  pocketBase.on('exit', (code) => {
    process.exitCode = code ?? 1
  })
}

try {
  await installPocketBase()
  startPocketBase()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
