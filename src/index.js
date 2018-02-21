///
///
///

let rails = Array.from({ length: 50 }).map((_, i) => ({
  x: i * 40 + 20 * Math.random(),
  y: 40 + 3 * 20 + 40 * Math.random(),
}))

const REBOUND_FACTOR = 1.2
const AIR_FRICTION_PENDULUM = 0.04
const AIR_FRICTION_CART = 0.04
const ENGINE_POWER = 0.8

// rails = [{ x: 50, y: 50 }, { x: 500, y: 200 }]

//
// let mouse_x = 0
// let mouse_y = 0
//
// window.onmousemove = e => {
//   mouse_x = e.clientX
//   mouse_y = e.clientY
// }

let pendulumTrace
let cartTrace
const compute = rails => {
  let cart_x = 10
  let cart_y = 50

  let cart_vx = 4
  let cart_vy = 0

  let pendulum_x = 0
  let pendulum_y = 60

  let pendulum_vx = 0
  let pendulum_vy = 0

  cartTrace = []
  pendulumTrace = []

  while (cart_x < 1000 && cartTrace.length < 1000) {
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

    cartTrace.push({ x: cart_x, y: cart_y })
    pendulumTrace.push({ x: pendulum_x, y: pendulum_y })
  }
}

compute(rails)

const trace = r => {
  ctx.beginPath()
  ctx.moveTo(r[0].x, r[0].y)
  for (let i = 1; i < r.length; i++) {
    ctx.lineTo(r[i].x, r[i].y)
  }
  ctx.stroke()
}

const diffTrace = (a, b) => {
  let err = 0
  let u = 0
  let v = 0

  while (v < 600) {
    u = v
    v = v + 10

    let min_a = 9999
    let max_a = -9999

    let min_b = 9999
    let max_b = -9999

    a.forEach(
      ({ x, y }) =>
        u < x && x <= v && (y < min_a && (min_a = y), y > max_a && (max_a = y))
    )

    b.forEach(
      ({ x, y }) =>
        u < x && x <= v && (y < min_b && (min_b = y), y > max_b && (max_b = y))
    )

    dc = min_a + max_a - (min_b + max_b)

    dl = max_a - min_a - (max_b - min_b)

    err += dc * dc + dl * dl
  }

  return err
}

const curve = Array.from({ length: 800 }).map((_, x) => ({ x, y: 100 }))

const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay))
const run = async () => {
  let best = 9999999999999999
  while (true) {
    for (let k = 50; k--; ) {
      r = Array.from({ length: 50 }).map((_, i) => ({
        x: i * 40 + 20 * Math.random(),
        y: 300 * Math.random(),
      }))

      compute(r)

      const b = diffTrace(pendulumTrace, curve)

      if (b < best) {
        best = b
        rails = r

        ctx.clearRect(0, 0, 999, 999)

        ctx.strokeStyle = "#ae18"
        trace(curve)

        ctx.strokeStyle = "#aaa"
        trace(rails)

        ctx.strokeStyle = "#a90"
        trace(pendulumTrace)

        ctx.strokeStyle = "#a00"
        trace(cartTrace)

        await wait(500)
      }
    }
    await wait(100)
  }
}

run()

// compute(rails)
//
// ctx.strokeStyle = "#ae18"
// trace(curve)
//
// ctx.strokeStyle = "#aaa"
// trace(rails)
//
// ctx.strokeStyle = "#a90"
// trace(pendulumTrace)
//
// ctx.strokeStyle = "#a00"
// trace(cartTrace)

// getCurve().then(x => {
//   ctx.clearRect(0, 0, 9999, 9999)
//   ctx.strokeStyle = "#a00"
//   trace(x)
// })

//
// const loop = () => {
//   /////////
//   ///////// draw
//   /////////
//
//   ctx.clearRect(0, 0, 9999, 9999)
//
//   // draw rails
//   for (let i = rails.length - 1; i--; ) {
//     ctx.strokeStyle = '#bbb'
//     ctx.beginPath()
//     ctx.moveTo(rails[i].x, rails[i].y)
//     ctx.lineTo(rails[i + 1].x, rails[i + 1].y)
//     ctx.stroke()
//   }
//
//   // draw crayon
//   // for (let i = 1; i < crayon.length; i++) {
//   //   ctx.strokeStyle = '#a00'
//   //   ctx.beginPath()
//   //   ctx.moveTo(crayon[i].x, crayon[i].y)
//   //   ctx.lineTo(crayon[i - 1].x, crayon[i - 1].y)
//   //   ctx.stroke()
//   // }
//
//   // draw crayon2
//   for (let i = 1; i < crayon2.length; i++) {
//     ctx.strokeStyle = '#a90'
//     ctx.beginPath()
//     ctx.moveTo(crayon2[i].x, crayon2[i].y)
//     ctx.lineTo(crayon2[i - 1].x, crayon2[i - 1].y)
//     ctx.stroke()
//   }
//
//   // draw pendulum
//   ctx.strokeStyle = '#888'
//   ctx.beginPath()
//   ctx.moveTo(cart_x, cart_y)
//   ctx.lineTo(pendulum_x, pendulum_y)
//   ctx.stroke()
//
//   ctx.fillStyle = '#aa0'
//   ctx.beginPath()
//   ctx.arc(pendulum_x, pendulum_y, 5, 0, Math.PI * 2)
//   ctx.fill()
//
//   // draw cart
//   ctx.fillStyle = '#333'
//   ctx.beginPath()
//   ctx.arc(cart_x, cart_y, 5, 0, Math.PI * 2)
//   ctx.fill()
//
//   // loop
//   requestAnimationFrame(loop)
// }
//
// loop()
