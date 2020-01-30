
import { maxLogs } from "@constants"

const insertActivity = (activities, newAct) => {
  activities.unshift(newAct)
  return activities.length < maxLogs ? activities : activities.slice(0, maxLogs)
}
