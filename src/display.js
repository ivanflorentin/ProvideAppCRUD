import React, {PropTypes} from 'react'
import {List, ListItem, ListSubHeader, Button} from 'react-toolbox'

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


  const ModelDisplay = (props) =>{
    let state = Object.assign({}, props[modelName])
    const url = props.routing.locationBeforeTransitions.pathname
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const {goBack} = props
    const listCaption = `Datos de ${modelProperName}`
    const listFields = []
    const relationFields = []

    for (let fieldName of fieldNames) {
      const modelField = modelDef.fields[fieldName]
      if (modelField.relation) {
	const relModels = []
	const relation = modelField.relation
	const relationList = props[`${relation}List`]
 	if (state[fieldName]) {
	  const ids = Object.keys(state[fieldName])
  	  ids.map((id) => {
	    const relComp = []
	    const relCompKeys = Object.keys(relationList[id])
	    relCompKeys.map((name) =>{
	      relComp.push(<div>{name}: {relationList[id][name]}</div>)
	    })
 	    relModels.push(relComp)
 	  })
	relationFields.push(<div key={modelField.relation}>
			    {modelField.relation}, {relModels}</div>)
	}
      } else {
	const field = <div key={fieldName}>
	    <ListItem caption={state[fieldName] ||''}
	legend={modelField.label} righticon={modelField.icon}/>
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
	<Button icon='edit' floating disabled={!state.isValid} accent mini onClick={()=>{
	  props.pushRoute(editURL)
	}}/>
	<Button icon='undo' floating accent mini onClick={()=>{goBack()}}/>
	</div>
    )
  }

  ModelDisplay.propTypes = propTypes
  ModelDisplay.propTypes.pushRoute = PropTypes.func
  ModelDisplay.propTypes.goBack = PropTypes.func
  ModelDisplay.propTypes.routing = PropTypes.object
  ModelDisplay.propTypes[`${modelName}`] = PropTypes.object
  ModelDisplay.propTypes[`save${modelProperName}`] = PropTypes.func
  ModelDisplay.propTypes[`store${modelProperName}`] = PropTypes.func
  return ModelDisplay
}


