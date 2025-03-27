<p align="center" width="100%">
    <img width="80%" alt="vue-connector" src="https://i.imgur.com/bG9D9dL.png">
</p>

## ⭐️ Description

<b style="color:#38ab79">Vue Connector</b> library enables the creation of interactive flow diagrams, IVR schematics, and visual trees and graphs. Thanks to its intuitive drag-and-drop interface, developers can easily design and modify complex business processes, IVR logic, or relationships between application elements. A rich set of built-in components simplifies configuration and customization of views to meet specific needs, while the flexible architecture allows for seamless integration with the existing Vue ecosystem.

![top-language](https://img.shields.io/github/languages/top/voil/vue-connector)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/voil/vue-connector)
![GitHub last commit](https://img.shields.io/github/last-commit/voil/vue-connector)

## 🛠 Setup

To install the package and start using it, you need to download it from the package manager and install it using one of the commands.

```bash
$ bun i @webonweb/vue-connector

# or
$ pnpm i @webonweb/vue-connector

# or
$ yarn add @webonweb/vue-connector

# or
$ npm i @webonweb/vue-connector
```

## 🧪 Example

<br/>
<p align="center" width="100%" >
     <img width="100%" alt="vue-connector" src="https://i.imgur.com/vkMZ7A9.png">
</p>

## 🎮 Quickstart

```vue
<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    CONNECTION_TYPE,
    NODE_GROUP_TYPE,
    POSITION_TYPES,
    SchemeGraph,
    type NodeType,
    type SchemeGraphType,
  } from '@webonweb/vue-connector';

  import '@webonweb/vue-connector/style.css';

  const scheme = ref<SchemeGraphType>({
    scale: 50,
    nodes: {},
  });

  const elements = ref<NodeType[]>([
    {
      unique: '760778cc-a362-41cf-87d3-f8fae69a5348',
      label: 'Main',
      type: NODE_GROUP_TYPE.group,
      childrens: [
        {
          unique: '32de9eee-7b08-4127-b190-76023ca30b80',
          label: 'Example 1',
          type: NODE_GROUP_TYPE.node,
          count: 2,
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae enim sapien. Vivamus pulvinar fermentum sapien, non mattis risus commodo vel.',
        },
        {
          unique: '1614ce34-f01c-4602-bd62-e31d9778cb00',
          label: 'Example 2',
          type: NODE_GROUP_TYPE.node,
          color: '#d44fd5',
          icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 9.5C13.3807 9.5 14.5 10.6193 14.5 12C14.5 13.3807 13.3807 14.5 12 14.5C10.6193 14.5 9.5 13.3807 9.5 12C9.5 10.6193 10.6193 9.5 12 9.5Z" fill="#000000"/> </svg>',
          connections: [POSITION_TYPES.left, POSITION_TYPES.right],
          connectionType: CONNECTION_TYPE.boolean,
        },
      ],
    },
  ]);
</script>
<template>
  <div style="position: relative; width: 1000px; height: 1000px">
    <SchemeGraph
      v-model:scheme="scheme"
      :elements
    >
      <template
        v-for="element in Object.keys(scheme.nodes)"
        v-slot:[`node-${element}`]="{ node }"
      >
        {{ node }}
      </template>
    </SchemeGraph>
  </div>
</template>
```

## ⚠️ Vue 2

The library does not work with previous versions of Vue. It uses the latest Vue 3 standards and is based on the Composition API.
