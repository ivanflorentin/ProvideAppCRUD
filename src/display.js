import React, {PropTypes} from 'react'
import {Button} from 'react-toolbox'
import {Card, CardTitle, CardText, CardActions} from 'react-toolbox/lib/card'

export default function (compDef) {
  const {componentName} = compDef

  const ComponentDisplay = (props) => {
    const {goBack, pushRoute, routing} = props
    const url = routing.locationBeforeTransitions.pathname
    const editURL = `${url.slice(0, url.lastIndexOf('/')+1)}edit`
    const component = props[`${componentName}`]
    let content = []
    let cardActions = <div>
		       <Button icon='add'
		       floating accent mini onClick={()=>{
			 pushRoute(editURL)}}/>
		       <Button icon='undo'
		       floating accent mini onClick={()=>{
			 goBack()}}/>
		       </div>
    if (component.index !== undefined) {
      for (let field of component) {
	if (component[field] && compDef[field]) {
	  content.push(<p>{compDef[field].label} : {component[field]}</p>)
	}
      }
    }

    return <Card>
      <CardTitle title={compDef.title}/>
      <CardText>{content}</CardText>
      <CardActions>{cardActions}</CardActions>
      </Card>
  }

  ComponentDisplay.propTypes = {}
  ComponentDisplay.propTypes[`${componentName}`] = PropTypes.object
  ComponentDisplay.propTypes.goBack = PropTypes.func
  ComponentDisplay.propTypes.pushRoute = PropTypes.func
  ComponentDisplay.propTypes.routing = PropTypes.object

  return ComponentDisplay
}
