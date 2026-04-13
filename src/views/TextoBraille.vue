<script setup lang="ts">
import { computed, ref } from 'vue'
import { convertBrailleToBlatText } from '../services/useBlat'
import { convertTextToTalpBraille } from '../services/useTalp'

type ConversionMode = 'text-to-braille' | 'braille-to-text'

const defaultText = `Texto normal con signos y mayusculas.

Formula en modo matematico: \`x^2 + y^2 = z^2\`
Fraccion: \`3/4\`
Integral: \`int_{0}^{1} x^2 dx\``

const defaultBraille = `{hola #abc
\\_x1#b+y1#b=z1#b_\\
\\_&#j:#a5x1#b_\\`

const mode = ref<ConversionMode>('text-to-braille')
const sourceValue = ref(defaultText)

const isTextToBraille = computed(() => mode.value === 'text-to-braille')
const sourceLabel = computed(() =>
  isTextToBraille.value ? 'Texto de entrada' : 'Braille de entrada',
)
const targetLabel = computed(() =>
  isTextToBraille.value ? 'Braille resultante' : 'Texto resultante',
)
const sourcePlaceholder = computed(() =>
  isTextToBraille.value
    ? 'Escribe texto y usa `...` para los fragmentos matematicos'
    : 'Escribe braille textual; usa \\_ y _\\ para modo matematico',
)
const helperText = computed(() =>
  isTextToBraille.value
    ? 'Los fragmentos matematicos siguen el convenio del CGI original: se delimitan con acentos graves.'
    : 'Se soportan numeros, signos y buena parte de la notacion matematica generada por TALP.',
)
const resultText = computed(() =>
  isTextToBraille.value
    ? convertTextToTalpBraille(sourceValue.value)
    : convertBrailleToBlatText(sourceValue.value),
)

function setMode(nextMode: ConversionMode) {
  mode.value = nextMode
  sourceValue.value = nextMode === 'text-to-braille' ? defaultText : defaultBraille
}
</script>

<template>
  <section>
    <h1 class="page-title">Texto y Braille</h1>
    <p class="page-copy">
      Conversor bidireccional en cliente para trabajar con texto plano y braille textual
      sin pasar por CGI ni generar HTML intermedio.
    </p>

    <div class="editor-card">
      <div class="conversion-switch" role="tablist" aria-label="Seleccionar conversion">
        <button
          type="button"
          class="conversion-switch-button"
          :class="{ active: isTextToBraille }"
          :aria-pressed="isTextToBraille ? 'true' : 'false'"
          @click="setMode('text-to-braille')"
        >
          Texto a Braille
        </button>
        <button
          type="button"
          class="conversion-switch-button"
          :class="{ active: !isTextToBraille }"
          :aria-pressed="!isTextToBraille ? 'true' : 'false'"
          @click="setMode('braille-to-text')"
        >
          Braille a Texto
        </button>
      </div>

      <div class="row g-4 mt-1">
        <div class="col-lg-6">
          <label class="form-label editor-label" for="texto-braille-source">{{ sourceLabel }}</label>
          <textarea
            id="texto-braille-source"
            v-model="sourceValue"
            class="form-control editor-textarea talp-textarea"
            rows="18"
            spellcheck="false"
            :placeholder="sourcePlaceholder"
          />
          <p class="status-text">{{ helperText }}</p>
        </div>

        <div class="col-lg-6">
          <label class="form-label editor-label" for="texto-braille-target">{{ targetLabel }}</label>
          <textarea
            id="texto-braille-target"
            class="form-control editor-textarea talp-textarea talp-output"
            :value="resultText"
            rows="18"
            readonly
          />
          <p class="status-text">La conversion se ejecuta en tiempo real en el navegador.</p>
        </div>
      </div>
    </div>
  </section>
</template>
