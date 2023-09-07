import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import React from 'react';
import App from './app';
import { createStore } from "./store";
import { Provider } from 'react-redux';

test('Full App rendering, navigating and login', async () => {
  const store = createStore();

  render(<Provider store={store}><App backendHost="http://localhost:8081" /></Provider>)

  const user = userEvent.setup()

  expect(screen.getByRole('heading')).toHaveTextContent('Home');

  await user.click(screen.getByText(/Login/i));
  expect(screen.getByRole('heading')).toHaveTextContent('Login');

  // Fill in form
  const emailInput = screen.getByLabelText('Email:');
  const passwordInput = screen.getByLabelText('Password:');

  await user.type(emailInput, 'phil@code67.com');
  await user.type(passwordInput, 'wrong');

  await user.click(screen.getByRole('button', {
      name: 'Login',
  }));

  expect(await screen.findByText(/Invalid email or password/, {}, {timeout:5000})).toBeVisible();

  // Then enter correct credentials
  await user.clear(emailInput);
  await user.clear(passwordInput);

  await user.type(emailInput, 'phil@code67.com');
  await user.type(passwordInput, 'myPass123!');

  await user.click(screen.getByRole('button', {
      name: 'Login',
  }));

  expect(await screen.findByText(/Logged in as/, {}, {timeout:5000})).toBeVisible();
  // Check we get redirected to the secure page
  expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Secure section');
  

}, 10000);

