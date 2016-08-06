import {Route} from 'react-router'
import React from 'react'
import componentCreator from './components'
import provideComponentCrud from './providers'
import routeCreator from './routes'
import menuCreator from './menu'

export default function (appDef) {
  const components = {}
  const providers = {}
  const componentRoutes = []
  appDef.components.map((compDef) =>{
    components[compDef.componentName] = componentCreator(compDef)
    providers[compDef.componentName] = provideComponentCrud(compDef)
    componentRoutes.push(routeCreator(compDef, components[compDef.componentName]))
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
