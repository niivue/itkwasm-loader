import { readImage } from '@itk-wasm/image-io'
import { readMesh } from '@itk-wasm/mesh-io'
import { type BinaryFile } from 'itk-wasm'
// @ts-ignore - No type definitions available
import { iwm2meshCore, iwi2niiCore } from '@niivue/cbor-loader'

/**
 * Niivue interface for type safety
 */
interface Niivue {
  useLoader(loader: unknown, fileExt: string, toExt: string): void
}

/**
 * Image loader result interface
 */
interface ImageLoaderResult {
  arrayBuffer?: ArrayBuffer
}

/**
 * Mesh loader result interface
 */
interface MeshLoaderResult {
  positions: Float32Array
  indices: Uint32Array
}

/**
 * Supported image file extensions that ITK-Wasm can read but aren't fully supported by NiiVue
 */
export const imageExtensions = [
  'bmp',
  'gipl',
  'gipl.gz',
  'hdf5',
  'lsm',
  'mnc',
  'mnc.gz',
  'mnc2',
  'mgh',
  'mgz',
  'mgh.gz',
  'mha',
  'mhd',
  'mrc',
  'nia',
  'hdr',
  'pic',
  'tif',
  'tiff',
  'isq',
  'aim',
  'fdf'
]

/**
 * All ITK-Wasm supported image extensions
 */
export const allImageExtensions = [
  ...imageExtensions,
  'dcm',
  'jpg',
  'jpeg',
  'nii',
  'nii.gz',
  'nrrd',
  'nhdr',
  'png',
  'vtk'
]

/**
 * Supported mesh file extensions that ITK-Wasm can read but aren't fully supported by NiiVue
 */
export const meshExtensions = ['byu', 'swc', 'vtk']

/**
 * All ITK-Wasm supported mesh extensions
 */
export const allMeshExtensions = [...meshExtensions, 'fsa', 'fsb', 'obj', 'off', 'stl']

/**
 * Helper function to get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.toLowerCase().split('.')

  // Handle compound extensions like .nii.gz, .iwi.cbor
  if (parts.length >= 3) {
    const compound = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
    // Check if it's a known compound extension
    if (
      ['nii.gz', 'gipl.gz', 'mnc.gz', 'mgh.gz', 'iwi.cbor', 'iwm.cbor', 'iwi.cbor.zst', 'iwm.cbor.zst'].includes(
        compound
      )
    ) {
      return compound
    }
  }

  return parts[parts.length - 1]
}

/**
 * Helper function to convert File to ArrayBuffer
 */
async function fileToArrayBuffer(file: File | ArrayBuffer): Promise<ArrayBuffer> {
  if (file instanceof ArrayBuffer) {
    return file
  }
  return await file.arrayBuffer()
}

/**
 * Image loader function that converts ITK-Wasm supported formats to NIfTI
 */
async function itkImageLoader(file: File | ArrayBuffer, ext: string): Promise<ArrayBuffer> {
  const arrayBuffer = await fileToArrayBuffer(file)

  // Create a BinaryFile-like object for ITK-Wasm
  const binaryFile = {
    data: new Uint8Array(arrayBuffer),
    path: `input.${ext}`
  }

  // Read the image using ITK-Wasm
  const { image } = await readImage(binaryFile as BinaryFile)

  return iwi2niiCore(image)
}

/**
 * Mesh loader function that converts ITK-Wasm supported formats to MZ3-compatible format
 */
async function itkMeshLoader(file: File | ArrayBuffer, ext: string): Promise<MeshLoaderResult> {
  const arrayBuffer = await fileToArrayBuffer(file)

  // Create a BinaryFile-like object for ITK-Wasm
  const binaryFile = {
    data: new Uint8Array(arrayBuffer),
    path: `input.${ext}`
  }

  // Read the mesh using ITK-Wasm
  const { mesh } = await readMesh(binaryFile as any)

  // Convert to MZ3-compatible format using ITK-Wasm
  const { positions, indices } = iwm2meshCore(mesh)

  return { positions, indices }
}

/**
 * Register image loaders for formats not fully supported by NiiVue
 * @param nv - NiiVue instance
 */
export function useItkWasmLoaders(nv: Niivue): void {
  // Register image loaders
  for (const ext of imageExtensions) {
    nv.useLoader(createImageLoader(ext), ext, 'nii')
  }

  // Register mesh loaders
  for (const ext of meshExtensions) {
    nv.useLoader(createMeshLoader(ext), ext, 'mz3')
  }
}

/**
 * Register loaders for all ITK-Wasm supported formats
 * This will override some NiiVue built-in loaders with ITK-Wasm versions
 * @param nv - NiiVue instance
 */
export function useAllItkWasmLoaders(nv: Niivue): void {
  // Register all image loaders
  for (const ext of allImageExtensions) {
    nv.useLoader(createImageLoader(ext), ext, 'nii')
  }

  // Register all mesh loaders
  for (const ext of allMeshExtensions) {
    nv.useLoader(createMeshLoader(ext), ext, 'mz3')
  }
}

/**
 * Create a custom image loader for a specific format
 * @param extension - File extension to handle
 * @returns Loader function
 */
export function createImageLoader(extension: string) {
  return async (file: File | ArrayBuffer): Promise<ArrayBuffer> => {
    return await itkImageLoader(file, extension)
  }
}

/**
 * Create a custom mesh loader for a specific format
 * @param extension - File extension to handle
 * @returns Loader function
 */
export function createMeshLoader(extension: string) {
  return async (file: File | ArrayBuffer): Promise<MeshLoaderResult> => {
    return await itkMeshLoader(file, extension)
  }
}
