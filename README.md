# 表单模态框

## 场景

适用绝大部分列表页面的数据编辑和创建场景，配合高阶列表组件使用更佳，省去繁琐的交互，快速写出业务需求。

![image-20181121111104517](/Users/caijunxiong/Library/Application Support/typora-user-images/image-20181121111104517.png)



## 优点

1. 代处理繁琐的模态框逻辑
2. 统一表单模态框的使用方式
3. 使用者只需关注不同业务的差异部分（表单项）
4. 统一化场景的体验



## 使用

基础之前讲的高阶组件列表的目录结构下，新增一个jsx文件。

### 项目目录

```jsx
├── List
│   ├── SupplierEditModal.jsx # 这个就是我们新建的模态框组件
│   └── index.jsx
├── Search.jsx
└── index.jsx
```

###模态框(SupplierEditModal.jsx)

先贴代码

```jsx
import React, { Component } from 'react'
import { Input } from 'igroot'
import HocModal, { Item } from '@/components/EditModal/'
import { createSupplier } from '@/apis/supplier/createSupplier'
import { updateSupplier } from '@/apis/supplier/updateSupplier'
// 主要业务逻辑通过配置写入
@HocModal({
  modalProps: {
    title: '厂商配置',
    width: 600
  },
  create: (params, state, cb) =>
    createSupplier(params).then(res => {
      if (res.data.createSupplier.result) {
        cb(true)
      } else {
        cb(false)
      }
    }),
  update: (params, state, cb) =>
    updateSupplier(params).then(res => {
      if (res.data.updateSupplier.result) {
        cb(true)
      } else {
        cb(false)
      }
    }),
  formOptions: {
    formKey: 'id',
    paramsFilterFunction: params => {
      const { supplier_name, supplier_ename, supplier_cname_suffix, remark } = params
      return { supplier_name, supplier_ename, supplier_cname_suffix, remark }
    }
  }
})
export default class SupplierEditModal extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Item label="厂商名称">
          {
            getFieldDecorator('supplier_name', {
              rules: [{
                required: true, message: '厂商名称必填',
              }]
            })(
              <Input />
            )
          }
        </Item>
        <Item label="厂商英文名">
          {
            getFieldDecorator('supplier_ename', {

              rules: [{
                required: true, message: '厂商英文名必填',
              }]

            })(
              <Input />
            )
          }
        </Item>
        <Item label="默认cname后缀">
          {
            getFieldDecorator('supplier_cname_suffix', {
              rules: [{
                required: true, message: '厂商后缀名必填',
              }]
            })(
              <Input />
            )
          }
        </Item>
        <Item label="备注">
          {
            getFieldDecorator('remark')(
              <Input.TextArea />
            )
          }
        </Item>
      </div>
    )
  }
}
```

模态框的和后端交互的业务逻辑击中在配置那边提现，组件内部都是UI层面的内容，规范化开发提高UI部分的复用率。



### 模态框调用(List.jsx)

这部分代码之前已经看过了，集中看调用部分

```jsx
import React, { Component } from 'react'
import { Row, Col, Table, Button, message, Popconfirm } from 'igroot'
import { deleteSupplier } from '@/apis/supplier/deleteSupplier'
// 引用
import SupplierEditModal from './SupplierEditModal'
export class List extends Component {
  state = {
    expandKeys: [],
    columns: [
      {
        title: '厂商',
        dataIndex: 'supplier_name',
        width: 150,
      },
      {
        title: '厂商英文名',
        dataIndex: 'supplier_ename',
        width: 150,
      },
      {
        title: '默认cname后缀',
        dataIndex: 'supplier_cname_suffix',
        width: 200,

      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 200,

      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200

      },
      {
        title: '操作',
        dataIndex: 'handel',
        width: 80,
        render: (text, row) => <div style={{ textAlign: 'center' }}>
          <a style={{ marginRight: 8 }} onClick={() => this.edit(row)}>编辑</a>
          <Popconfirm title="确定删除？" onConfirm={() => this.del(row.id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      }
    ]
  }

  del = id => {
    if (this.delLoading) {
      return false
    }
    const loading = message.loading('删除中，请稍后....')
    deleteSupplier({ id: [id] }).then(res => {
      loading()
      this.delLoading = false
      if (res.data.deleteSupplier.result) {
        message.success('删除成功')
        // 组件接收到了父级的handleReload的方法
        this.props.handleReload()
      }
    })
  }
// 编辑数据
  edit = row => {
    this.Update(row)
  }

  render() {
    const { columns } = this.state
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
           // 新建数据
          <Button type="primary" onClick={() => this.Create()} style={{ marginRight: 8 }}>
            新增
          </Button>
        </Col>
        <Col span={24} style={{ marginTop: 8 }}>
          <Table
            columns={columns}
            // 组件接收到了父级的tableProps 的属性
            {...this.props.tableProps}
          />
        </Col>
         // 模态框实例化，接受两个可调用函数，传入一个页面重新加载函数
        <SupplierEditModal
          getCreateFunction={fun => this.Create = fun}
          getUpdateFunction={fun => this.Update = fun}
          reload={this.props.handleReload}
        />
      </Row>
    )
  }
}
```

