import { render, screen } from '@testing-library/react';
import React from 'react';
import About from '../src/app/about/page';

import '@testing-library/jest-dom';

describe('About component', () => {
  it('renders the diagram image', () => {
    render(<About />);

    const diagramImage = screen.getByAltText('tic tac toe diagram');
    expect(diagramImage).toBeInTheDocument();
    expect(diagramImage).toHaveAttribute('width', '800');
  });
});
