
import { lookupProfile, UserSession, AppConfig } from "blockstack"

import { baseBlockstackApi, appScopes } from "@constants"
import { filer } from "./helpers"

const appConfig = new AppConfig(appScopes)
export const userSession = new UserSession({ appConfig })

export const getUser = async (account, apiBase = baseBlockstackApi + "names") => {
  try {
    let data = await lookupProfile(account.toLowerCase().trim(), apiBase)
    return data
  } catch (err) {
    console.log(err)
    return {}
  }
}

export const searchAccount = async (account, apiBase = baseBlockstackApi) => {
  try {
    let data = await fetch(`${apiBase}search?query=${account.toLowerCase().trim()}`)
    return data.json()
  } catch (err) {
    console.log(err)
    return []
  }
}

export const getUserBasic = async (account, apiBase = baseBlockstackApi) => {
  try {
    let data = await fetch(`${apiBase}users/${account.toLowerCase().trim()}`)
    return data.json()
  } catch (err) {
    console.log(err)
    return {}
  }
}

export const saveFile = async (name, data, options = { encrypt: true }) => {
  let noPrefix = options.noPrefix
  delete options.noPrefix

  try {
    data = data && typeof data.valueOf() === "string" ? data : JSON.stringify(data)
    return userSession.putFile(noPrefix ? name : filer(name), data, options)
  } catch (err) {
    console.log(err)
    return false
  }
}

export const getFile = async (name, options = { decrypt: true }) => {
  let noPrefix = options.noPrefix
  delete options.noPrefix

  try {
    return userSession.getFile(noPrefix ? name : filer(name), options)
  } catch (err) {
    console.log(err)
    return null
  }
}

export const deleteFile = async (name, options) => {
  let noPrefix = options.noPrefix
  delete options.noPrefix

  try {
    return userSession.deleteFile(noPrefix ? name : filer(name))
  } catch (err) {
    console.log(err)
    return null
  }
}

export const listAppFiles = async () => {
  try {
    return userSession.listFiles()
  } catch (err) {
    console.log(err)
    return null
  }
}