在模态框组件上写入两个props，分别接受**新建**需要调用的函数，和**编辑**需要调用的函数。还有一个是列表页面的重载函数。

## 配置

| 参数名      | 类型     | 描述        |
| ----------- | -------- | ----------- |
| create      | function | 提交函数    |
| update      | function | 编辑函数    |
| formOptions | object   | 表单配置项  |
| modalProps  | object   | 模态框props |

### formOptions

formOptions表单数据的配置项，这部分只有在编辑的时候才有需要用到，如果模态框只是单纯新建，可以不用做任何配置。

| 参数名               | 类型     | 描述                                                         |
| -------------------- | -------- | ------------------------------------------------------------ |
| formKey              | string   | 编辑时传给后端的id，可以选取调用编辑函数传入对象的任意键值   |
| paramsFilterFunction | function | 编辑时要写入的表单数据，入参为调用编辑函数时传入的对象，返回值为对象 |

### create 和update 函数的 入参

这边期望返回值是一个promise对象，这样就不用自己写catch了

| 参数名 | 类型     | 描述                                                         |
| ------ | -------- | ------------------------------------------------------------ |
| params | object   | 表单数据                                                     |                                                         |
| state  | object   | 组件的state                                                  |
| cb     | function | 请求结果的回调函数，如果请求成功返回 true，如果请求失败返回false |

## props
模态框实例化时可以接受的props

| 参数名            | 类型     | 描述                     |
| ----------------- | -------- | ------------------------ |
| getCreateFunction | function | 接受模态框新建数据的方法 |
| getUpdateFunction | function | 接受模态框编辑数据的方法 |
| reload            | function | 列表页面刷新的方法       |

## state

在实际项目中，有可能会遇到编辑状态和新装状态时UI部分表现不一致的情况。所以在state中提供一个判断的标识字段。并不是所有场景都需要，下面看一下实际应用代码。

一共有三个状态 edit create close

#### 新建的状态

![image-20181121111104517](/Users/caijunxiong/Library/Application Support/typora-user-images/image-20181121111104517.png)



#### 编辑的状态

![image-20181121145931728](/Users/caijunxiong/Library/Application Support/typora-user-images/image-20181121145931728.png)

#### 代码部分

```jsx
  renderDiff = () => {
    const { status } = this.state
    const { getFieldDecorator } = this.props.form
    if (status === 'edit') {
      const { customer_domain_cname, solution, customer_domain, customer_ename } = params
      return <Row gutter={10}>
        <Col span={4} >
          <Item label="客户" >
            {customer_ename}
          </Item>
        </Col>
        <Col span={8}>
          <Item label="客户域名"  >
            {customer_domain}
          </Item>
        </Col>
        <Col span={6} >
          <Item label="cname" >
            {customer_domain_cname}
          </Item>
        </Col>
        <Col span={6} >
          <Item label="覆盖" >
            {solution}
          </Item>
        </Col>
      </Row>
    }
    if (status === 'create') {
      const { customer_domain_cname, solution } = domain
      return <Row gutter={20}>
        <Col span={4} >
          <Item label="客户" >
            {
              getFieldDecorator('customer_id', {
                rules: [{
                  required: true, message: '客户必填',
                }]
              })(

                <SearchSelect
                  onChange={this.customerChange}
                  options={customerList}
                  limtle={50}
                  optionKey={{ label: 'customer_name', value: 'id' }}
                  trim
                />
              )
            }
          </Item>
        </Col>
        <Col span={8}>
          <Item label="客户域名"  >
            {
              getFieldDecorator('customer_domain_id', {
                rules: [{
                  required: true, message: '客户域名必填',
                }]
              })(
                <SearchSelect
                  options={customerDomainList}
                  disabled={customerDomainLock}
                  placeholder={customerDomainLock ? '数据加载中...' : null}
                  onChange={this.domainChange}
                  allowClear
                  trim
                  limtle={50}
                  optionKey={{ label: 'customer_domain', value: 'customer_domain' }}
                />
              )
            }
          </Item>
        </Col>
        <Col span={6} >
          <Item label="cname" >
            {customer_domain_cname}
          </Item>
        </Col>
        <Col span={6} >
          <Item label="覆盖" >
            {solution}
          </Item>
        </Col>
      </Row>
    }
  }
```

### 生命周期

| 名称           | 入参                                         | 描述                                 |
| -------------- | -------------------------------------------- | ------------------------------------ |
| modalWillOpen  | 新建打开时无入参，编辑打开时既编辑函数的入参 | 模态框还未打开，表单数据还未写入之前 |
| modalDidOpen   | 新建打开时无入参，编辑打开时既编辑函数的入参 | 模态框已经打开，表单数据已经写入之后 |
| modalWillClose | 无                                           | 模态框关闭之前                       |

