import * as React from 'react'
import { Card, Input, Button } from 'igroot'
import HocModal, { Item } from './../../src';

import './index.less'

@HocModal({
	formOptions: {
		formKey: "id"
	},
	create: async () => {
		await fetch("www.baidu.com");
	},
	update: async () => {
		await fetch("www.baidu.com");
	}
})
class Demo extends React.Component<any>{
	render() {
		const { getFieldDecorator } = this.props.form

		return <div>
			<Item>
				{
					getFieldDecorator("name")(
						<Input />

					)
				}
			</Item>
		</div>
	}
}
class App extends React.Component {
	public create = () => {
		console.log("object");
	 }

	render() {
		return (
			<Card title='dwda'>
				<Demo getCreateFunction={func => this.create = func} />
				<Button onClick={() => {
					this.create()
				}}>dadwad</Button>
			</Card>
		)
	}
}

export default App
