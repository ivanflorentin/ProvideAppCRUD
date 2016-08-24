import React, {Component, PropTypes} from 'react'
import {Router, Route, browserHistory} from 'react-router'

const createMainContainer = (MainRoute, apps, MainContainer) =>{
  const Container = (props) =>{
    for (let appName in apps) {
      const app = apps[appName]
      if (app.appDef) {
	for (let component of apps[appName].appDef.components) {
	  const componentName = component.componentName
	  const appPath = `/${apps[appName].appDef.appRoute}/`
	  const editName = `${componentName}Edit`
	  const listName = `${componentName}List`
	  const displayName = `${componentName}Display`
	  const editPath = `${appPath}${componentName}/edit`
	  const listPath = `${appPath}${componentName}/list`
	  const displayPath = `${appPath}${componentName}/display`
	  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
	  const setRoute = `setRoute${componentProperName}`
	  const setTemplate = `setTemplate${componentProperName}`
	  const templates= apps[appName].components[componentName]
	  props[setRoute]({name: editName, path: editPath})
	  props[`setComponentDef${componentProperName}`](component)
	  props[setRoute]({name: listName, path: listPath})
	  props[setRoute]({name: displayName, path: displayPath})
	  props[setTemplate]({name: editName,
			      template: templates[`edit${componentProperName}`]})
	  props[setTemplate]({name: displayName,
			      template: templates[`display${componentProperName}`]})
 	  props[setTemplate]({name: listName,
			      template: templates[`list${componentProperName}`]})
	}
      }
    }
    return <div>
      <Router>
      <Route path="/" component={MainContainer}>
      {MainRoute}
    </Route>
      </Router>
      </div>
  }
  Container.propTypes = {}

  for (let appName in apps) {
    const app = apps[appName]
    if (app.appDef) {
      const components = apps[appName].appDef.components
      for (let component of components) {
	const componentName = component.componentName
	const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
	const setRoute = `setRoute${componentProperName}`
	const setTemplate = `setTemplate${componentProperName}`
	Container.propTypes[`setComponentDef${componentProperName}`] = PropTypes.func
	Container.propTypes[setRoute] = PropTypes.func
	Container.propTypes[setTemplate] = PropTypes.func
      }
    }
  }

  return Container
}

export {createMainContainer}
