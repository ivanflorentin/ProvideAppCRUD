import {Route} from 'react-router'
import React from 'react'

export default function (modelDef, models) {
  const mainPath = modelDef.modelName
  const modelProperName = modelDef.modelName[0].toUpperCase() +
	modelDef.modelName.substring(1)
  const edit = 'edit' + modelProperName
  const list = 'list' + modelProperName
  const display = 'display' + modelProperName
  return (
      <Route key={mainPath} path={mainPath}>
      <Route path='edit' component={models[edit]}/>
      <Route path='list' component={models[list]}/>
      <Route path='display' component={models[display]}/>
      </Route>
  )
}

