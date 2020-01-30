
import { algorithmWeigth, socialWeigth, constantWeigths } from "@constants"

import { initialsAvatar } from "./helpers"

export const build = (data) => {
  return data.map(schema)
}

export const schema = (data) => {
  if (!data.fullyQualifiedName) data.fullyQualifiedName = data.username

  let profile = data.profile
  let account = profile.account || []

  profile.address = profile.address || {}
  profile.image = profile.image || []

  let avatar = profile.image.find((img) => img.name === "avatar") || {}
  let cover = profile.image.find((img) => img.name === "cover") || {}

  let facebook = account.find((acc) => acc.service === "facebook") || {}
  let twitter = account.find((acc) => acc.service === "twitter") || {}
  let linkedin = account.find((acc) => acc.service === "linkedin") || {}
  let github = account.find((acc) => acc.service === "github") || {}
  let steem = account.find((acc) => acc.service === "steem") || {}

  let bitcoin = account.find((acc) => acc.service === "bitcoin") || {}
  let ethereum = account.find((acc) => acc.service === "ethereum") || {}

  let website = (data.website || []).find((site) => site["@WebSite"] === "Website") || {}

  return {
    profile: {
      name: (profile.name || "").substr(0, 30),
      description: (profile.description || "").substr(0, 100),
      avatar: avatar.contentUrl,
      cover: cover.contentUrl,
      location: profile.address.addressLocality,
      initialsAvatar: avatar.contentUrl ? {} : initialsAvatar(profile.name || data.fullyQualifiedName),
      website: website.url
    },
    social: {
      facebook: facebook.identifier ? `https://fb.com/${facebook.identifier}` : null,
      twitter: twitter.identifier ? `https://twitter.com/${twitter.identifier}` : null,
      linkedin: linkedin.identifier ? `https://linkedin.com/in/${linkedin.identifier}` : null,
      steem: steem.identifier ? `https://steem.online/@${steem.identifier}` : null,
      github: github.identifier ? `https://github.com/${github.identifier}` : null
    },
    detail: {
      type: profile["@type"],
      identifier: data.fullyQualifiedName.split(".")[0],
      domain: data.fullyQualifiedName.substring(data.fullyQualifiedName.indexOf(".") + 1),
      username: data.username,
      id: data.fullyQualifiedName,
      gaia: data.profile && data.profile.api ? new URL(data.profile.api.gaiaHubUrl).hostname : "",
      bitcoin: bitcoin.identifier,
      ethereum: ethereum.identifier
    },
    apps: profile.apps,
    api: profile.api
  }
}
