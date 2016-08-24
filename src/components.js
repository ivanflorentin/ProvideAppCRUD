import editCreator from './edit'
import listCreator from './list'
import displayCreator from './display'
//import relationDisplayCreator from './relationDisplay'

export default function (compDef) {
  const componentProperName = compDef.componentName[0].toUpperCase() +
	compDef.componentName.substring(1)
  const components = {}
  components[`edit${componentProperName}`] = editCreator(compDef)
  components[`list${componentProperName}`] = listCreator(compDef)
  components[`display${componentProperName}`] = displayCreator(compDef)
//  components[`relationDisplay${componentProperName}`] = relationDisplayCreator(compDef)
  return components
}
