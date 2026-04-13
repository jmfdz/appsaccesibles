<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { latexToMathML } from '../lib/mathjax'

const defaultLatex = String.raw`a + b = c
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
a^2 + b^2 = c^2
\frac{d}{dx}\left(x^3\right) = 3x^2
\int_0^1 x^2 \, dx = \frac{1}{3}`

const latexInput = ref(defaultLatex)
const mathMlOutput = ref<string[]>([])
const errorMessage = ref('')
const importedFileName = ref('')
const showMathMlCode = ref(false)
const showInsertMenu = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const insertSnippets = [
  { label: 'Suma simple', value: String.raw`a + b = c` },
  { label: 'Fraccion', value: String.raw`\frac{a}{b}` },
  { label: 'Raiz cuadrada', value: String.raw`\sqrt{x^2 + y^2}` },
  { label: 'Valor absoluto', value: String.raw`|x - 3| = 5` },
  { label: 'Potencia', value: String.raw`x^n + y^n = z^n` },
  { label: 'Pitagoras', value: String.raw`a^2 + b^2 = c^2` },
  { label: 'Segundo grado', value: String.raw`x^2 + bx + c = 0` },
  { label: 'Formula general', value: String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}` },
  { label: 'Sistema 2x2', value: String.raw`\begin{cases} 2x + y = 5 \\ x - y = 1 \end{cases}` },
  { label: 'Logaritmo', value: String.raw`\log_a(xy) = \log_a x + \log_a y` },
  { label: 'Seno y coseno', value: String.raw`\sin(x)^2 + \cos(x)^2 = 1` },
  { label: 'Tangente', value: String.raw`\tan(\theta) = \frac{\sin(\theta)}{\cos(\theta)}` },
  { label: 'Limite', value: String.raw`\lim_{x \to 0} \frac{\sin x}{x} = 1` },
  { label: 'Sumatorio', value: String.raw`\sum_{n=1}^{\infty} \frac{1}{n^2}` },
  { label: 'Productorio', value: String.raw`\prod_{k=1}^{n} k = n!` },
  { label: 'Integral', value: String.raw`\int_0^1 x^2 \, dx = \frac{1}{3}` },
  { label: 'Derivada', value: String.raw`\frac{d}{dx}\left(x^3\right) = 3x^2` },
  { label: 'Matriz', value: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}` },
  { label: 'Determinante', value: String.raw`\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc` },
  { label: 'Euler', value: String.raw`e^{i\pi} + 1 = 0` },
]

function processLatex() {
  try {
    const lines = latexInput.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    mathMlOutput.value = lines.map((line) => latexToMathML(line))
    errorMessage.value = ''
  } catch (error) {
    mathMlOutput.value = []
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'No se ha podido convertir el contenido a MathML.'
  }
}

async function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const [file] = target.files ?? []

  if (!file) {
    return
  }

  importedFileName.value = file.name
  latexInput.value = await file.text()
  processLatex()
  target.value = ''
}

async function insertSnippet(snippet: string) {
  const textarea = textareaRef.value

  if (!textarea) {
    latexInput.value = latexInput.value
      ? `${latexInput.value}\n${snippet}`
      : snippet
    showInsertMenu.value = false
    return
  }

  const start = textarea.selectionStart ?? latexInput.value.length
  const end = textarea.selectionEnd ?? latexInput.value.length
  const prefix = latexInput.value.slice(0, start)
  const suffix = latexInput.value.slice(end)
  const needsLeadingBreak = prefix.length > 0 && !prefix.endsWith('\n')
  const needsTrailingBreak = suffix.length > 0 && !suffix.startsWith('\n')
  const insertedText =
    `${needsLeadingBreak ? '\n' : ''}${snippet}${needsTrailingBreak ? '\n' : ''}`
  const nextValue = `${prefix}${insertedText}${suffix}`
  const caretPosition = prefix.length + insertedText.length

  latexInput.value = nextValue
  showInsertMenu.value = false

  await nextTick()
  textarea.focus()
  textarea.setSelectionRange(caretPosition, caretPosition)
}

watch(latexInput, processLatex, { immediate: true })
</script>

<template>
  <section>
    <h1 class="page-title">Editor Cientifico</h1>
    <p class="page-copy">
      Convierte expresiones LaTeX a MathML y revisa el resultado en una vista
      paralela.
    </p>

    <div class="editor-card">
      <div class="editor-toolbar">
        <div>
          <div class="editor-label">Entrada LaTeX</div>
          <div class="status-text">
            {{
              importedFileName
                ? `Fichero importado: ${importedFileName}.`
                : 'Puedes escribir directamente o importar un fichero de texto con contenido LaTeX.'
            }}
          </div>
          <div class="status-text">
            El MathML se renderiza a la derecha y cada linea del textarea se
            procesa como una ecuacion independiente.
          </div>
        </div>

        <div class="toolbar-actions">
          <label class="btn btn-primary">
            Importar fichero
            <input
              class="d-none"
              type="file"
              accept=".tex,.txt,.latex,.md"
              @change="handleFileImport"
            />
          </label>

          <div class="insert-menu">
            <button
              type="button"
              class="btn btn-outline-primary dropdown-toggle"
              @click="showInsertMenu = !showInsertMenu"
            >
              Insertar
            </button>

            <div v-if="showInsertMenu" class="insert-menu-list">
              <button
                v-for="snippet in insertSnippets"
                :key="snippet.label"
                type="button"
                class="insert-menu-item"
                @click="insertSnippet(snippet.value)"
              >
                {{ snippet.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <label class="form-label editor-label" for="latex-input">LaTeX</label>
          <textarea
            id="latex-input"
            ref="textareaRef"
            v-model="latexInput"
            class="form-control editor-textarea"
            rows="20"
            spellcheck="false"
            placeholder="Escribe aqui tu formula o bloque LaTeX"
          />
        </div>

        <div class="col-md-6">
          <h2 class="panel-title">Salida MathML</h2>

          <div class="mathml-panel">
            <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>
            <template v-else-if="mathMlOutput.length">
              <div class="mathml-stack">
                <div
                  v-for="(equation, index) in mathMlOutput"
                  :key="index"
                  class="mathml-equation"
                  v-html="equation"
                />
              </div>

              <button
                type="button"
                class="btn btn-outline-secondary btn-sm mt-3"
                @click="showMathMlCode = !showMathMlCode"
              >
                {{ showMathMlCode ? 'Ocultar codigo HTML' : 'Ver codigo HTML' }}
              </button>

              <div v-if="showMathMlCode" class="mathml-source">
                <pre
                  v-for="(equation, index) in mathMlOutput"
                  :key="`source-${index}`"
                  class="mathml-source-block"
                >{{ equation }}</pre>
              </div>
            </template>
            <p v-else class="placeholder-copy">
              El MathML aparecera aqui cuando haya contenido valido.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
