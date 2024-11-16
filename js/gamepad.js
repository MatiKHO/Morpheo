function handleGamepadInput() {
  const gamepads = navigator.getGamepads();
  if (!gamepads[0]) return;

  const gp = gamepads[0];

  // D-pad buttons
  const dpadUp = gp.buttons[12].pressed;
  const dpadLeft = gp.buttons[14].pressed;
  const dpadDown = gp.buttons[13].pressed;
  const dpadRight = gp.buttons[15].pressed;
  const optionsButton = gp.buttons[9].pressed;
  const xButton = gp.buttons[0].pressed;
  const sqrButton = gp.buttons[2].pressed;

  // Joystick axes
  const leftStickX = gp.axes[0];
  const leftStickY = gp.axes[1];

  // Combine D-pad and joystick inputs
  keys.w.pressed = dpadUp || leftStickY < -0.1;
  keys.a.pressed = dpadLeft || leftStickX < -0.1;
  keys.s.pressed = dpadDown || leftStickY > 0.1;
  keys.d.pressed = dpadRight || leftStickX > 0.1;
  keys.enter.pressed = xButton || optionsButton;

  if (sqrButton) {
    player.attack();
  }
}

function gameLoop() {
  handleGamepadInput();
  requestAnimationFrame(gameLoop);
}

gameLoop();
