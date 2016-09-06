import React, {Component, PropTypes} from 'react'
import {List, ListSubHeader, Button, Input} from 'react-toolbox'

export default function (compDef) {
  const {componentName,
	 fields
	} = compDef
  let propTypes = {}

  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const fieldNames = Object.keys(fields)
  fieldNames.map((fieldName)=>{
    if (fields[fieldName].relation) {
      const relation = fields[fieldName].relation
      const relationProperName = relation[0].toUpperCase() + relation.substring(1)
      propTypes[`${relation}Routes`] = PropTypes.object
      propTypes[`${relation}Templates`] = PropTypes.object
      propTypes[`save${componentProperName}${relationProperName}`] = PropTypes.func
      propTypes[`delete${componentProperName}${relationProperName}`] = PropTypes.func
      propTypes[`${relation}ComponentDef`] = PropTypes.object
      propTypes[`${relation}List`] = PropTypes.object
      propTypes[relation] = PropTypes.object
    }
  })
  class ComponentEdit extends Component {
    constructor(props) {
      super(props)
      this.state = JSON.parse(JSON.stringify(this.props[componentName]))
      console.log('isValid?', this.state.isValid)
      console.log('\n in constructor, props', this.props[componentName], 'state', this.state)
      this.save = () =>{this.props[`save${componentProperName}`](this.state)}
      this.store = () =>{this.props[`store${componentProperName}`](this.state)}
      this.goBack = this.props.goBack
    }

    componentWillMount() {
      console.log('\n in mount, props', this.props[componentName], 'state', this.state)
      this.relations = {}
      fieldNames.map((fieldName) =>{
	const field = fields[fieldName]
	const relation = field.relation
	if (this.state[relation]) {this.state[relation]={}}
	if (relation) {
// 	  const relationProperName = relation[0].toUpperCase() + relation.substring(1)
// 	  const saveRelation = this.props[`save${componentProperName}${relationProperName}`]
	  if (this.state[`${relation}Selecting`]) {
	    console.log(`${relation}Selecting`)
	    const id = this.props[relation].uuid
	    if (!this.state[relation]) {this.state[relation] = []}
	    this.state[relation][id] = id
	    delete this.state[`${relation}Selecting`]
	    this.save()
	  }
	}
      })
    }

    componentDidMount() {}
    shouldComponentUpdate() {
      return true
    }

    componentWillReceiveProps() {
//       this.state = JSON.parse(JSON.stringify(this.props[componentName]))
//       console.log('receiveProps == isValid?', this.state.isValid)
    }

    componentWillUpdate() {
      console.log('componentWillUpdate')
    }
    componentDidUpdate() {console.log('componentDidUpdate')}

    componentWillUnmount() {
      this.save()
    }

    render() {
      console.log('Render')
      this.state = JSON.parse(JSON.stringify(this.props[componentName]))
      console.log('in Update == isValid?', this.state.isValid)
      const listCaption = `Ingrese datos de ${componentProperName}`
      const listFields = fieldNames.map((fieldName)=>{
	let label = fields[fieldName].label
	if (!label || label === '') {
	  label = fieldName
	}
	const componentField = compDef.fields[fieldName]
	const fieldError = `${fieldName}Error`
	let error = []
	console.log('errors', this.state[fieldError])
	if (this.state[fieldError] && this.state[fieldError].length >0) {
	  error = this.state[fieldError].map((err) =>{return <span key={err}>{err}</span>})
	}
	if (fields[fieldName].relation) {
	  const relation = fields[fieldName].relation
	  const relationList = this.props[`${relation}List`]
//	  const relationComponentDef = this.props[`${relation}ComponentDef`]
//	  const relationProperName = relation[0].toUpperCase() + relation.substring(1)
//	  const saveRelation = this.props[`save${componentProperName}${relationProperName}`]
//	  const deleteRelation = this.props[`delete${componentProperName}${relationProperName}`]
	  const routes = `${relation}Routes`
	  const listRoute = this.props[routes][`${relation}List`]
	  let relListFields= []
	  if (relation && this.state[relation]) {
	    const ids = Object.keys(this.state[relation])
	    if (ids.length > 0) {
	       relListFields = ids.map(id => {
		const comp = relationList[id]
		let thisComp = []
		for (let key in comp) {
		  thisComp.push(<div key={key}>{key}: {comp[key]}</div>)
		}
		return <div key={comp.uuid}>{thisComp}
		  <Button icon='close' floating accent mini onClick={
		    () =>{
		      delete this.state[relation][comp.uuid]
		      this.save()
		      //deleteRelation(comp.uuid)
		    }
		  }/>
		  </div>
	      })
	    }
	  }
	  return <div key={fieldName}>
	    <label>{relation}</label>
	    <List>{relListFields}</List>
	    <Button icon='add' onClick={() => {
	      this.state[`${relation}Selecting`] = true
	      this.props.pushRoute(listRoute)
	    }}
	    /></div>
	}
	return <div key={fieldName}>
	  <Input value={this.state[fieldName] ||''}
	type={componentField.uiType} label={label} name='name' icon={componentField.icon}
	hint={componentField.hint}
	onChange={(e) => {
	  this.state[fieldName] = e
	  this.save()
	}}/>
	  {error}
	</div>
      })
      return <div>
	<ListSubHeader caption={listCaption}/>
	{listFields}
	<Button icon='done' floating disabled={!this.state.isValid} accent mini onClick={(e)=>{
	  this.store()
	  this.goBack()
	}}/>
	<Button icon='undo' floating accent mini onClick={()=>{this.goBack()}}/>
	</div>
    }
  }

  ComponentEdit.propTypes = propTypes
  ComponentEdit.propTypes[`${componentName}`] = PropTypes.object
  ComponentEdit.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes[`store${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes.goBack = PropTypes.func
  ComponentEdit.propTypes.pushRoute = PropTypes.func
  return ComponentEdit
}
