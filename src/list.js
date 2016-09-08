import React, {PropTypes} from 'react'
import {List, ListItem, ListSubHeader, Button} from 'react-toolbox'

export default function (modelDef) {
  const {modelName, fields} = modelDef
  const modelProperName = modelName[0].toUpperCase() + modelName.substring(1)
  const ModelList = (props) =>{
    const url = props.routing.locationBeforeTransitions.pathname
    const displayURL = `${url.slice(0, url.lastIndexOf('/')+1)}display`
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const list = props[`${modelName}List`]
    const ids = Object.keys(list)
    const Items = ids.map((id, index) =>{
      const item = list[id]
      let itemLegend = ''
      for (let field in fields) {
	let label = fields[field].label
	if (!label || label === '') {
	  label = field
	}
	if (item[field] && item[field] !== '') {
	  itemLegend = itemLegend + ` ${label}: ${item[field]}`
	}
      }
      return <ListItem key={index} legend={itemLegend} leftIcon={modelDef.icon}
      rightActions={[
	  <Button key='edit' icon='edit' floating accent mini
	onClick={() =>{
	  props[`select${modelProperName}`](item)
	  props.pushRoute(editURL)
	}}
	  />,
	  <Button key='display' icon='description' floating accent mini
	  	onClick={() =>{
	  props[`select${modelProperName}`](item)
		  props.pushRoute(displayURL)
	}}/>,
          <Button key='select' icon='done' floating accent mini
	onClick={() =>{
	  props[`select${modelProperName}`](item)
	  props.goBack()
	}}/>,
          <Button key='delete' icon='close' floating accent mini
	onClick={() =>{
	  props[`delete${modelProperName}`](item)
	}}/>
      ]}
	/>
    })

    return <div>
      <List selectable ripple>
      <center><ListSubHeader caption={modelDef.listTitle} /></center>
      {Items}
    </List>
      <Button icon='undo'
    floating accent mini onClick={()=>{
      props.goBack()
    }}/>

      <Button icon='add'
    floating accent mini onClick={()=>{
      props[`deselect${modelProperName}`]()
      props.pushRoute(editURL)
    }}/>
      </div>
  }
  ModelList.propTypes = {
    pushRoute: PropTypes.func,
    goBack: PropTypes.func
  }
  ModelList.propTypes[`${modelDef.modelName}List`] = PropTypes.object
  ModelList.propTypes[`deselect${modelProperName}`] = PropTypes.func
  ModelList.propTypes[`select${modelProperName}`] = PropTypes.func
  ModelList.propTypes[`delete${modelProperName}`] = PropTypes.func
  ModelList.propTypes.routing = PropTypes.object
  return ModelList
}
