'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Item = undefined;

var _modal = require('igroot/lib/modal');

var _modal2 = _interopRequireDefault(_modal);

var _spin = require('igroot/lib/spin');

var _spin2 = _interopRequireDefault(_spin);

var _message2 = require('igroot/lib/message');

var _message3 = _interopRequireDefault(_message2);

var _form = require('igroot/lib/form');

var _form2 = _interopRequireDefault(_form);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('igroot/lib/modal/style');

require('igroot/lib/spin/style');

require('igroot/lib/message/style');

require('igroot/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = _form2.default.Item;

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
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
exports.Item = Item;

exports.default = function (_ref) {
  var _ref$formOptions = _ref.formOptions,
      formOptions = _ref$formOptions === undefined ? { formKey: 'id' } : _ref$formOptions,
      create = _ref.create,
      _ref$modalProps = _ref.modalProps,
      modalProps = _ref$modalProps === undefined ? {} : _ref$modalProps,
      update = _ref.update;
  return function (WrappedComponent) {
    var EditModal = function (_WrappedComponent) {
      _inherits(EditModal, _WrappedComponent);

      function EditModal() {
        _classCallCheck(this, EditModal);

        var _this = _possibleConstructorReturn(this, (EditModal.__proto__ || Object.getPrototypeOf(EditModal)).call(this));

        _this._openWithSetValue = function (params) {
          // 模态框打开
          var _this$props$form = _this.props.form,
              resetFields = _this$props$form.resetFields,
              setFieldsValue = _this$props$form.setFieldsValue;
          var paramsFilterFunction = formOptions.paramsFilterFunction,
              formKey = formOptions.formKey;

          var state = _this.state;
          _this.modalWillOpen(params);
          var _params = {};
          _params = paramsFilterFunction ? paramsFilterFunction(params, state) : params;
          resetFields();
          setTimeout(function () {
            setFieldsValue(_params);
          }, 0);
          _this[formKey] = params[formKey];
          _this.setState({ visible: true, title: '\u4FEE\u6539 ' + (modalProps.title ? modalProps.title : ''), status: 'edit' }, function () {
            _this.modalDidOpen(params);
          });
        };

        _this._openWithoutSetValue = function () {
          var formKey = formOptions.formKey;
          var resetFields = _this.props.form.resetFields;

          _this.modalWillOpen();
          _this[formKey] = undefined;
          resetFields();
          _this.setState({ visible: true, title: '\u65B0\u5EFA ' + (modalProps.title ? modalProps.title : ''), status: 'create' }, function () {
            _this.modalDidOpen();
          });
        };

        _this.formCreate = function (params) {
          var state = _this.state;
          var promise = create && create(params, state, function (res) {
            if (res) {
              _this._close();
              _message3.default.success('操作成功！');
              // 模态框关闭
              _this.props.reload && _this.props.reload();
            } else {
              _this.setState({ loading: false });
              _message3.default.error(' 操作失败');
            }
          });
          promise && promise.catch(function (err) {
            return _this.setState({ loading: false });
          });
        };

        _this.formUpdate = function (params) {
          var state = _this.state;
          var promise = update && update(params, state, function (res) {
            if (res) {
              _this._close();
              _message3.default.success('操作成功！');
              // 模态框关闭
              _this.props.reload && _this.props.reload();
            } else {
              _this.setState({ loading: false });
              _message3.default.error('操作失败');
            }
          });
          promise && promise.catch(function (err) {
            return _this.setState({ loading: false });
          });
        };

        _this.submit = function () {
          var validateFields = _this.props.form.validateFields;

          validateFields(function (err, params) {
            if (err) return;
            var formKey = formOptions.formKey;

            _this.setState({ loading: true });
            if (_this[formKey]) {
              params[formKey] = _this[formKey];
              _this.formUpdate(params);
            } else {
              _this.formCreate(params);
            }
          });
        };

        _this._close = function () {
          _this.modalWillClose();
          _this.setState({ visible: false, status: 'close', loading: false });
        };

        _this.state = _extends({}, _this.state, {
          visible: false,
          loading: false,
          title: '',
          status: 'close'
        });
        _this.modalWillOpen = _this.modalWillOpen ? _this.modalWillOpen.bind(_this) : function () {};
        _this.modalDidOpen = _this.modalDidOpen ? _this.modalDidOpen.bind(_this) : function () {};
        _this.modalWillClose = _this.modalWillClose ? _this.modalWillClose.bind(_this) : function () {};
        return _this;
      }

      _createClass(EditModal, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          _get(EditModal.prototype.__proto__ || Object.getPrototypeOf(EditModal.prototype), 'componentWillMount', this) && _get(EditModal.prototype.__proto__ || Object.getPrototypeOf(EditModal.prototype), 'componentWillMount', this).call(this);
          this.props.getCreateFunction && this.props.getCreateFunction(this._openWithoutSetValue);
          this.props.getUpdateFunction && this.props.getUpdateFunction(this._openWithSetValue);
        }
      }, {
        key: 'render',
        value: function render() {
          var _state = this.state,
              visible = _state.visible,
              loading = _state.loading,
              title = _state.title;

          return _react2.default.createElement(
            _modal2.default,
            _extends({}, modalProps, {
              title: title,
              visible: visible,
              onCancel: this._close,
              onOk: this.submit,
              confirmLoading: loading
            }),
            _react2.default.createElement(
              _spin2.default,
              { spinning: loading },
              _react2.default.createElement(
                _form2.default,
                null,
                _get(EditModal.prototype.__proto__ || Object.getPrototypeOf(EditModal.prototype), 'render', this).call(this)
              )
            )
          );
        }
      }]);

      return EditModal;
    }(WrappedComponent);

    EditModal.displayName = 'EditModal(' + getDisplayName(WrappedComponent) + ')';

    return _form2.default.create()(EditModal);
  };
};