import {Route} from 'react-router'
import React from 'react'
import componentCreator from './components'
import provideModel from 'provideModel'
import routeCreator from './routes'
import menuCreator from './menu'

export {createMainContainer} from './createMainContainer'

export default function (appDef) {
  const components = {}
  const providers = {}
  const componentRoutes = []
  appDef.models.map((modelDef) =>{
    components[modelDef.modelName] = componentCreator(modelDef)
    providers[modelDef.modelName] = provideModel(modelDef)
    componentRoutes.push(routeCreator(modelDef, components[modelDef.modelName]))
  })
  const menu = menuCreator(appDef)
  const MainRoute =
	<Route path={appDef.appRoute} component={menu}>
	{componentRoutes}
  </Route>

  const app = {
    appDef,
    appName: appDef.appName,
    components,
    providers,
    routes: MainRoute}
  return app
}
