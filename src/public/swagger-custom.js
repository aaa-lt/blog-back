function waitForAuthWrapper() {
  const authContainer = document.querySelector('.swagger-ui .auth-wrapper');
  if (authContainer) {
    const authButton = authContainer.querySelector('button');

    const loginButton = authButton.cloneNode(true);
    loginButton.innerText = 'AUTO LOGIN';
    loginButton.style.marginInline = '10px';
    loginButton.style.display = 'block';
    authContainer.insertBefore(loginButton, authButton);
    loginButton.onclick = async function () {
      //TODO grab from /auth/login dto
      const email = 'user@example.com';
      const password = 'stringst';

      if (email && password) {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        console.log(data);

        if (data.accessToken) {
          const ui = window.ui;
          try {
            ui.authActions.authorize({
              bearer: {
                name: 'bearer',
                schema: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
                value: `${data.accessToken}`,
              },
            });
            console.info('Login successful!');
          } catch (error) {
            console.log(`Auth error: ${error}`);
          }
        } else {
          console.error('Login failed!');
        }
      }
    };
    authContainer.appendChild(loginButton);
  } else {
    setTimeout(waitForAuthWrapper, 100);
  }
}

waitForAuthWrapper();
