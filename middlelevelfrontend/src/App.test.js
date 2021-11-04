import { render, screen } from '@testing-library/react';
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders learn react link', () => {
  render(<App />, container);
  const linkElement = screen.getByText(/Generate New Map/i);
  expect(linkElement).toBeInTheDocument();
});

test('creates new map when clicked', () => {
  const onChange = jest.fn();
  act(() => {
    render(<App onChange={onChange} />, container);
  });
  
  const button = document.querySelector("[data-testid=generatebtn]");
  expect(button.innerHTML).toBe("Generate New Map");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
});

test('get coordinates from backend', () => {
  const onChange = jest.fn();
  act(() => {
    render(<App onChange={onChange} />, container);
  });
  
  const button = document.querySelector("[data-testid=drivebtn]");
  expect(button.innerHTML).toBe("drive");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
});
