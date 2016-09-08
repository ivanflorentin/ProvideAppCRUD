import React, {Component, PropTypes} from 'react'
import {List, ListSubHeader, Button, Input} from 'react-toolbox'

export default function (modelDef) {
  const {modelName,
	 fields
	} = modelDef
  let propTypes = {}

  const modelProperName = modelName[0].toUpperCase() + modelName.substring(1)
  const fieldNames = Object.keys(fields)
  fieldNames.map((fieldName)=>{
    if (fields[fieldName].relation) {
      const relation = fields[fieldName].relation
      const relationProperName = relation[0].toUpperCase() + relation.substring(1)
      propTypes[`${relation}Routes`] = PropTypes.object
      propTypes[`${relation}Templates`] = PropTypes.object
      propTypes[`save${modelProperName}${relationProperName}`] = PropTypes.func
      propTypes[`delete${modelProperName}${relationProperName}`] = PropTypes.func
      propTypes[`${relation}ModelDef`] = PropTypes.object
      propTypes[`${relation}List`] = PropTypes.object
      propTypes[relation] = PropTypes.object
    }
  })
  class ModelEdit extends Component {
    constructor(props) {
      super(props)
      this.state = JSON.parse(JSON.stringify(this.props[modelName]))
      this.save = () =>{this.props[`save${modelProperName}`](this.state)}
      this.store = () =>{this.props[`store${modelProperName}`](this.state)}
      this.goBack = this.props.goBack
    }

    modelWillMount() {
      this.relations = {}
      fieldNames.map((fieldName) =>{
	const field = fields[fieldName]
	const relation = field.relation
	if (this.state[relation]) {this.state[relation]={}}
	if (relation) {
// 	  const relationProperName = relation[0].toUpperCase() + relation.substring(1)
// 	  const saveRelation = this.props[`save${modelProperName}${relationProperName}`]
	  if (this.state[`${relation}Selecting`]) {
	    const id = this.props[relation].uuid
	    if (!this.state[relation]) {this.state[relation] = []}
	    this.state[relation][id] = id
	    delete this.state[`${relation}Selecting`]
	    this.save()
	  }
	}
      })
    }

    modelDidMount() {}
    shouldModelUpdate() {
      return true
    }

    modelWillReceiveProps() {
//       this.state = JSON.parse(JSON.stringify(this.props[modelName]))
//       console.log('receiveProps == isValid?', this.state.isValid)
    }

    modelWillUpdate() {
      console.log('modelWillUpdate')
    }
    modelDidUpdate() {console.log('modelDidUpdate')}

    modelWillUnmount() {
      this.save()
    }

    render() {
      console.log('Render')
      this.state = JSON.parse(JSON.stringify(this.props[modelName]))
      console.log('in Update == isValid?', this.state.isValid)
      const listCaption = `Ingrese datos de ${modelProperName}`
      const listFields = fieldNames.map((fieldName)=>{
	let label = fields[fieldName].label
	if (!label || label === '') {
	  label = fieldName
	}
	const modelField = modelDef.fields[fieldName]
	const fieldError = `${fieldName}Error`
	let error = []
	console.log('errors', this.state[fieldError])
	if (this.state[fieldError] && this.state[fieldError].length >0) {
	  error = this.state[fieldError].map((err) =>{return <span key={err}>{err}</span>})
	}
	if (fields[fieldName].relation) {
	  const relation = fields[fieldName].relation
	  const relationList = this.props[`${relation}List`]
//	  const relationModelDef = this.props[`${relation}ModelDef`]
//	  const relationProperName = relation[0].toUpperCase() + relation.substring(1)
//	  const saveRelation = this.props[`save${modelProperName}${relationProperName}`]
//	  const deleteRelation = this.props[`delete${modelProperName}${relationProperName}`]
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
	type={modelField.uiType} label={label} name='name' icon={modelField.icon}
	hint={modelField.hint}
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

  ModelEdit.propTypes = propTypes
  ModelEdit.propTypes[`${modelName}`] = PropTypes.object
  ModelEdit.propTypes[`save${modelProperName}`] = PropTypes.func
  ModelEdit.propTypes[`store${modelProperName}`] = PropTypes.func
  ModelEdit.propTypes.goBack = PropTypes.func
  ModelEdit.propTypes.pushRoute = PropTypes.func
  return ModelEdit
}
