// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  // i18n---place
  if (!title || title.indexOf('${') !== 0 || title.indexOf('}') !== title.length - 1) {
    return title
  }
  const titleName = title.substring(2, title.length - 1)
  const hasKey = this.$te('route.' + titleName)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + titleName)

    return translatedTitle
  }
  return title
}
