import React, {PropTypes} from 'react'
import {ListSubHeader, Button, Input} from 'react-toolbox'

export default function (compDef) {
  const {componentName,
	 fields
	} = compDef

  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const fieldNames = Object.keys(fields)
  const ComponentEdit = (props) =>{
    let next = Object.assign({}, props[componentName])
    const save = () =>{props[`save${componentProperName}`](next)}
    const store = () =>{props[`store${componentProperName}`](next)}
    const {goBack} = props
    const listCaption = `Ingrese datos de ${componentProperName}`
    const listFields = []

    for (let fieldName of fieldNames) {
      const componentField = compDef.fields[fieldName]
      const fieldError = `${fieldName}Error`
      let error = ''
      if (next[fieldError]) {
	error = <span>{next[fieldError]}</span>
      }
      const field = <div key={fieldName}>
	    <Input  value={next[fieldName] ||''}
      type={componentField.uiType} label={componentField.label} name='name' icon={componentField.icon}
      hint={componentField.hint}
      onChange={(e) => {
	next[fieldName] = e
	save()
      }}/>
	      {error}
	</div>
	listFields.push(field)
    }

    return (
	<div>
	<ListSubHeader caption={listCaption}/>
	{listFields}
	<Button icon='done' floating disabled={!next.isValid} accent mini onClick={(e)=>{
	  store()
	  goBack()
	}}/>
	<Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
	</div>
    )
  }
  ComponentEdit.propTypes = {}
  ComponentEdit.propTypes[`${componentName}`] = PropTypes.object
  ComponentEdit.propTypes[`save${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes[`store${componentProperName}`] = PropTypes.func
  ComponentEdit.propTypes.goBack = PropTypes.func
  return ComponentEdit
}
