<template>
  <defs>
    <marker
      id="arrow"
      markerHeight="6"
      markerWidth="6"
      orient="auto"
      refX="16"
      refY="5"
      viewBox="0 0 10 10"
    >
      <path
        :fill="COLORS_PATH.ACTIVE"
        d="M0,0 L10,5 L0,10"
      />
    </marker>
  </defs>

  <defs>
    <filter id="glow">
      <feGaussianBlur
        in="SourceGraphic"
        result="blurred"
        stdDeviation="5"
      />
      <feMerge>
        <feMergeNode in="blurred" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <path
    :d="bezierPath"
    :opacity="connectionPath.options.opacity"
    :stroke="connectionPath.options.stroke"
    :stroke-width="connectionPath.options.strokeWidth"
    fill="transparent"
    marker-end="url(#arrow)"
  />

  <circle
    class="cursor-pointer"
    v-if="!isDummy"
    :cx="connectionPath.elasticState.currentX"
    :cy="connectionPath.elasticState.currentY - 25"
    :fill="colorControlElement"
    @click.prevent.stop="handleFireAction"
    @mouseout="isHoverControl = false"
    @mouseover="isHoverControl = true"
    r="12"
  />

  <text
    class="cursor-pointer select-none"
    v-html="textControlElement"
    v-if="
      !isDummy &&
      (typePath === CONNECTION_TYPE.boolean ||
        typePath === CONNECTION_TYPE.empty)
    "
    :fill="textControlColorElement"
    :x="connectionPath.elasticState.currentX"
    :y="connectionPath.elasticState.currentY - 20"
    @click.prevent.stop="handleFireAction"
    @mouseout="isHoverControl = false"
    @mouseover="isHoverControl = true"
    font-size="11"
    font-weight="500"
    text-anchor="middle"
  />

  <circle
    :cx="start.x"
    :cy="start.y"
    :fill="COLORS_PATH.ACTIVE"
    r="6"
  />
  <circle
    :cx="end.x"
    :cy="end.y"
    :fill="COLORS_PATH.ACTIVE"
    r="6"
  />
</template>

<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref } from 'vue';

  import { useLockScheme } from '@/composables/useLockScheme';
  import { useNodePath } from '@/composables/useNodePath';
  import { TRANSLATIONS } from '@/constants';
  import type {
    ConnectionType,
    PositionElementType,
    SideType,
  } from '@/types/index';
  import { COLORS_PATH, CONNECTION_TYPE, SIDE_TYPE } from '@/types/index';

  const { uid, isDummy, typePath, value } = defineProps<{
    uid: string;
    isDummy?: boolean;
    typePath?: ConnectionType;
    value?: string | number | boolean;
  }>();

  const { removePath } = useNodePath();
  const { getStateLockScheme } = useLockScheme();
  const activeSide = ref<SideType>(SIDE_TYPE.start);

  const end = defineModel<PositionElementType>('end', {
    required: true,
    get: value => {
      activeSide.value = SIDE_TYPE.end;
      nextTick(() => {
        if (!connectionPath.value.elasticIntervalId) {
          setForceElastic();
        }
      });
      return value;
    },
  });

  const start = defineModel<PositionElementType>('start', {
    required: true,
    get: value => {
      activeSide.value = SIDE_TYPE.start;
      nextTick(() => {
        if (!connectionPath.value.elasticIntervalId) {
          setForceElastic();
        }
      });
      return value;
    },
  });

  const connectionPath = ref({
    options: { opacity: 1, stroke: COLORS_PATH.DEFAULT, strokeWidth: 2 },
    controlPoint: { x: start.value.x, y: start.value.y },
    elasticState: {
      currentX: start.value.x,
      currentY: start.value.y,
      targetX: start.value.x,
      targetY: start.value.y,
      vX: 0,
      vY: 0,
    },
    controlPointOffset: 50,
    elasticIntervalId: null as number | null,
    stopCounter: 0,
    instance: null,
  });

  const isHoverControl = ref(false);
  const bezierPath = ref(
    `M ${start.value.x} ${start.value.y} Q ${connectionPath.value.controlPoint.x} ${connectionPath.value.controlPoint.y} ${end.value.x} ${end.value.y}`,
  );

  const colorControlElement = computed(() =>
    isHoverControl.value || typePath === CONNECTION_TYPE.empty
      ? COLORS_PATH.REMOVE
      : value
        ? COLORS_PATH.CONTROL_BOOLEAN_TRUE
        : COLORS_PATH.CONTROL_BOOLEAN_FALSE,
  );

  const textControlColorElement = computed(() =>
    isHoverControl.value || typePath === CONNECTION_TYPE.empty
      ? COLORS_PATH.REMOVE_TEXT
      : COLORS_PATH.DEFAULT_TEXT,
  );

  const textControlElement = computed(() =>
    isHoverControl.value || typePath === CONNECTION_TYPE.empty
      ? !getStateLockScheme()
        ? 'X'
        : ''
      : value
        ? TRANSLATIONS.LABELS.YES
        : TRANSLATIONS.LABELS.NO,
  );

  const setForceElastic = () => {
    if (!connectionPath.value.controlPoint) return;
    if (!connectionPath.value.elasticIntervalId) {
      connectionPath.value.elasticIntervalId = setInterval(() => {
        const midX = (start.value.x + end.value.x) / 2;
        const midY = (start.value.y + end.value.y) / 2;
        connectionPath.value.elasticState.targetX = midX;
        connectionPath.value.elasticState.targetY =
          midY + connectionPath.value.controlPointOffset;

        const elastic = connectionPath.value.elasticState;

        elastic.vX += (elastic.targetX - elastic.currentX) * 0.4;
        elastic.currentX += elastic.vX *= 0.9;

        elastic.vY += (elastic.targetY - elastic.currentY) * 0.4;
        elastic.currentY += elastic.vY *= 0.9;

        connectionPath.value.controlPoint.x = elastic.currentX;
        connectionPath.value.controlPoint.y = elastic.currentY;

        bezierPath.value = `M ${start.value.x} ${start.value.y} Q ${elastic.currentX} ${elastic.currentY} ${end.value.x} ${end.value.y}`;

        checkAnimationEnd(
          parseInt(elastic.vX.toFixed(0), 10),
          parseInt(elastic.vY.toFixed(0), 10),
        );
      }, 1000 / 40);
    }
  };

  const checkAnimationEnd = (elasticX: number, elasticY: number) => {
    if (!connectionPath.value.elasticIntervalId) return;
    if (elasticX === 0 && elasticY === 0) {
      connectionPath.value.stopCounter++;
      if (connectionPath.value.stopCounter > 10) {
        connectionPath.value.stopCounter = 0;
        clearInterval(connectionPath.value.elasticIntervalId);
        connectionPath.value.elasticIntervalId = null;
      }
    } else {
      connectionPath.value.stopCounter = 0;
    }
  };

  const handleFireAction = () => {
    if (getStateLockScheme()) {
      return;
    }
    if (
      typePath === CONNECTION_TYPE.boolean ||
      typePath === CONNECTION_TYPE.empty
    ) {
      removePath(uid);
    }
  };

  onMounted(() => {
    setForceElastic();
  });
</script>
