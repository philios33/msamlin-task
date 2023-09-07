import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Home from './index'
import React from 'react';

test('Loads', async () => {
  // ARRANGE
  render(<Home />)

  // ACT
  // await userEvent.click(screen.getByText('Home'))

  // ASSERT
  expect(screen.getByRole('heading')).toHaveTextContent('Home')
});