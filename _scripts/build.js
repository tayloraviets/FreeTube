const os = require('os')
const builder = require('electron-builder')

const Platform = builder.Platform
const Arch = builder.Arch
const { name, productName } = require('../package.json')
const args = process.argv

let targets
var platform = os.platform()

if (platform == 'darwin') {
  targets = Platform.MAC.createTarget()
} else if (platform == 'win32') {
  targets = Platform.WINDOWS.createTarget()
} else if (platform == 'linux') {
  let arch = Arch.x64

  if (args[2] === 'arm') {
    arch = Arch.arm64
  }

  targets = Platform.LINUX.createTarget(['deb', 'zip', 'apk', 'rpm', 'AppImage'], arch)
}

const config = {
  appId: `io.freetubeapp.${name}`,
  copyright: 'Copyleft © 2020 freetubeapp@protonmail.com',
  // asar: false,
  // compression: 'store',
  productName,
  directories: {
    output: './build/',
  },
  protocols: [
    {
      name: "FreeTube",
      schemes: [
        "freetube"
      ]
    }
  ],
  files: ['_icons/iconColor.*', './dist/**/*', '!./dist/web/**/*'],
  dmg: {
    contents: [
      {
        path: '/Applications',
        type: 'link',
        x: 410,
        y: 230,
      },
      {
        type: 'file',
        x: 130,
        y: 230,
      },
    ],
    window: {
      height: 380,
      width: 540,
    },
  },
  linux: {
    category: 'Network',
    icon: '_icons/icon.png',
    target: ['deb', 'zip', 'apk', 'rpm', 'AppImage'],
  },
  mac: {
    category: 'public.app-category.utilities',
    icon: '_icons/iconColor.icns',
    target: ['dmg', 'zip'],
    type: 'distribution',
  },
  win: {
    icon: '_icons/iconColor.ico',
    target: ['nsis', 'zip', 'portable', 'squirrel'],
  },
  nsis: {
    allowToChangeInstallationDirectory: true,
    oneClick: false,
  },
}

builder
  .build({
    targets,
    config,
  })
  .then(m => {
    console.log(m)
  })
  .catch(e => {
    console.error(e)
  })
