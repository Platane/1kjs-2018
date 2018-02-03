///
///
///

const rails = Array.from({ length: 20 }).map((_, i) => ({
  x: i * 40 + 20 * Math.random(),
  y: 40 + i * 20 + 40 * Math.random(),
}))

const REBOUND_FACTOR = 1.7
const AIR_FRICTION = 0.05

// rails = [{ x: 50, y: 50 }, { x: 500, y: 200 }]

let cart_x = 80
let cart_y = 10

let cart_vx = 0
let cart_vy = 0

let mouse_x = 0
let mouse_y = 0

window.onmousemove = e => {
  mouse_x = e.clientX
  mouse_y = e.clientY
}

const loop = () => {
  // cart physic

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
    if (g > 0 && g < abl && d >= -6 && d < 12) {
      const u = nx * cart_vx + ny * cart_vy

      if (u < 0 || d < 0) {
        cart_x += (10 - d) * nx
        cart_y += (10 - d) * ny
      }

      debugger

      if (u < 0) {
        a_x -= nx * u * REBOUND_FACTOR
        a_y -= ny * u * REBOUND_FACTOR
      }

      // const r = console.log(d)
    }
  }

  // solid friction
  a_x -= cart_vx * AIR_FRICTION
  a_y -= cart_vy * AIR_FRICTION

  // step
  cart_x += cart_vx += a_x
  cart_y += cart_vy += a_y

  /////////
  ///////// draw
  /////////

  ctx.clearRect(0, 0, 9999, 9999)

  // draw rails
  for (let i = rails.length - 1; i--; ) {
    ctx.beginPath()
    ctx.moveTo(rails[i].x, rails[i].y)
    ctx.lineTo(rails[i + 1].x, rails[i + 1].y)
    ctx.stroke()
  }

  // draw cart
  ctx.beginPath()
  ctx.arc(cart_x, cart_y, 5, 0, Math.PI * 2)
  ctx.fill()

  // loop
  requestAnimationFrame(loop)
}
loop()
