import React, {PropTypes} from 'react'
import {List, ListItem, ListSubHeader, Button} from 'react-toolbox'

export default function (compDef) {
  const {componentName,
	 fields
	} = compDef

  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const fieldNames = Object.keys(fields)
  const ComponentEdit = (props) =>{
    let next = Object.assign({}, props[componentName])
    const url = props.routing.locationBeforeTransitions.pathname
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const {goBack} = props
    const listCaption = `Datos de ${componentProperName}`
    const listFields = []

    for (let fieldName of fieldNames) {
      const componentField = compDef.fields[fieldName]
      const field = <div key={fieldName}>
	    <ListItem caption={next[fieldName] ||''}
      legend={componentField.label} righticon={componentField.icon}/>
	</div>
	listFields.push(field)
    }

    return (
	<div>
	<List>
	<ListSubHeader caption={listCaption}/>
	{listFields}
      </List>
	<Button icon='edit' floating disabled={!next.isValid} accent mini onClick={(e)=>{
	  props.pushRoute(editURL)
	}}/>
	<Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
	</div>
    )
  }

  ComponentEdit.propTypes = {
    pushRoute: PropTypes.func,
    goBack: PropTypes.func,
    routing: PropTypes.object
  }
  ComponentEdit.propTypes[`${componentName}`] = PropTypes.object
  ComponentEdit.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes[`store${componentProperName}`] = PropTypes.func
  return ComponentEdit
}


