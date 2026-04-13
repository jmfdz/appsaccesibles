const normalizedBaseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

function buildRoute(segment = '') {
  if (!normalizedBaseUrl) {
    return segment ? `/${segment}` : '/'
  }

  return segment ? `${normalizedBaseUrl}/${segment}` : normalizedBaseUrl
}

export const appRoutes = {
  inicio: buildRoute(),
  editorCientifico: buildRoute('editor-cientifico'),
  textoBraille: buildRoute('texto-braille'),
}
