import React, {PropTypes} from 'react'
import {List, ListItem,ListSubHeader, Button, Input} from 'react-toolbox'

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
      const relationProperName = relation.toUpperCase() + relation.substring(1)
      propTypes[`${relation}Routes`] = PropTypes.object
      propTypes[`${relation}Templates`] = PropTypes.object
      propTypes[`relationDisplay${relationProperName}`] = PropTypes.func
      propTypes[`${relation}ComponentDef`] = PropTypes.object
      propTypes[`${relation}List`] = PropTypes.array
      propTypes[relation] = PropTypes.object
    }
  })
  const ComponentEdit = (props) =>{
    const next = Object.assign({}, props[componentName])
    const save = () =>{props[`save${componentProperName}`](next)}
    const store = () =>{props[`store${componentProperName}`](next)}
    const {goBack} = props
    const listCaption = `Ingrese datos de ${componentProperName}`


    const listFields = fieldNames.map((fieldName)=>{
      let label = fields[fieldName].label
      if (!label || label === '') {
	  label = fieldName
	}
      const componentField = compDef.fields[fieldName]
      const fieldError = `${fieldName}Error`
      let error = ''
      if (next[fieldError]) {
	error = <span>{next[fieldError]}</span>
      }
      if (fields[fieldName].relation) {
	const relation = fields[fieldName].relation
	console.log('relation',props[relation])
	const relationList = props[`${relation}List`]
	const relationComponentDef = props[`${relation}ComponentDef`]
	const relationProperName = relation.toUpperCase() + relation.substring(1)
	const routes = `${relation}Routes`
	const listRoute = props[routes][`${relation}List`]

	if (next[relation]===undefined) {next[relation]=[]}
	if (next[`${relation}Selecting`]) {
	  if (next[relation].indexOf(props[relation].uuid)===-1) {
	    console.log('adding', props[relation].uuid)
	    next[relation].push(props[relation].uuid)
	  }
	  delete next[`${relation}Selecting`]
	}
	const relListFields= relationList.filter(comp =>{
	  if (next[relation].indexOf(comp.uuid)) {
	    return true
	  }
	  return false
	}).map(comp=>{
	  let thisComp = []
	  for (let key in comp) {
	    thisComp.push(<div key={key}>{key}: {comp[key]}</div>)
	  }
	  return <div key={comp.uuid}>{thisComp}
	    <Button icon='close' floating accent mini onClick={
	      () =>{
		const idx = next[relation].indexOf(comp.uuid)
		console.log(idx, next[relation][idx])
		next[relation] = [
		  ...next[relation].slice(0, idx),
		  ...next[relation].slice(idx+1)]
		save()
	      }
	    }/>
	  </div>
	})

	return <div key={fieldName}>
	  <label>{relation}</label>
	  <List>{relListFields}</List>
	  <Button icon='add' onClick={() => {
	    next[`${relation}Selecting`] = true
	    save()
	  props.pushRoute(listRoute)
	}}
	  /></div>
      }
      return <div key={fieldName}>
	<Input value={next[fieldName] ||''}
      type={componentField.uiType} label={label} name='name' icon={componentField.icon}
      hint={componentField.hint}
      onChange={(e) => {
	next[fieldName] = e
	save()
      }}/>
	{error}
      </div>
    })
    return <div>
      <ListSubHeader caption={listCaption}/>
      {listFields}
      <Button icon='done' floating disabled={!next.isValid} accent mini onClick={(e)=>{
	store()
	goBack()
      }}/>
      <Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
      </div>
  }
  ComponentEdit.propTypes = propTypes
  ComponentEdit.propTypes[`${componentName}`] = PropTypes.object
  ComponentEdit.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes[`store${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes.goBack = PropTypes.func
  ComponentEdit.propTypes.pushRoute = PropTypes.func
  return ComponentEdit
}
