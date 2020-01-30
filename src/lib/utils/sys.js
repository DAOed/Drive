
import { maxLogs } from "@constants"

export const insertActivity = (activities, newAct) => {
  activities.unshift(newAct)
  return activities.length < maxLogs ? activities : activities.slice(0, maxLogs)
}
