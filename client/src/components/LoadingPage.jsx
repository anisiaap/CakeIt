import React from 'react'
import { useSpring, animated } from '@react-spring/web'

export default function LoadingPage() {
  const [chargeProps, setChargeProps] = useSpring(() => ({
    width: '0%',
    config: { duration: 2000 },
  }))

  React.useEffect(() => {
    setChargeProps({ width: '100%' })
  }, [setChargeProps])

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-8">Loading...</h1>
      <div className="w-64 h-8  rounded-full overflow-hidden">
        <animated.div
          style={chargeProps}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
      <p className="mt-4 text-gray-400">Preparing your bakery experience</p>
    </div>
  )
}