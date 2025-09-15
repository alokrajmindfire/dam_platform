import '@testing-library/jest-dom'
global.TextEncoder = require('util').TextEncoder
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver
