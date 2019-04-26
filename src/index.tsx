import * as React from 'react'
import { Modal, Form, Spin, message } from 'igroot'
import { FormComponentProps } from 'antd/lib/form'
import { ModalProps } from 'igroot/lib/modal';
const { Item } = Form
interface FormProps extends FormComponentProps {
  getCreateFunction(func: openWithoutSetValue): void
  getUpdateFunction(func: openWithSetValue): void
  readonly[propName: string]: any
}
function getDisplayName(WrappedComponent: React.ComponentClass<Readonly<FormProps>>) {
  return WrappedComponent.displayName || 'Component'
}
interface paramsFilterFunction {
  (params: userInput, state: any): void
}
interface callBack {
  (isOk: boolean): void
}

interface openWithoutSetValue {
  (): void
}
interface openWithSetValue {
  (params: userInput): void
}

interface fetchFunc {
  (params: {}, state: {}, res: callBack): Promise<void>
}
type EditModalParams = {
  formOptions: {
    paramsFilterFunction?: paramsFilterFunction
    formKey: string
  },
  update: fetchFunc
  create: fetchFunc
  modalProps?: ModalProps
}
type userInput = any
interface Hoc {
  modalWillOpen(params: userInput): void
  modalDidOpen(params: userInput): void
  modalWillClose(params: userInput): void
  formKey: string
}

interface HocComponent {
  (WrappedComponent: React.ComponentClass<Readonly<FormProps>>): any
}
interface HocModal {
  (EditModalParams: EditModalParams): HocComponent
}

const HocModal: HocModal = (
  { formOptions = { formKey: 'id' }, create, modalProps = {}, update }: EditModalParams
) =>
  (WrappedComponent: React.ComponentClass<Readonly<FormProps>>) => {
    class EditModal extends WrappedComponent implements Hoc {
      static displayName = `EditModal(${getDisplayName(WrappedComponent)})`
      constructor(props: any) {
        super(props)
        this.formKey = ""
        this.state = {
          ...this.state,
          visible: false,
          loading: false,
          title: '',
          status: 'close'
        }
        this.modalWillOpen = this.modalWillOpen ? this.modalWillOpen.bind(this) : () => { }
        this.modalDidOpen = this.modalDidOpen ? this.modalDidOpen.bind(this) : () => { }
        this.modalWillClose = this.modalWillClose ? this.modalWillClose.bind(this) : () => { }
      }

      componentWillMount() {
        super.componentWillMount && super.componentWillMount()
        this.props.getCreateFunction && this.props.getCreateFunction(this.openWithoutSetValue)
        this.props.getUpdateFunction && this.props.getUpdateFunction(this.openWithSetValue)
      }
      public formKey = ""
      public modalWillOpen(params?: userInput) { }
      public modalDidOpen(params?: userInput) { }
      public modalWillClose(params?: userInput) { }
      private openWithSetValue = (params: userInput) => {
        // 模态框打开
        const { resetFields, setFieldsValue } = this.props.form
        const { paramsFilterFunction, formKey } = formOptions
        const state = this.state
        this.modalWillOpen(params)
        let _params = {}
        _params = paramsFilterFunction ? paramsFilterFunction(params, state) : params
        resetFields()
        setTimeout(() => {
          setFieldsValue(_params)
        }, 0)
        this.formKey = params[formKey]
        this.setState({ visible: true, title: `修改 ${modalProps.title ? modalProps.title : ''}`, status: 'edit' }, () => {
          this.modalDidOpen(params)
        })

      }

      private openWithoutSetValue = () => {
        const { resetFields } = this.props.form
        this.modalWillOpen()
        this.formKey = ""
        resetFields()
        this.setState({ visible: true, title: `新建 ${modalProps.title ? modalProps.title : ''}`, status: 'create' }, () => {
          this.modalDidOpen()
        })
      }

      formCreate = (params: userInput) => {
        const state = this.state
        const promise = create && create(params, state, res => {
          if (res) {
            this.close()
            message.success('操作成功！')
            // 模态框关闭
            this.props.reload && this.props.reload()
          } else {
            this.setState({ loading: false })
            message.error(' 操作失败')
          }
        })
        promise && promise.catch(err => this.setState({ loading: false }))

      }

      formUpdate = (params: userInput) => {
        const state = this.state
        const promise = update && update(params, state, res => {
          if (res) {
            this.close()
            message.success('操作成功！')
            // 模态框关闭
            this.props.reload && this.props.reload()
          } else {
            this.setState({ loading: false })
            message.error('操作失败')
          }
        })
        promise && promise.catch(err => this.setState({ loading: false }))
      }


      submit = () => {
        const { validateFields } = this.props.form
        validateFields((err, params) => {
          if (err) return
          const { formKey } = formOptions
          this.setState({ loading: true })
          if (this.formKey.length !== 0) {
            params[formKey] = this.formKey
            this.formUpdate(params)
          } else {
            this.formCreate(params)
          }
        })
      }

      private close = () => {
        this.modalWillClose()
        this.setState({ visible: false, status: 'close', loading: false })
      }

      render() {
        const { visible, loading, title } = this.state
        return <Modal
          {...modalProps}
          title={title}
          visible={visible}
          onCancel={this.close}
          onOk={this.submit}
          confirmLoading={loading}
        >
          <Spin spinning={loading}>
            <Form>
              {super.render()}
            </Form>
          </Spin>
        </Modal>
      }
    }
    return Form.create<FormComponentProps>()(EditModal)

  }

export { Item, FormProps }
export default HocModal