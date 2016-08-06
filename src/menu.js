import React, {PropTypes} from 'react'
import Button from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'

export default function (appDef) {
  const {appRoute,
	 appTitle
	} = appDef
  const AppMenu = (props) =>{
    const {pushRoute} = props
    const buttons = appDef.components.map((component, index) =>{
      const {componentName} = component
      const componentProperName = componentName[0].toUpperCase() +
	    componentName.substring(1)
      return <Button key={`${componentProperName}${index}`}
    label={componentProperName} primary onClick={() =>{
      pushRoute(`/${appRoute}/${component.componentName}/list`)
    }}/>
    })

    return (
	<div>
	<center><h4>{appTitle}</h4></center>
	<Navigation type='horizontal'>
	{buttons}
      </Navigation>
	{props.children}
      </div>
    )
    }

  AppMenu.propTypes = {}
  AppMenu.propTypes.children = PropTypes.object
  AppMenu.propTypes.pushRoute = PropTypes.func
  AppMenu.propTypes.goBack = PropTypes.func

  return AppMenu
}
