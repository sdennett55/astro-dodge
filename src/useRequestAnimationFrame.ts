import React from "react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRequestAnimationFrame = (callback: any) => {
  const requestRef = React.useRef<number>(0)
  const previousTimeRef = React.useRef<number>()

  React.useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current) callback(time - previousTimeRef.current)
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [callback])
}
