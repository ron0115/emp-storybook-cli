import React from 'react'
import Avatar, {AvatarProps} from '../index'
import styles from './index.module.scss'
import {genStyles} from '../../utils'
export default {
  title: '组件/Avatar',
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component: '> 注意：可以透传 `<img>` 标签的所有参数（下表省略）',
      },
    },
  },
}

export const Docs = () => <></>
export const Error = () => <Avatar imgSrc={'baidu.com'} styles={styles} error={'//s1.yy.com/guild/header/10001.jpg'} />
Error.storyName = '获取失败需要指定error'

export const Success = () => (
  <Avatar imgSrc={'//downhdlogo.yy.com/hdlogo/144144/144/144/89/2363891295/u2363891295wciMfOI.jpg'} styles={styles} />
)
Success.storyName = '获取成功'

export const Slot = () => (
  <>
    <br />
    <Avatar imgSrc={'//downhdlogo.yy.com/hdlogo/144144/144/144/89/2363891295/u2363891295wciMfOI.jpg'} styles={styles}>
      <div className={styles.slot}>{'直播中'}</div>
    </Avatar>
  </>
)
Slot.storyName = '使用默认slot'
Slot.parameters = {
  docs: {
    description: {
      story: '> 默认的`childern`slot与`<img>`同层,当slot元素相对于avatar这一层定位的时候非常有用',
    },
  },
}
export const OnError = () => {
  const [tip, setTip] = React.useState('')
  const onError: AvatarProps['onError'] = e => {
    if (e.type === 'error') {
      setTip('触发onError')
    }
  }
  return (
    <Avatar onError={onError} imgSrc={'baidu.com'} styles={genStyles('ge-avatar', styles)}>
      {tip}
    </Avatar>
  )
}
OnError.storyName = '透传onerror参数到img上'
