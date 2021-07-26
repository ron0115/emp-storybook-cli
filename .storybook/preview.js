import React from 'react'
import { addDecorator } from '@storybook/react'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks'
import './css/index.scss'
import { themes } from '@storybook/theming'

global.STORYBOOK_REACT_CLASSES = {}

// const storySort = categories => (a, b) => {
//   const getStoryCategory = story => story[1].kind.split('/')[0]
//   const indexA = categories.indexOf(getStoryCategory(a))
//   const indexB = categories.indexOf(getStoryCategory(b))
//   return indexA === indexB ? 0 : indexA > indexB ? 1 : -1
// }

export const parameters = {
  options: {
    theme: themes.light,
    storySort: { order: ['文档', '组件'] },
    viewMode: 'docs'
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
    source: {
      type: 'tsx'
    },
    previewSource: 'open',
    theme: themes.light
  }
}
// addDecorator(withKnobs)
addDecorator(story => <>{story()}</>)
// const req = require.context('../stories', true, /\.stories\.((t|j)sx)$/)
// function loadStories() {
//   req.keys().forEach(filename => req(filename))
// }
// configure(loadStories, module)

{
  window.addEventListener('load', () => {
    let loc = window.location.href
    showCodeSamples()
    // 默认打开showCode

    window.setInterval(() => {
      const newLoc = window.location.href

      if (newLoc !== loc) {
        loc = newLoc
        showCodeSamples()
      }
    }, 1000)
    // 展开菜单
    window.parent.document
      .querySelectorAll(`.sidebar-subheading-action`)
      .forEach(e => e.click())
  })

  function showCodeSamples() {
    try {
      const [a, ...docs] = document.querySelectorAll(
        '.sbdocs-content.sbdocs.sbdocs-preview'
      )
      ;[].forEach.call(docs, el => {
        const buttons = el.querySelectorAll('button')
        const codeButton = [].find.call(
          buttons,
          el => el.textContent === 'Show code'
        )
        if (codeButton) {
          codeButton.click()
        }
      })
    } catch (e) {
      console.warn(e)
    }
  }
}
