import React, {PropTypes} from 'react'
import {Router, Route} from 'react-router'

const createMainContainer = (MainRoute, apps, MainContainer) =>{
  const Container = (props) =>{
    for (let appName in apps) {
      const app = apps[appName]
      if (app.appDef) {
	for (let model of apps[appName].appDef.models) {
	  const modelName = model.modelName
	  const appPath = `/${apps[appName].appDef.appRoute}/`
	  const editName = `${modelName}Edit`
	  const listName = `${modelName}List`
	  const displayName = `${modelName}Display`
	  const editPath = `${appPath}${modelName}/edit`
	  const listPath = `${appPath}${modelName}/list`
	  const displayPath = `${appPath}${modelName}/display`
	  const modelProperName = modelName[0].toUpperCase() + modelName.substring(1)
	  const setRoute = `setRoute${modelProperName}`
	  const setTemplate = `setTemplate${modelProperName}`
	  const templates= apps[appName].components[modelName]
	  props[setRoute]({name: editName, path: editPath})
	  props[`setModelDef${modelProperName}`](model)
	  props[setRoute]({name: listName, path: listPath})
	  props[setRoute]({name: displayName, path: displayPath})
	  props[setTemplate]({name: editName,
			      template: templates[`edit${modelProperName}`]})
	  props[setTemplate]({name: displayName,
			      template: templates[`display${modelProperName}`]})
 	  props[setTemplate]({name: listName,
			      template: templates[`list${modelProperName}`]})
	}
      }
    }
    return <div>
      <Router>
      <Route path="/" model={MainContainer}>
      {MainRoute}
    </Route>
      </Router>
      </div>
  }
  Container.propTypes = {}

  for (let appName in apps) {
    const app = apps[appName]
    if (app.appDef) {
      const models = apps[appName].appDef.models
      for (let model of models) {
	const modelName = model.modelName
	const modelProperName = modelName[0].toUpperCase() + modelName.substring(1)
	const setRoute = `setRoute${modelProperName}`
	const setTemplate = `setTemplate${modelProperName}`
	Container.propTypes[`setModelDef${modelProperName}`] = PropTypes.func
	Container.propTypes[setRoute] = PropTypes.func
	Container.propTypes[setTemplate] = PropTypes.func
      }
    }
  }

  return Container
}

export {createMainContainer}
