# itkwasm-loader

The itkwasm-loader is a [NiiVue] plugin that converts [ITK-Wasm image IO-supported volumes](https://wasm.itk.org/docs/image-file-formats-url-todo) into NIfTI volumes and [ITK-Wasm mesh IO-supported meshes](https://wasm.itk.org/docs/mesh-file-formats-url-todo) into MZ3 meshes. It uses the [@itkwasm/image-io](https://www.npmjs.com/package/@itkwasm/image-io) and [@itkwasm/mesh-io](https://www.npmjs.com/package/@itkwasm/image-io) libraries.

![Example image todo](monument.jpg)

![Example mesh todo](monument.jpg)

## Usage

```javascript
import { Niivue } from '@niivue/niivue'
import { useItkWasmLoaders } from '@niivue/itkwasm-loader'

const nv = new Niivue()
await nv.attachToCanvas(document.getElementById('niivue-canvas'))

useItkWasmLoaders(nv)
```

This will add support for volume and mesh file formats not fully supported by default in NiiVue. To add support for all ITK-Wasm supported formats, call `useAllItkWasmLoaders` instead of `useItkWasmLoaders`.

See also the [NiiVue loader documentation](https://link-todo).

## Local Browser Development

You can embed this loader into a hot-reloadable NiiVue web page to evaluate integration:

```
git clone git@github.com:niivue/itkwasm-loader.git
cd itkwasm-loader
npm install
npm run dev
```

## Alternative libraries

See also the [built-in NiiVue format support](https://link-todo), [NiiVue ITK-Wasm cbor-loader](https://link-todo), which support ITK-Wasm's native CBOR format, [other NiiVue loaders](https://link-todo), and the [NiiVue plugin documentation](https://link-todo).