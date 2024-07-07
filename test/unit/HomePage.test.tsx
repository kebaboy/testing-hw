// check cur url

import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Home } from "../../src/client/pages/Home";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { renderApp } from "../utils";
import { Application } from "../../src/client/Application";

describe('Главная страница', () => {
    it('должна иметь статическое содержание', () => {
      const {container} = renderApp(<Application/>);

      expect(container).toMatchSnapshot('Главная страница');
    })
    // it('должна отображаться при инициализации приложения', () => {
    //     // const { container } = render(
    //     //     <MemoryRouter initialEntries={[basename]}>
    //     //         <App />
    //     //     </MemoryRouter>,
    //     // );


    //     // expect(container.querySelector('.Home')).toBeInTheDocument();

    //     // welcome title?
    // });
})

// test('landing on a bad page', () => {
//     const badRoute = '/some/bad/route'
  
//     // use <MemoryRouter> when you want to manually control the history
//     render(
//       <MemoryRouter initialEntries={[badRoute]}>
//         <App />
//       </MemoryRouter>,
//     )
  
//     // verify navigation to "no match" route
//     expect(screen.getByText(/no match/i)).toBeInTheDocument()
//   })