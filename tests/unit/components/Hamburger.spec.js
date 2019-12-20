import { shallowMount } from '@vue/test-utils'
import { BvHamburger } from '@bestvike/components'
describe('Hamburger.vue', () => {
  it('toggle click', () => {
    const wrapper = shallowMount(BvHamburger)
    const mockFn = jest.fn()
    wrapper.vm.$on('toggleClick', mockFn)
    wrapper.find('.hamburger').trigger('click')
    expect(mockFn).toBeCalled()
  })
  it('prop isActive', () => {
    const wrapper = shallowMount(BvHamburger)
    wrapper.setProps({ isActive: true })
    expect(wrapper.contains('.is-active')).toBe(true)
    wrapper.setProps({ isActive: false })
    expect(wrapper.contains('.is-active')).toBe(false)
  })
})
