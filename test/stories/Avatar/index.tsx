import classNames from 'classnames'
import React, {useRef, useEffect, useState, HTMLAttributes} from 'react'
import {genStyles} from '../utils'
import defaultStyles from './index.module.scss'

export type AvatarProps = {
  /** 图片的地址 */
  imgSrc?: string
  /** 下载失败时加载的图片地址 */
  error?: string
  /** 可以传入的默认slot节点 */
  children?: any
  styles?: any
  /** 同原生onerror */
  onError?: (event: React.SyntheticEvent<Element, Event>) => void
  className?: string
  imgAttr?: HTMLAttributes<HTMLImageElement>
}
function fixHttps(url: string) {
  return url.replace(/^(http|https):/, '')
}

function imageview({url = '', width = 0, height = 0} = {url: ''}): string {
  const isCDN = /(screenshot\.dwstatic\.com|(bs2dl|bs2)\.yy\.com)/
  if (isCDN.test(url) && width && height) {
    return url + `?imageview/4/0/w/${width}/h/${height}`
  }
  return url
}
/** 通用头像组件 */
export const Avatar = ({
  imgSrc = '',
  error = '//s1.yy.com/guild/header/10001.jpg',
  onError,
  children,
  className,
  styles = genStyles('ge-avatar', defaultStyles),
  imgAttr,
}: AvatarProps) => {
  const [src, setSrc] = useState(imgSrc)

  const imgRef = useRef<HTMLImageElement>(null)

  const onErrorHandler: React.ReactEventHandler = e => {
    onError && onError(e)
    setSrc(error)
  }

  useEffect(() => {
    imgSrc &&
      setSrc(
        imageview({
          url: fixHttps(imgSrc),
          width: imgRef.current ? imgRef.current.offsetWidth : 0,
          height: imgRef.current ? imgRef.current.offsetHeight : 0,
        }),
      )
  }, [imgSrc])

  return (
    <div className={classNames(styles.avatar, className)}>
      <img onError={onErrorHandler} src={src} className={styles.img} ref={imgRef} {...imgAttr} />
      {children}
    </div>
  )
}

export default Avatar
