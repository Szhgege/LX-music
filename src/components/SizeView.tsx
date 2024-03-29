import { memo, useCallback, useRef, useEffect } from 'react'
import { type LayoutChangeEvent, StyleSheet, View, StatusBar, Dimensions } from 'react-native'
import commonState from '@/store/common/state'
import { setStatusbarHeight } from '@/core/common'
import { windowSizeTools, getWindowSize } from '@/utils/windowSizeTools'


export default memo(() => {
  const currentHeightRef = useRef(commonState.statusbarHeight)
  const dimensionsChangedRef = useRef(true)
  const handleLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent | { nativeEvent: { layout: { width: number, height: number } } }) => {
    // console.log('handleLayout')
    if (!dimensionsChangedRef.current) return
    void getWindowSize().then(size => {
      dimensionsChangedRef.current = false
      // console.log(layout, size)
      const height = parseFloat(size.height.toFixed(2)) >= parseFloat(layout.height.toFixed(2))
        ? 0
        : (StatusBar.currentHeight ?? 0)

      if (currentHeightRef.current != height) {
        currentHeightRef.current = height
        setStatusbarHeight(height)
      }
      // console.log(layout, size)
      const currentSize = windowSizeTools.getSize()
      if (currentSize.width != layout.width || currentSize.height != layout.height) {
        windowSizeTools.setWindowSize(layout.width, layout.height)
      }
    })
  }, [])
  useEffect(() => {
    // let timeout: NodeJS.Timeout | null = null
    const subscription = Dimensions.addEventListener('change', () => {
      dimensionsChangedRef.current = true
      // if (timeout) clearTimeout(timeout)
      // timeout = setTimeout(() => {
      //   timeout = null
      //   viewRef.current?.measureInWindow((x, y, width, height) => {
      //     handleLayout({ nativeEvent: { layout: { width, height } } })
      //   })
      // }, 100)
    })

    return () => {
      subscription.remove()
    }
  }, [])
  return (<View style={StyleSheet.absoluteFill} onLayout={handleLayout} />)
}, () => true)

