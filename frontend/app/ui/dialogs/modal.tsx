import { Dialog } from '@headlessui/react'
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

import { classes } from './constants'
import { IModal, TIntent } from './interfaces'

export function Modal(props: IModal) {
  const {
    autoclose = true,
    body,
    confirm = 'Confirm',
    dismiss = 'Dismiss',
    footer,
    header,
    intent = 'info',
    open,
    onConfirm,
    onDismiss,
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
            z-[150]
            flex
            items-center
            justify-center
            overflow-y-auto"
        >
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </div>

          <Dialog.Panel>
            <motion.div
              className="
                flex
                min-h-screen
                items-end
                justify-center
                px-4
                pb-20
                pt-4
                text-center
                sm:block
                sm:p-0"
              initial={{
                opacity: 0,
                scale: 0.75,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  ease: 'easeOut',
                  duration: 0.15,
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                transition: {
                  ease: 'easeIn',
                  duration: 0.15,
                },
              }}
            >
              <span
                className="hidden sm:inline-block sm:h-screen sm:align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <div
                className="
                  inline-block
                  min-w-[20rem]
                  transform
                  overflow-hidden
                  rounded-lg
                  bg-white
                  text-left
                  align-bottom
                  shadow-xl
                  transition-all
                  sm:my-8
                  sm:w-full
                  sm:max-w-lg
                  sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white px-2 pb-2 pt-3 sm:p-3 sm:pb-2">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-full
                        sm:mx-0
                        sm:h-8
                        sm:w-8
                        ${
                          intent === 'danger'
                            ? 'bg-red-50'
                            : intent === 'info'
                            ? 'bg-blue-50'
                            : 'bg-yellow-50'
                        }
                      `}
                    >
                      {IntentMap[intent]}
                    </div>
                    <div className="mt-2 text-center sm:ml-2 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="
                          text-lg
                          font-medium
                          leading-6
                          text-gray-500"
                      >
                        {header}
                      </Dialog.Title>

                      <Dialog.Description
                        as="p"
                        className="mt-2 text-sm text-gray-400"
                      >
                        {body}
                      </Dialog.Description>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={classes.footer}>
                  {!footer && (
                    <>
                      {/* Confirm */}
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

                      {/* Dismiss */}
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
              </div>
            </motion.div>
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

const IntentMap: Record<TIntent, React.ReactNode> = {
  danger: <ExclamationCircleIcon className="h-12 w-12 text-red-400" />,
  info: <InformationCircleIcon className="h-12 w-12 text-blue-400" />,
  warning: <ExclamationCircleIcon className="h-12 w-12 text-yellow-400" />,
}
