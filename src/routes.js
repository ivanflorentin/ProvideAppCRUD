import {Route} from 'react-router'
import React from 'react'

export default function (compDef, components) {
  const mainPath = compDef.componentName
  const componentProperName = compDef.componentName[0].toUpperCase() +
	compDef.componentName.substring(1)
  const edit = 'edit' + componentProperName
  const list = 'list' + componentProperName
  const display = 'display' + componentProperName
  return (
      <Route key={mainPath} path={mainPath}>
      <Route path='edit' component={components[edit]}/>
      <Route path='list' component={components[list]}/>
      <Route path='display' component={components[display]}/>
      </Route>
  )
}

