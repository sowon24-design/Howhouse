import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { spawnSync } from 'node:child_process'

// Isolate all native generation from the catalog/Play Android project.
const root = resolve(import.meta.dirname, '..')
const stage = resolve(root, 'capstone-android.local')
function run(args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) throw Error('Capstone Android preparation failed; do not install stale output.')
}
if (!existsSync(resolve(root, 'node_modules/@capacitor/cli/bin/capacitor'))) throw Error('Existing project dependencies are required.')
run(['node_modules/vite/bin/vite.js', 'build', '--config', 'vite.capstone.config.ts', '--mode', 'capstone', '--configLoader', 'runner'])
mkdirSync(stage, { recursive: true })
cpSync(resolve(root, 'android'), resolve(stage, 'android'), { recursive: true, filter: p => !/[\\/](build|\.gradle|assets)([\\/]|$)/.test(p) && !/local\.properties$/.test(p) })
mkdirSync(resolve(stage, 'src/catalog'), { recursive: true })
writeFileSync(resolve(stage, 'src/catalog/app-release.json'), JSON.stringify({ applicationId: 'com.howhouse.capstone', appName: '어쩌집 캡스톤', versionCode: 1, versionName: '1.0-capstone' }))
// Only reset this generated web directory, never the native project or user files.
const web = resolve(stage, 'www')
if (dirname(web) !== stage || web === stage) throw Error('Unexpected generated web path.')
rmSync(web, { recursive: true, force: true })
cpSync(resolve(root, 'dist-capstone'), web, { recursive: true })
cpSync(resolve(stage, 'www/capstone.html'), resolve(stage, 'www/index.html'))
writeFileSync(resolve(stage, 'package.json'), readFileSync(resolve(root, 'package.json')))
writeFileSync(resolve(stage, 'capacitor.config.json'), JSON.stringify({
  appId: 'com.howhouse.capstone', appName: '어쩌집 캡스톤', webDir: 'www',
  includePlugins: ['@capacitor/app', '@capacitor/camera', '@capacitor/network'],
  server: { hostname: '127.0.0.1', androidScheme: 'http', cleartext: true },
  android: { allowMixedContent: true },
}, null, 2))
// Resolve dependencies from the existing parent node_modules; no installation.
run([resolve(root, 'node_modules/@capacitor/cli/bin/capacitor'), 'sync', 'android'], stage)
const manifest = resolve(stage, 'android/app/src/main/AndroidManifest.xml')
writeFileSync(manifest, readFileSync(manifest, 'utf8').replace('<application', '<application android:usesCleartextTraffic="true"'))
const strings = resolve(stage, 'android/app/src/main/res/values/strings.xml')
writeFileSync(strings, readFileSync(strings, 'utf8').replaceAll('com.howhouse.app', 'com.howhouse.capstone').replaceAll('>어쩌집<', '>어쩌집 캡스톤<'))
const gradle = resolve(stage, 'android/app/build.gradle')
writeFileSync(gradle, readFileSync(gradle, 'utf8') + `
// Owner-only capstone demo: never produce a Play/release artifact here.
tasks.matching { it.name == 'preReleaseBuild' || it.name == 'preYoutubeQaBuild' }.configureEach {
    doFirst { throw new GradleException('Capstone USB prototype supports debug APK only; not for Google Play.') }
}
`)
console.log('Prepared isolated capstone Android project: ' + stage)
console.log('Build debug APK only. Do not upload this prototype to Google Play.')
