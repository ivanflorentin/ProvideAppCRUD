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
    const list = props[listName]
    const Items = list.map((item, index) =>{
      let itemLegend = ''
      for (let field in fields) {
	if (item[field] && item[field] !== '') {
	  itemLegend = itemLegend + ` ${fields[field].label}: ${item[field]}`
	}
      }
      return <ListItem key={index} legend={itemLegend} leftIcon='receipt'
      onClick={() =>{
	props[`select${componentProperName}`](props[listName][index])
	props.pushRoute(editURL)
      }
	      }/>
    })

    return <div>
      <List selectable ripple>
      <center><ListSubHeader caption={compDef.listTitle} /></center>
      {Items}
    </List>
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
  ComponentList.propTypes[compDef.listName] = PropTypes.array
  ComponentList.propTypes[`deselect${componentProperName}`] = PropTypes.func
  ComponentList.propTypes[`select${componentProperName}`] = PropTypes.func
  ComponentList.propTypes.routing = PropTypes.object
  return ComponentList
}
