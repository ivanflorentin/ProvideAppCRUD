import editCreator from './edit'
import listCreator from './list'
import displayCreator from './display'
//import relationDisplayCreator from './relationDisplay'

export default function (compDef) {
  const modelProperName = compDef.modelName[0].toUpperCase() +
	compDef.modelName.substring(1)
  const models = {}
  models[`edit${modelProperName}`] = editCreator(compDef)
  models[`list${modelProperName}`] = listCreator(compDef)
  models[`display${modelProperName}`] = displayCreator(compDef)
//  models[`relationDisplay${modelProperName}`] = relationDisplayCreator(compDef)
  return models
}
