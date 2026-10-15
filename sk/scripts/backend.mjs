import { createHash } from 'node:crypto'
import { spawn } from 'node:child_process'
import {
  access,
  chmod,
  mkdir,
  rename,
  rm,
  writeFile
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const pocketBaseDirectory = resolve(scriptDir, '../../pb')

/**
 * @typedef {object} PocketBaseTarget
 * @property {string} url
 * @property {string} checksum
 */

/** @type {Record<string, PocketBaseTarget>} */
const targets = {
  'linux-x64': {
    url: 'https://github.com/pocketbase/pocketbase/releases/download/v0.22.51/pocketbase_0.22.51_linux_amd64.zip',
    checksum: 'fdc960131f9762c6aeb8740715822463ad7336a20a054b5dc31a2fb6ad8cd5a0'
  },
  'win32-x64': {
    url: 'https://github.com/pocketbase/pocketbase/releases/download/v0.22.51/pocketbase_0.22.51_windows_amd64.zip',
    checksum: '8d06f7f579eabee3b38f3bc30dc193256090f96fb33224fcc8a41f642df56520'
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
async function exists (path) {
  try {
    await access(path)
    return true
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
  if (await exists(binaryPath)) {
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
