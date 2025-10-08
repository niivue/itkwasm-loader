import { Niivue } from '@niivue/niivue'
import { useItkWasmLoaders, useAllItkWasmLoaders } from './lib/loader.js'

export async function setupNiivue(element: HTMLCanvasElement) {
  const nv = new Niivue()
  await nv.attachToCanvas(element)

  // useItkWasmLoaders(nv)
  useAllItkWasmLoaders(nv)

  // await nv.loadImages([
  //   {
  //     url: '/LIDC2.mha'
  //   }
  // ])

  // await nv.loadMeshes([
  //   {
  //     url: '/cow.vtk'
  //   }
  // ])

  // await nv.loadMeshes([
  //   {
  //     url: '/rac.vtk'
  //   }
  // ])
}
