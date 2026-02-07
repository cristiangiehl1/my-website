import path from 'node:path'

export function generateImgUrl(fileName: string) {
  return path.join('/images', fileName)
}
