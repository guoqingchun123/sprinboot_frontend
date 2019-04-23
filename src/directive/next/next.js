export default {
  // eslint-disable-next-line
  inserted(el, binding, vnode) {
    const inputs = el.querySelectorAll('input, select, textarea, button')
    for( var i = 0; i < inputs.length; i++ ) {
      inputs[i].setAttribute("data-focus-index", i)
      inputs[i].addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
          let targetTo = event.srcElement.getAttribute('data-focus-to')
          if (targetTo) {
            this.$refs[targetTo].$el.focus()
          } else {
            var index = parseInt(event.srcElement.getAttribute('data-focus-index'))
            const nodeName = inputs[index].nodeName
            if (nodeName === 'INPUT' || nodeName === 'SELECT') {
              if (index < inputs.length - 1) {
                if (inputs[index + 1].nodeName === 'BUTTON') {
                  inputs[index + 1].focus()
                  inputs[index + 1].click()
                } else {
                  inputs[index + 1].focus()
                }
              }
            }
          }
        }
      })
    }
  }
}
