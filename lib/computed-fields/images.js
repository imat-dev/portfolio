import fs from 'fs'
import { join } from 'path'
import { imageSize } from 'image-size'

const resolve = (image, { mdxOptions }) => {
  const test = image && /^\/.*[/.](gif|jpg|jpeg|png)$/i.test(image.src)
  if (!test) return

  const filePath = join(process.cwd(), mdxOptions.publicDir, image.src)
  if (!fs.existsSync(filePath)) return null

  try {
    const { width, height } = imageSize(fs.readFileSync(filePath))
    image.width = width
    image.height = height
  } catch (err) {
    console.error(err)
  }

  return image
}

// Single entry
export const image = {
  hasSubFields: false,
  resolve,
}

// Multiple entries
export const images = {
  hasSubFields: false,
  // Drop entries whose file is missing so layouts never read `null.src`
  resolve: (images, { mdxOptions }) =>
    images.map((image) => resolve(image, { mdxOptions })).filter(Boolean),
}
