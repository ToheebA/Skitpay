export const optimizeImage = (url, width = 400) => {
    if (!url) return ''
    return url.replace('/upload/', `/upload/q_auto,f_auto,w_${width}/`)
}