import uuid from 'node-uuid'

export default function (compDef) {
  const {componentName,
       fields,
       listName,
       replication
	} = compDef

  const listProperName = listName[0].toUpperCase() + listName.substring(1)
  const componentListName = componentName + 'List'
  const listCapitalName = listName.toUpperCase()
  const componentProperName = componentName[0].toUpperCase() + componentName.substring(1)
  const componentCapitalName = componentName.toUpperCase()
  const routesName = componentName + 'Routes'
  const templatesName = componentName + 'Templates'
  const componentDefinitionName = componentName + 'ComponentDef'

  const crudInit = {}
  const crudErrorInit = {}
  let fieldNames = Object.keys(fields)
  if (fieldNames.length > 0) {
    for (let fieldName of fieldNames) {
      crudInit[fieldName] = fields[fieldName].defaultValue
      crudErrorInit[`${fieldName}Error`] = ''
    }}

  const SELECT = `SELECT_${componentCapitalName}`
  const DESELECT = `DESELECT_${componentCapitalName}`
  const SAVE = `SAVE_${componentCapitalName}`
  const LOAD = `LOAD_${listCapitalName}`
  const STORE = `STORE_${componentCapitalName}`
  const DELETE = `DELETE_${componentCapitalName}`
  const SET_ROUTE = `SET_ROUTE_${componentCapitalName}`
  const DELETE_ROUTE = `DELETE_ROUTE_${componentCapitalName}`
  const SET_TEMPLATE = `SET_TEMPLATE_${componentCapitalName}`
  const DELETE_TEMPLATE = `DELETE_TEMPLATE_${componentCapitalName}`
  const SET_COMPONENT_DEF = `SET_COMPOENET_DEF_${componentCapitalName}`

  const actions = {}
  const reducers = {}

  actions[`select${componentProperName}`] = (component) =>{
    return {type: SELECT, component}
  }
  actions[`deselect${componentProperName}`] = () =>{
    return {type: DESELECT}
  }
  actions[`save${componentProperName}`] = (component) =>{
    return {type: SAVE, component}
  }
  actions[`load${listProperName}`] = (list) =>{
    return {type: LOAD, list}
  }
  actions[`store${componentProperName}`] = (component) =>{
    return {type: STORE, component}
  }
  actions[`delete${componentProperName}`] = (component) =>{
    return {type: DELETE, component}
  }
  actions[`setRoute${componentProperName}`] = (routeDef) =>{
    return {type: SET_ROUTE, ...routeDef}
  }
  actions[`deleteRoute${componentProperName}`] = (routeDef) =>{
    return {type: DELETE_ROUTE, ...routeDef}
  }
  actions[`setTemplate${componentProperName}`] = (templateDef) =>{
    return {type: SET_TEMPLATE, ...templateDef}
  }
  actions[`deleteTemplate${componentProperName}`] = (templateDef) =>{
    return {type: DELETE_TEMPLATE, ...templateDef}
  }
  actions[`setComponentDef${componentProperName}`] = (componentDef) =>{
    return {type: SET_COMPONENT_DEF, componentDef}
  }

  reducers[componentDefinitionName] = (state = {}, action) =>{
    switch (action.type) {
    case SET_COMPONENT_DEF: {
      return action.componentDef
    }
    default: return state
    }
  }

  reducers[routesName] = (state = {}, action) =>{
    switch (action.type) {
    case SET_ROUTE: {
      const {name, path} = action
      let route = {}
      route[name] = path
      return Object.assign({}, state, route)
    }
    case DELETE_ROUTE: {
      const {name} = action
      const next = Object.assign({}, state)
      delete next[name]
      return next
    }
    default : return state
    }
  }

  reducers[templatesName] = (state = {}, action) =>{
    switch (action.type) {
    case SET_TEMPLATE: {
      const {name, template} = action
      let temp = {}
      temp[name] = template
      return Object.assign({}, state, temp)
    }
    case DELETE_TEMPLATE: {
      const {name} = action
      const next = Object.assign({}, state)
      delete next[name]
      return next
    }
    default : return state
    }
  }

  reducers[componentName] = (state = {isValid: false}, action) =>{
    switch (action.type) {
    case SELECT: {
      return action.component
    }
    case DESELECT: {
      return {}
    }
    case SAVE: {
      const next = Object.assign({}, action.component)
      next.isValid = true
      for (let fieldName of fieldNames) {
	const value = String(action.component[fieldName])
	const validators = fields[fieldName].validate
	if (validators && validators.length > 0) {
	  let validatorPassed = true
	  for (let validator of validators) {
	    const valid = validator.func(value, validator.params)
	    if (!valid) {
	      next.isValid = false
	      next[`${fieldName}Error`] = validator.message
	    }
	    else {delete next[`${fieldName}Error`]}
	  }
	}
      }
      return next
    }
    default: return state
    }
  }

  reducers[componentListName] = (state = [], action) =>{
    switch (action.type) {
    case LOAD: {
      return action.list
    }
    case STORE: {
      if (action.component.uuid === undefined) {
	return [
	  ...state,
	  Object.assign({}, action.component, {uuid: uuid.v4()})
	]
      }
      const next = state.map((component)=>{
	if (component.id === action.component.uuid) {
	  return action.component
	}
	return component
      })
      return next
    }
    case DELETE: {
      let next = []
      state.map((component) =>{
	if (component.uuid !== action.component.uuid) {
	  next.push(component)
	}
      })
      return next
    }
    default: {
      return state
    }
    }
  }

  const provider = {
    actions,
    reducers,
    replication
  }
  return provider
}
