import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'

import { classes } from './constants'
import { IModal } from './interfaces'

export function Drawer(props: Omit<IModal, 'intent'>) {
  const {
    autoclose = true,
    body,
    confirm = 'Confirm',
    dismiss = 'Dismiss',
    footer,
    header,
    open,
    onConfirm,
    onDismiss,
    passive,
    setOpen,
  } = props

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={setOpen}
          as="div"
          className="
            fixed
            inset-0
            z-[150]"
        >
          {/* The overlay */}
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-100 opacity-75" />
          </div>

          <Dialog.Panel>
            <motion.div
              className="
                fixed
                inset-y-0
                right-0
                flex
                h-screen
                max-w-full
                flex-col"
              initial={{
                transform: 'translateX(100%)',
              }}
              animate={{
                transform: 'translateX(0%)',
                transition: {
                  ease: [0.08, 0.65, 0.53, 0.96],
                  duration: 0.3,
                },
              }}
              exit={{
                transform: 'translateX(100%)',
                transition: {
                  ease: [0.96, 0.53, 0.65, 0.08],
                  duration: 0.3,
                },
              }}
            >
              <div
                className="
                  relative
                  h-full
                  transform
                  overflow-hidden
                  transition-all
                  sm:w-full
                  sm:max-w-lg
                  sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="flex h-full w-full flex-col">
                  {/* Header */}
                  <div className="flex w-full items-center">
                    <div
                      className="
                        mr-0.5 flex w-8 items-center
                        justify-center"
                    >
                      <button
                        className="
                          w-full
                          text-3xl
                          text-orange-600
                          hover:text-orange-300
                          focus:outline-none
                          focus:ring-0"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon
                          className="h-6 w-6 font-extrabold"
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <Dialog.Title
                      as="span"
                      className="
                        flex
                        w-full
                        border-b
                        border-orange-100
                        bg-orange-50
                        p-3"
                    >
                      {typeof header === 'string' && (
                        <span
                          className="
                            items-center
                            text-lg
                            font-medium
                            leading-6
                            text-gray-500"
                        >
                          {header}
                        </span>
                      )}
                    </Dialog.Title>
                  </div>

                  <div className="ml-8 flex h-full flex-col bg-white">
                    {/* Body */}
                    <div className="flex w-full flex-grow flex-col">
                      {body}
                    </div>

                    {/* Actions */}
                    {!passive && (
                      <div className={classes.footer}>
                        {!footer && (
                          <>
                            <button
                              type="button"
                              tabIndex={0}
                              className={classes.confirm}
                              onClick={() => {
                                onConfirm && onConfirm()
                                autoclose && setOpen(false)
                              }}
                            >
                              {confirm}
                            </button>

                            <button
                              type="button"
                              tabIndex={0}
                              className={classes.dismiss}
                              onClick={() => {
                                onDismiss && onDismiss()
                                autoclose && setOpen(false)
                              }}
                            >
                              {dismiss}
                            </button>
                          </>
                        )}
                        {footer}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
