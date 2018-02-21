///
///
///

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
  let v = 200

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

const curve = Array.from({ length: 800 }).map((_, x) => ({
  x,
  y: 100 + (x - 360) * (x - 360) * 0.001,
}))

let best_rails = [{ x: 10, y: curve[0].y }, { x: 650, y: curve[0].y }]

const wait = (delay = 0) => new Promise(resolve => setTimeout(resolve, delay))

const run = async () => {
  compute(best_rails)
  let best_error = diffTrace(pendulumTrace, curve)

  while (true) {
    for (let k = 50; k--; ) {
      // mutation
      let mutated_rails = best_rails.slice()

      switch (0 | (Math.random() * 30)) {
        case 0: {
          const k = 0 | (Math.random() * (mutated_rails.length - 1))

          mutated_rails.splice(k + 1, 0, {
            x: (mutated_rails[k].x + mutated_rails[k + 1].x) / 2,
            y:
              (mutated_rails[k].y + mutated_rails[k + 1].y) / 2 +
              (Math.random() - 0.5) * 100,
          })
        }
        default: {
          const k = 0 | (Math.random() * mutated_rails.length)

          mutated_rails[k] = {
            x: mutated_rails[k].x + (Math.random() - 0.5) * 10,
            y: mutated_rails[k].y + (Math.random() - 0.5) * 10,
          }
        }
      }

      compute(mutated_rails)

      const b = diffTrace(pendulumTrace, curve)

      if (b < best_error) {
        best_error = b
        best_rails = mutated_rails
      }
    }
    await wait(0)
  }
}

run()

let k = 1
let dd_rails
let d_rails = []
let d_pendulumTrace = []
let d_cartTrace = []

const loop = () => {
  if (k + 1 >= d_cartTrace.length) {
    if (dd_rails != best_rails) {
      compute(best_rails)

      dd_rails = best_rails
      d_rails = best_rails.map(({ x, y }) => ({ x, y }))
      d_cartTrace = cartTrace.map(({ x, y }) => ({ x, y }))
      d_pendulumTrace = pendulumTrace.map(({ x, y }) => ({ x, y }))

      k = 1
    }
  } else k++

  ctx.clearRect(0, 0, 9999, 9999)

  ctx.strokeStyle = "#ae18"
  trace(curve)

  ctx.clearRect(0, 0, 200, 999)
  ctx.clearRect(0, 600, 9999, 999)

  ctx.strokeStyle = "#aaa"
  trace(d_rails.slice(0, k))

  ctx.strokeStyle = "#a90"
  trace(d_pendulumTrace.slice(0, k))

  ctx.strokeStyle = "#a00"
  trace(d_cartTrace.slice(0, k))

  // draw pendulum
  ctx.strokeStyle = "#888"
  ctx.beginPath()
  ctx.moveTo(d_cartTrace[k].x, d_cartTrace[k].y)
  ctx.lineTo(d_pendulumTrace[k].x, d_pendulumTrace[k].y)
  ctx.stroke()

  ctx.fillStyle = "#aa0"
  ctx.beginPath()
  ctx.arc(d_pendulumTrace[k].x, d_pendulumTrace[k].y, 5, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#333"
  ctx.beginPath()
  ctx.arc(d_cartTrace[k].x, d_cartTrace[k].y, 5, 0, Math.PI * 2)
  ctx.fill()

  // loop
  requestAnimationFrame(loop)
}

loop()
