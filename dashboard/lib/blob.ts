import { put, del, list } from '@vercel/blob'

export async function uploadImage(file: File, pathname: string) {
  try {
    const blob = await put(pathname, file, {
      access: 'private',
      addRandomSuffix: true,
    })
    return blob
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export async function deleteImage(url: string) {
  try {
    await del(url)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export async function listImages(pathname?: string) {
  try {
    const result = await list({
      prefix: pathname || '',
    })
    return result.blobs
  } catch (error) {
    console.error('Error listing images:', error)
    throw error
  }
}
