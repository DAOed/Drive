import { appPrefixer, maxFileSize } from "@constants"
import uuidv1 from "uuid/v1"

export const uuid = uuidv1

export const removeBaseFileName = path => path.indexOf("FILES/") === 0 ? path.substring(6) : path

export const filer = name => (name.split("/")[0] + "/" === appPrefixer) ? name : `${appPrefixer}${name}`

const defaultColors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"]

export const initialsAvatar = (name, colors = defaultColors) => {
  name = name.replace(/\s+/g, " ").trim()

  let nameSplit = name.split(" ")
  let initials

  if (nameSplit.length >= 2) {
    initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0)
  } else {
    name = name.split(".")[0]
    initials = name.charAt(0) + name.charAt(name.length - 1)
  }

  initials = initials.toUpperCase()

  const charCodes = initials
    .split("")
    .map(char => char.charCodeAt(0))
    .join("")

  let color = colors[parseInt(charCodes, 10) % colors.length]

  return {
    content: initials,
    style: {
      backgroundColor: color,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "30px"
    }
  }
}

export const sortModified = (mode, items) => {
  return mode
    ? items.sort((a, b) => new Date(a.modified) - new Date(b.modified))
    : items.sort((a, b) => new Date(b.modified) - new Date(a.modified))
}

export const validUploadSize = (files) => {
  let valid = true
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > maxFileSize) valid = false
  }
  return valid
}
