import * as React from 'react'

export interface IModal {
  /**
   * If true, the modal will close when the user clicks confirm or dismiss
   */
  autoclose?: boolean
  body: React.ReactNode
  /**
   * Customise the confirm button
   */
  confirm?: React.ReactNode
  /**
   * Customise the dismiss button
   */
  dismiss?: React.ReactNode
  footer?: React.ReactNode
  header: React.ReactNode
  /**
   * Ignored if position is not set to 'modal'
   */
  intent?: TIntent
  /**
   * Whether dialog should be rendered as a drawer or modal
   */
  mode?: TMode
  open: boolean
  /**
   * Ignores default actions (footer).
   * Content is self sustainable. For example, viewing details of a record.
   * Ignored for modal position
   */
  passive?: boolean
  onConfirm?: () => void
  onDismiss?: () => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type TIntent = 'danger' | 'info' | 'warning'
export type TMode = 'drawer' | 'modal'
