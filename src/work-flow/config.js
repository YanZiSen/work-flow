export let positionConfig = {
  left: {
    attr: 'cx',
    transform: {
      x: 1,
      y: 0
    },
    shape: {
      attr: 'width',
      dir: -1,
      eventAttr: 'dx'
    },
    eventAttr: 'dx',
    moveDir: 1
  },
  right: {
    attr: 'cx',
    eventAttr: 'dx',
    shape: {
      attr: 'width',
      dir: 1,
      eventAttr: 'dx'
    },
    moveDir: 1
  },
  top: {
    attr: 'cy',
    transform: {
      x: 0,
      y: 1
    },
    shape: {
      attr: 'height',
      dir: -1,
      eventAttr: 'dy'
    },
    eventAttr: 'dy',
    moveDir: 1
  },
  bottom: {
    attr: 'cy',
    shape: {
      attr: 'height',
      dir: 1,
      eventAttr: 'dy'
    },
    eventAttr: 'dy',
    moveDir: 1
  }
}

export default {
  positionConfig
}