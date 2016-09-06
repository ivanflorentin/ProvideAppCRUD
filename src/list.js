import React, {PropTypes} from 'react'
import {List, ListItem, ListSubHeader, Button} from 'react-toolbox'

export default function (compDef) {
  const {componentName,
	 fields,
	 listName
	} = compDef
  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const ComponentList = (props) =>{
    const url = props.routing.locationBeforeTransitions.pathname
    const displayURL = `${url.slice(0, url.lastIndexOf('/')+1)}display`
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const list = props[`${componentName}List`]
    //console.log('list', list)
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
      return <ListItem key={index} legend={itemLegend} leftIcon={compDef.icon}
      rightActions={[
	  <Button key='edit' icon='edit' floating accent mini
	onClick={() =>{
	  props[`select${componentProperName}`](item)
	  props.pushRoute(editURL)
	}}
	  />,
	  <Button key='display' icon='description' floating accent mini
	  	onClick={() =>{
	  props[`select${componentProperName}`](item)
		  props.pushRoute(displayURL)
	}}/>,
          <Button key='select' icon='done' floating accent mini
	onClick={() =>{
	  props[`select${componentProperName}`](item)
	  props.goBack()
	}}/>,
          <Button key='delete' icon='close' floating accent mini
	onClick={() =>{
	  props[`delete${componentProperName}`](item)
	}}/>
      ]}
	/>
    })

    return <div>
      <List selectable ripple>
      <center><ListSubHeader caption={compDef.listTitle} /></center>
      {Items}
    </List>
      <Button icon='undo'
    floating accent mini onClick={()=>{
      props.goBack()
    }}/>

      <Button icon='add'
    floating accent mini onClick={()=>{
      props[`deselect${componentProperName}`]()
      props.pushRoute(editURL)
    }}/>
      </div>
  }
  ComponentList.propTypes = {
    pushRoute: PropTypes.func,
    goBack: PropTypes.func
  }
  ComponentList.propTypes[`${compDef.componentName}List`] = PropTypes.object
  ComponentList.propTypes[`deselect${componentProperName}`] = PropTypes.func
  ComponentList.propTypes[`select${componentProperName}`] = PropTypes.func
  ComponentList.propTypes[`delete${componentProperName}`] = PropTypes.func
  ComponentList.propTypes.routing = PropTypes.object
  return ComponentList
}
