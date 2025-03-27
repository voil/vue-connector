<template>
  <div
    class="absolute h-full w-full overflow-hidden bg-white bg-opacity-100 bg-[url('@/assets/images/background.png')] bg-center bg-repeat dark:bg-slate-800"
    ref="schemeContainer"
  >
    <ThemeScheme />
    <ActionsButtons
      v-if="actions.length > 0"
      :actions
      @on:save="(type: ActionsType) => emit('on:save', type)"
    />
    <LockScheme v-if="isLockActive" />
    <SchemeHistory v-if="isHistoryActive" />
    <ZoomGraph v-if="isScaleActive" />
    <ContainerGraph :multi-select="isMultiSelectActive">
      <template
        v-for="node in Object.keys(schemeModel.nodes)"
        :key="`node-${node}`"
      >
        <NodeGraph
          v-if="!schemeModel.nodes[node].dummy"
          v-model:node="schemeModel.nodes[node]"
          :id="node"
        >
          <slot
            :name="`node-${node}`"
            :node="schemeModel.nodes[node]"
          />
        </NodeGraph>
      </template>
      <SvgContainer>
        <template
          v-for="node in Object.keys(schemeModel.nodes)"
          :id="`path-template-${node}`"
        >
          <template
            v-for="path in schemeModel.nodes[node].paths
              ? Object.keys(schemeModel.nodes[node].paths)
              : []"
            :key="`path-template-${node}-${path}`"
          >
            <NodePath
              v-if="
                schemeModel.nodes[node].paths &&
                schemeModel.nodes[node].paths[path]?.side === SIDE_TYPE.start
              "
              v-model:end="
                schemeModel.nodes[
                  schemeModel.nodes[node].paths[path].connected.node
                ].paths[schemeModel.nodes[node].paths[path].connected.path]
                  .position
              "
              :is-dummy="schemeModel.nodes[node].paths[path].dummy"
              :start="schemeModel.nodes[node].paths[path].position"
              :type-path="schemeModel.nodes[node].connectionType"
              :uid="path"
              :value="schemeModel.nodes[node].paths[path].value"
            />
          </template>
        </template>
      </SvgContainer>
    </ContainerGraph>
    <NodeMenuGraph v-if="!getStateLockScheme()">
      <template
        v-for="element in elements"
        :key="element.label"
      >
        <NodeMenuGroupGraph v-if="element.type === NODE_GROUP_TYPE.group">
          {{ element.label }}
        </NodeMenuGroupGraph>
        <div
          class="grid grid-cols-2 gap-x-2 gap-y-4"
          v-if="element.childrens"
        >
          <NodeMenuChildrenGraph
            v-for="children in element.childrens"
            :disabled="
              children.count
                ? children.count <=
                  Object.values(schemeModel.nodes).filter(
                    (item: NodeGraphType) => item.unique === children.unique,
                  ).length
                : false
            "
            :element="children"
            :key="children.label"
          />
        </div>
        <hr class="my-2" />
      </template>
    </NodeMenuGraph>
  </div>
</template>

<script lang="ts" setup>
  import type { ModelRef } from 'vue';
  import { provide, useTemplateRef } from 'vue';

  import type {
    ActionsType,
    NodeGraphType,
    NodeType,
    SchemeGraphType,
  } from '@/types/index';
  import { ACTIONS_TYPE, NODE_GROUP_TYPE, SIDE_TYPE } from '@/types/index';

  import { useCore } from '@/composables/useCore';
  import { useLockScheme } from '@/composables/useLockScheme';

  import ActionsButtons from '@/components/ActionsButtons.vue';
  import ContainerGraph from '@/components/ContainerGraph.vue';
  import LockScheme from '@/components/LockScheme.vue';
  import NodeGraph from '@/components/NodeGraph.vue';
  import NodeMenuChildrenGraph from '@/components/NodeMenuChildrenGraph.vue';
  import NodeMenuGraph from '@/components/NodeMenuGraph.vue';
  import NodeMenuGroupGraph from '@/components/NodeMenuGroupGraph.vue';
  import NodePath from '@/components/NodePath.vue';
  import SchemeHistory from '@/components/SchemeHistory.vue';
  import SvgContainer from '@/components/SvgContainer.vue';
  import ThemeScheme from '@/components/ThemeScheme.vue';
  import ZoomGraph from '@/components/ZoomGraph.vue';

  const {
    isScaleActive = true,
    isMultiSelectActive = true,
    elements = [],
    isHistoryActive = true,
    lockScheme = false,
    isLockActive = true,
    actions = [ACTIONS_TYPE.SAVE_SCHEME, ACTIONS_TYPE.SAVE_DRAFT],
  } = defineProps<{
    actions?: ActionsType[];
    lockScheme?: boolean;
    isLockActive?: boolean;
    isScaleActive?: boolean;
    isHistoryActive?: boolean;
    isMultiSelectActive?: boolean;
    elements?: NodeType[];
  }>();

  const { setSchemeGraphReference } = useCore();
  const { getStateLockScheme, handleChangeStateLockScheme } = useLockScheme();
  setSchemeGraphReference(useTemplateRef('schemeContainer'));

  const schemeModel = defineModel<SchemeGraphType>('scheme', {
    required: true,
  });

  handleChangeStateLockScheme(lockScheme);
  provide<ModelRef<SchemeGraphType>>('sharedSchemeModel', schemeModel);

  const emit = defineEmits<{
    (e: 'on:save', type: ActionsType): void;
  }>();
</script>
