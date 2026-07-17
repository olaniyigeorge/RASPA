import { Drawer } from './drawer'
import { IModal } from './interfaces'
import { Modal } from './modal'

export function Dialog(props: IModal) {
  const { mode = 'modal' } = props

  return (
    <>
      {mode === 'modal' && <Modal {...props} />}
      {mode === 'drawer' && <Drawer {...props} />}
    </>
  )
}
