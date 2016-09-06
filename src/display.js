import React, {PropTypes} from 'react'
import {List, ListItem, ListSubHeader, Button} from 'react-toolbox'

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


  const ComponentDisplay = (props) =>{
    console.log('in display', props)
    let state = Object.assign({}, props[componentName])
    const url = props.routing.locationBeforeTransitions.pathname
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const {goBack} = props
    const listCaption = `Datos de ${componentProperName}`
    const listFields = []
    const relationFields = []

    for (let fieldName of fieldNames) {
      console.log('field', state[fieldName])
      const componentField = compDef.fields[fieldName]
      if (componentField.relation) {
	const relComponents = []
	const relation = componentField.relation
	const relationList = props[`${relation}List`]
	console.log('Props relationList', `${relation}List`, relationList)
	console.log(`relation, ${componentField.relation}`, state[fieldName])
 	if (state[fieldName]) {
	  const ids = Object.keys(state[fieldName])
  	  ids.map((id, index) => {
 	    console.log('rel id', relationList[id])
	    const relComp = []
	    const relCompKeys = Object.keys(relationList[id])
	    relCompKeys.map((name) =>{
	      relComp.push(<div>{name}: {relationList[id][name]}</div>)
	    })
 	    relComponents.push(relComp)
 	  })
	relationFields.push(<div key={componentField.relation}>
			    {componentField.relation}, {relComponents}</div>)
	}
      } else {
	const field = <div key={fieldName}>
	    <ListItem caption={state[fieldName] ||''}
	legend={componentField.label} righticon={componentField.icon}/>
	  </div>
	  listFields.push(field)
      }
    }
    return (
	<div>
	<List>
	<ListSubHeader caption={listCaption}/>
	{listFields}
	<div>Relaciones: {relationFields} </div>
      </List>
	<Button icon='edit' floating disabled={!state.isValid} accent mini onClick={(e)=>{
	  props.pushRoute(editURL)
	}}/>
	<Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
	</div>
    )
  }

  ComponentDisplay.propTypes = propTypes
  ComponentDisplay.propTypes.pushRoute = PropTypes.func
  ComponentDisplay.propTypes.goBack = PropTypes.func
  ComponentDisplay.propTypes.routing = PropTypes.object
  ComponentDisplay.propTypes[`${componentName}`] = PropTypes.object
  ComponentDisplay.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentDisplay.propTypes[`store${componentProperName}`] = PropTypes.func
  return ComponentDisplay
}


