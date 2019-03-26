import React from 'react'
import { Modal, Form, Spin, message } from 'igroot'
const { Item } = Form
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component'
}
/**
 * @param {object} formOptions 表单配置项
 * @param {function}  create 提交函数
 * @param {function} update 更新函数
 * @param {object} modalProps  模态框配置
 * @description 类声明生命周期
 * 1.modalWillOpen 模态框开启时
 * 2.modalWillClose 模态框关闭时
 */
export { Item }

export default (
  { formOptions = { formKey: 'id' }, create, modalProps = {}, update, initState = () => { } }
  ) =>
  WrappedComponent => {
    class EditModal extends WrappedComponent {
      static displayName = `EditModal(${getDisplayName(WrappedComponent)})`
      constructor() {
        super()
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
        this.props.getCreateFunction && this.props.getCreateFunction(this._openWithoutSetValue)
        this.props.getUpdateFunction && this.props.getUpdateFunction(this._openWithSetValue)
      }

      _openWithSetValue = params => {
        // 模态框打开
        const { resetFields, setFieldsValue } = this.props.form
        const { paramsFilterFunction, formKey } = formOptions
        const state = this.state
        this.modalWillOpen(params)
        let _params = {}
        _params = paramsFilterFunction ? paramsFilterFunction(params, state) : params
        const initValues = initState(params, state)
        initValues && this.setState({ ...initValues })
        resetFields()
        setTimeout(() => {
          setFieldsValue(_params)
        }, 0)
        this[formKey] = params[formKey]
        this.setState({ visible: true, title: `修改 ${modalProps.title ? modalProps.title : ''}`, status: 'edit' }, () => {
          this.modalDidOpen(params)
        })

      }

      _openWithoutSetValue = () => {
        const { formKey } = formOptions
        const { resetFields } = this.props.form
        this.modalWillOpen()
        this[formKey] = undefined
        const state = this.state
        const initValues = initState({}, state)
        initValues && this.setState({ ...initValues })
        resetFields()
        this.setState({ visible: true, title: `新建 ${modalProps.title ? modalProps.title : ''}`, status: 'create' }, () => {
          this.modalDidOpen()
        })

      }

      formCreate = params => {
        const state = this.state
        const promise = create && create(params, state, res => {
          if (res) {
            this._close()
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

      formUpdate = params => {
        const state = this.state
        const promise = update && update(params, state, res => {
          if (res) {
            this._close()
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
          if (this[formKey]) {
            params[formKey] = this[formKey]
            this.formUpdate(params)
          } else {
            this.formCreate(params)
          }
        })
      }

      _close = () => {
        this.modalWillClose()
        this.setState({ visible: false, status: 'close', loading: false })
      }

      render() {
        const { visible, loading, title } = this.state
        return <Modal
          {...modalProps}
          title={title}
          visible={visible}
          onCancel={this._close}
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
    return Form.create()(EditModal)
  }
