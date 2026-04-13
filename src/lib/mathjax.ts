import { mathjax } from 'mathjax-full/js/mathjax.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { SerializedMmlVisitor } from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js'
import { STATE } from 'mathjax-full/js/core/MathItem.js'

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)

const tex = new TeX({
  packages: ['base', 'ams'],
})

const mathDocument = mathjax.document('', {
  InputJax: tex,
})

const mmlVisitor = new SerializedMmlVisitor()

export function latexToMathML(latex: string): string {
  const value = latex.trim()

  if (!value) {
    return ''
  }

  const mathMlNode = mathDocument.convert(value, {
    display: true,
    end: STATE.CONVERT,
  })

  return mmlVisitor.visitTree(mathMlNode)
}
