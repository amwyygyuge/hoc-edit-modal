var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as React from 'react';
import { Modal, Form, Spin, message } from 'igroot';
var Item = Form.Item;
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || 'Component';
}
var HocModal = function (_a) {
    var _b = _a.formOptions, formOptions = _b === void 0 ? { formKey: 'id' } : _b, create = _a.create, _c = _a.modalProps, modalProps = _c === void 0 ? {} : _c, update = _a.update;
    return function (WrappedComponent) {
        var EditModal = (function (_super) {
            __extends(EditModal, _super);
            function EditModal(props) {
                var _this = _super.call(this, props) || this;
                _this.formKey = "";
                _this.openWithSetValue = function (params) {
                    var _a = _this.props.form, resetFields = _a.resetFields, setFieldsValue = _a.setFieldsValue;
                    var paramsFilterFunction = formOptions.paramsFilterFunction, formKey = formOptions.formKey;
                    var state = _this.state;
                    _this.modalWillOpen(params);
                    var _params = {};
                    _params = paramsFilterFunction ? paramsFilterFunction(params, state) : params;
                    resetFields();
                    setTimeout(function () {
                        setFieldsValue(_params);
                    }, 0);
                    _this.formKey = params[formKey];
                    _this.setState({ visible: true, title: "\u4FEE\u6539 " + (modalProps.title ? modalProps.title : ''), status: 'edit' }, function () {
                        _this.modalDidOpen(params);
                    });
                };
                _this.openWithoutSetValue = function () {
                    var resetFields = _this.props.form.resetFields;
                    _this.modalWillOpen();
                    _this.formKey = "";
                    resetFields();
                    _this.setState({ visible: true, title: "\u65B0\u5EFA " + (modalProps.title ? modalProps.title : ''), status: 'create' }, function () {
                        _this.modalDidOpen();
                    });
                };
                _this.formCreate = function (params) {
                    var state = _this.state;
                    var promise = create && create(params, state, function (res) {
                        if (res) {
                            _this.close();
                            message.success('操作成功！');
                            _this.props.reload && _this.props.reload();
                        }
                        else {
                            _this.setState({ loading: false });
                            message.error(' 操作失败');
                        }
                    });
                    promise && promise.catch(function (err) { return _this.setState({ loading: false }); });
                };
                _this.formUpdate = function (params) {
                    var state = _this.state;
                    var promise = update && update(params, state, function (res) {
                        if (res) {
                            _this.close();
                            message.success('操作成功！');
                            _this.props.reload && _this.props.reload();
                        }
                        else {
                            _this.setState({ loading: false });
                            message.error('操作失败');
                        }
                    });
                    promise && promise.catch(function (err) { return _this.setState({ loading: false }); });
                };
                _this.submit = function () {
                    var validateFields = _this.props.form.validateFields;
                    validateFields(function (err, params) {
                        if (err)
                            return;
                        var formKey = formOptions.formKey;
                        _this.setState({ loading: true });
                        if (_this.formKey.length !== 0) {
                            params[formKey] = _this.formKey;
                            _this.formUpdate(params);
                        }
                        else {
                            _this.formCreate(params);
                        }
                    });
                };
                _this.close = function () {
                    _this.modalWillClose();
                    _this.setState({ visible: false, status: 'close', loading: false });
                };
                _this.formKey = "";
                _this.state = __assign({}, _this.state, { visible: false, loading: false, title: '', status: 'close' });
                _this.modalWillOpen = _this.modalWillOpen ? _this.modalWillOpen.bind(_this) : function () { };
                _this.modalDidOpen = _this.modalDidOpen ? _this.modalDidOpen.bind(_this) : function () { };
                _this.modalWillClose = _this.modalWillClose ? _this.modalWillClose.bind(_this) : function () { };
                return _this;
            }
            EditModal.prototype.componentWillMount = function () {
                _super.prototype.componentWillMount && _super.prototype.componentWillMount.call(this);
                this.props.getCreateFunction && this.props.getCreateFunction(this.openWithoutSetValue);
                this.props.getUpdateFunction && this.props.getUpdateFunction(this.openWithSetValue);
            };
            EditModal.prototype.modalWillOpen = function (params) { };
            EditModal.prototype.modalDidOpen = function (params) { };
            EditModal.prototype.modalWillClose = function (params) { };
            EditModal.prototype.render = function () {
                var _a = this.state, visible = _a.visible, loading = _a.loading, title = _a.title;
                return React.createElement(Modal, __assign({}, modalProps, { title: title, visible: visible, onCancel: this.close, onOk: this.submit, confirmLoading: loading }),
                    React.createElement(Spin, { spinning: loading },
                        React.createElement(Form, null, _super.prototype.render.call(this))));
            };
            EditModal.displayName = "EditModal(" + getDisplayName(WrappedComponent) + ")";
            return EditModal;
        }(WrappedComponent));
        return Form.create()(EditModal);
    };
};
export { Item };
export default HocModal;
