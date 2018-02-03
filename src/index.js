///
///
///

const rails = Array.from({ length: 20 }).map((_, i) => ({
  x: i * 40 + 20 * Math.random(),
  y: 40 + 3 * 20 + 40 * Math.random(),
}))

const crayon = []
const crayon2 = []

const REBOUND_FACTOR = 1.2
const AIR_FRICTION_PENDULUM = 0.04
const AIR_FRICTION_CART = 0.04
const ENGINE_POWER = 0.8

// rails = [{ x: 50, y: 50 }, { x: 500, y: 200 }]

let cart_x = 10
let cart_y = 50

let cart_vx = 4
let cart_vy = 0

let pendulum_x = 0
let pendulum_y = 60

let pendulum_vx = 0
let pendulum_vy = 0

//

let mouse_x = 0
let mouse_y = 0

window.onmousemove = e => {
  mouse_x = e.clientX
  mouse_y = e.clientY
}

const loop = () => {
  /////////
  ///////// cart physic
  /////////

  const g = 1
  let a_x = 0
  let a_y = g

  // cart_x = mouse_x
  // cart_y = mouse_y

  // contact rails
  for (let i = rails.length - 1; i--; ) {
    const a = rails[i]
    const b = rails[i + 1]

    // direction of the rail
    const abx = b.x - a.x
    const aby = b.y - a.y

    const abl = Math.sqrt(abx * abx + aby * aby)

    const nx = aby / abl
    const ny = -abx / abl

    // vector from one point of the rail to the cart
    const acx = cart_x - a.x
    const acy = cart_y - a.y

    // orthogonal distance to the rail
    const d = acx * nx + acy * ny

    // position on the rail
    const g = acx * abx / abl + acy * aby / abl

    // inside the rail
    if (g > 0 && g < abl && d >= -6 && d < 13) {
      const u = nx * cart_vx + ny * cart_vy

      if (u < 0 || d < 0) {
        cart_x += (10 - d) * nx
        cart_y += (10 - d) * ny
      }

      if (u < 0) {
        a_x -= nx * u * REBOUND_FACTOR
        a_y -= ny * u * REBOUND_FACTOR
      }

      // wheel friction
      a_x -= ny * ENGINE_POWER
      a_y += nx * ENGINE_POWER

      // const r = console.log(d)
    }
  }

  // solid friction
  a_x -= cart_vx * AIR_FRICTION_CART
  a_y -= cart_vy * AIR_FRICTION_CART

  // step
  cart_x += cart_vx += a_x
  cart_y += cart_vy += a_y

  /////////
  ///////// pendulum physic
  /////////

  a_x = 0
  a_y = g

  const pcx = cart_x - pendulum_x
  const pcy = cart_y - pendulum_y

  const pcl = Math.sqrt(pcx * pcx + pcy * pcy)

  if (pcl > 80) {
    const d = pcl - 80

    a_x += d * pcx / pcl
    a_y += d * pcy / pcl
  }

  // solid friction
  a_x -= pendulum_vx * AIR_FRICTION_PENDULUM
  a_y -= pendulum_vy * AIR_FRICTION_PENDULUM

  // step
  pendulum_x += pendulum_vx += a_x
  pendulum_y += pendulum_vy += a_y

  crayon.push({ x: cart_x, y: cart_y })
  crayon2.push({ x: pendulum_x, y: pendulum_y })

  /////////
  ///////// draw
  /////////

  ctx.clearRect(0, 0, 9999, 9999)

  // draw rails
  for (let i = rails.length - 1; i--; ) {
    ctx.strokeStyle = '#bbb'
    ctx.beginPath()
    ctx.moveTo(rails[i].x, rails[i].y)
    ctx.lineTo(rails[i + 1].x, rails[i + 1].y)
    ctx.stroke()
  }

  // draw crayon
  // for (let i = 1; i < crayon.length; i++) {
  //   ctx.strokeStyle = '#a00'
  //   ctx.beginPath()
  //   ctx.moveTo(crayon[i].x, crayon[i].y)
  //   ctx.lineTo(crayon[i - 1].x, crayon[i - 1].y)
  //   ctx.stroke()
  // }

  // draw crayon2
  for (let i = 1; i < crayon2.length; i++) {
    ctx.strokeStyle = '#a90'
    ctx.beginPath()
    ctx.moveTo(crayon2[i].x, crayon2[i].y)
    ctx.lineTo(crayon2[i - 1].x, crayon2[i - 1].y)
    ctx.stroke()
  }

  // draw pendulum
  ctx.strokeStyle = '#888'
  ctx.beginPath()
  ctx.moveTo(cart_x, cart_y)
  ctx.lineTo(pendulum_x, pendulum_y)
  ctx.stroke()

  ctx.fillStyle = '#aa0'
  ctx.beginPath()
  ctx.arc(pendulum_x, pendulum_y, 5, 0, Math.PI * 2)
  ctx.fill()

  // draw cart
  ctx.fillStyle = '#333'
  ctx.beginPath()
  ctx.arc(cart_x, cart_y, 5, 0, Math.PI * 2)
  ctx.fill()

  // loop
  requestAnimationFrame(loop)
}
loop()
