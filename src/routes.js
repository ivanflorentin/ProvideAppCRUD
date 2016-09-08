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
      <Route path='edit' model={models[edit]}/>
      <Route path='list' model={models[list]}/>
      <Route path='display' model={models[display]}/>
      </Route>
  )
}

