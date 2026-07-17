import { motion } from 'framer-motion'

export function AppLoader() {
  return (
    <motion.div
      className="
        flex
        h-screen
        items-center
        justify-center
        bg-gray-100"
    >
      <motion.div
        animate={{
          scale: [1, 0.9, 1],
        }}
        transition={{
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
      >
        <img alt="raspa-logo" className="h-16 w-96" src="/images/rasp-logo-purple.png" />
      </motion.div>
    </motion.div>
  )
}
