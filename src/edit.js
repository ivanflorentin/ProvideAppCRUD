import React, {PropTypes} from 'react'
import {List, ListItem,ListSubHeader, Button, Input} from 'react-toolbox'
//import relationDisplayCreator from './relationDisplay'
// console.log('relationDisplay',relationDisplay)
// relationDisplay({component:{}, componentDef:{}})

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
//    console.log('props', props)
    let next = Object.assign({}, props[componentName])
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
	console.log(`selected ${relation}`, props[relation])
	const relationList = props[`${relation}List`]
	const relationComponentDef = props[`${relation}ComponentDef`]
	const relationProperName = relation.toUpperCase() + relation.substring(1)
	const routes = `${relation}Routes`
	const listRoute = props[routes][`${relation}List`]
	const relListFields = []
	//console.log(`relation ${relation} is `, next[relation])
	if (next[relation] === undefined) {
	  console.log(`relation ${relation} is undefined`)
	  next[relation] = []
	}
	console.log('is selecting?', next[`${relation}Selecting`])
	if (next[`${relation}Selecting`]) {
	  let found = false
	  next[relation].map((relItem, index) =>{
	    console.log('item in list:', relItem)
	    relationList.map((item)=>{
	      if (item.uuid === relItem) {
		console.log('already in list', relItem)
		found = true
	      }
	    })
	  })
	  if (!found) {
	    next[relation].push(props[relation].uuid)
	    save()
	  }
	  delete next[`${relation}Selecting`]
	}
	//ahora a crear los items para el render
	
	return <div key={fieldName}>
	  <label>{relation}</label>
	  <List>{relListFields}</List>
	  <Button icon='add' onClick={(e) => {
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
//create a separate parser
//     for (let fieldName of fieldNames) {
//       if (fields[fieldName].relation) {
// 	const relation = fields[fieldName].relation
// 	console.log('relation:', relation)
//       }
//       let label = fields[fieldName].label
//       if (!label || label === '') {
// 	  label = fieldName
// 	}
//       const componentField = compDef.fields[fieldName]
//       const fieldError = `${fieldName}Error`
//       let error = ''
//       if (next[fieldError]) {
// 	error = <span>{next[fieldError]}</span>
//       }
//       const field = <div key={fieldName}>
// 	    <Input value={next[fieldName] ||''}
//       type={componentField.uiType} label={label} name='name' icon={componentField.icon}
//       hint={componentField.hint}
//       onChange={(e) => {
// 	next[fieldName] = e
// 	save()
//       }}/>
// 	      {error}
//       </div>
// 	listFields.push(field)
//     }
//     return (
