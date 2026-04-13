<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = defineProps<{
  mathMl: string
}>()

const hostRef = ref<HTMLDivElement | null>(null)

function renderMathMl() {
  const host = hostRef.value

  if (!host) {
    return
  }

  host.replaceChildren()

  if (!props.mathMl.trim()) {
    return
  }

  const parsedDocument = new DOMParser().parseFromString(props.mathMl, 'application/xml')
  const mathNode = parsedDocument.documentElement

  if (mathNode.tagName === 'parsererror') {
    host.textContent = 'No se ha podido renderizar el MathML.'
    return
  }

  host.append(document.importNode(mathNode, true))
}

onMounted(renderMathMl)
watch(() => props.mathMl, renderMathMl)
</script>

<template>
  <div ref="hostRef" />
</template>
