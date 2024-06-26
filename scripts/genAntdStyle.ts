import { extractStyle } from 'ant-design-vue/es/_util/static-style-extract'
import { ConfigProvider } from 'ant-design-vue'
import { h } from 'vue'
import fsExtra from 'fs-extra'

export async function genAntdStyle() {
  const css = extractStyle()
  await fsExtra.outputFile('public/css/antd.css', css, 'utf8')
}

export async function genAntdStyleDarkMode() {
  const css = extractStyle((node) => {
    return h(ConfigProvider, {
      theme: {
        token: {
          // colorPrimary: '#722ed1',
        },
      },
    }, {
      default: () => node,
    })
  })
  await fsExtra.outputFile('public/css/antd.dark.css', css, 'utf8')
}
genAntdStyle()
