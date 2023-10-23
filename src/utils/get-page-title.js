import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Read System'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
