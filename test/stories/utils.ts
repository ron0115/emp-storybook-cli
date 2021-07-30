// HOC组合高阶函数
import classNames from 'classnames'

export const getStylesFunc = (cptName: string, styles?: Record<string, string>) => (className: string) =>
  styles ? classNames(styles[className], `${cptName}-${className}`) : `${cptName}-${className}`

export const getParam = (key: string, url = window.location.href) => {
  const r = new RegExp('(\\?|#|&)' + key + '=([^&#]*)(&|#|$)')
  const m = url.match(r)
  return decodeURI(!m ? '' : m[2])
}

// 植入styles的同时同时暴露组件的global className
// 保留css modules的用法，写法无侵入
// 注意：https://github.com/GoogleChrome/proxy-polyfill, defaultStyles必须创建并传入已知key，否则polyfill无法动态创建
// The polyfill supports just a limited number of proxy 'traps'. It also works by calling seal on the object passed to Proxy. This means that the properties you want to proxy must be known at creation time.
export const genStyles = (prefix = `ge-circle-progress`, defaultStyles: {[className: string]: string} = {}) => {
  const styles = new Proxy(defaultStyles, {
    get: function (target, name) {
      name = String(name)
      return target[name] ? `${target[name]} ${prefix}-${name}` : `${prefix}-${name}`
    },
  })
  return styles
}
