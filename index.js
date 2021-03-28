const REBOOT_KEY_NAME = 'needs_reboot'
const RESTART_KEY_NAME = 'needs_restart'
const REQUEST_TIME_KEY_NAME = 'last_request_at'

const Router = require('./router')
const router = new Router()

const ButtonsHtml = '<html lang=\'en\'><body><a href=\'/restart\'>Restart Hamachi</a>, <a href=\'/reboot\'>Reboot Server</a></body>'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest (request) {
  router.get('/status', handleStatusRequest)
  router.get('/reboot', handleRebootRequest)
  router.get('/restart', handleRestartRequest)
  router.get('/', handleWelcomePageRequest)

  return router.route(request)
}

async function handleWelcomePageRequest (request) {
  const last_request = await homeserver.get(REQUEST_TIME_KEY_NAME)
  const last_request_dt = new Date(Number(last_request));
  return new Response(ButtonsHtml + ', <br/>Last request: ' + last_request_dt.toUTCString(), {
    headers: { 'content-type': 'text/html' },
  })
}

async function handleRebootRequest (request) {
  await homeserver.put(REBOOT_KEY_NAME, 'yes')
  return new Response(JSON.stringify('OK'),
    { headers: { 'content-type': 'text/plain' } })
}

async function handleRestartRequest (request) {
  await homeserver.put(RESTART_KEY_NAME, 'yes')
  return new Response(JSON.stringify('OK'),
    { headers: { 'content-type': 'text/plain' } })
}

async function handleStatusRequest (request) {
  const need_reboot = await homeserver.get(REBOOT_KEY_NAME)
  const need_restart = await homeserver.get(RESTART_KEY_NAME)
  const reboot_status = need_reboot === 'yes'
  const restart_status = need_restart === 'yes'
  if (reboot_status) {
    homeserver.put(REBOOT_KEY_NAME, 'no')
  }
  if (restart_status) {
    homeserver.put(RESTART_KEY_NAME, 'no')
  }
  homeserver.put(REQUEST_TIME_KEY_NAME, Date.now())
  return new Response(
    JSON.stringify({ reboot: reboot_status, restart: restart_status }),
    { headers: { 'content-type': 'application/json' } })
}
