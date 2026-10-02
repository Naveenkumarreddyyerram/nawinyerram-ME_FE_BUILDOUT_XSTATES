describe('CitySelector Component Tests', () => {
  beforeEach(() => {
    // This will run before each test in every describe block
    cy.visit('https://13.235.133.113:3000/'); // Adjust to the correct URL
  });

  
    it('Initial Render and Dropdown Presence Tests - renders all dropdowns correctly', () => {
      cy.get('select').should('have.length', 3);
    });
  
    it('Dropdown Population Tests - populates country dropdown with data from API', () => {
      cy.get('select').first().children('option').should('have.length.greaterThan', 245);
    });

    it('Dropdown Population Tests - populates state dropdown when a country (India) is selected', () => {
      cy.get('select').first().select('India');
      cy.get('select').eq(1).children('option').should('have.length.greaterThan', 35);
    });

    it('Dropdown Population Tests - populates city dropdown when a state (Goa) is selected', () => {
      cy.get('select').first().select('India');
      cy.get('select').eq(1).select('Goa');
      cy.get('select').eq(2).children('option').should('have.length.greaterThan', 10);
    });

    it('Location Selection and Display Tests - displays the selected location correctly', () => {
      cy.get('select').first().select('India');
      cy.get('select').eq(1).select('Goa');
      cy.get('select').last().select('Panaji');
      cy.get('div, span, h1, h2, h3, h4, h5, h6, p')
        .contains('You selected Panaji, Goa, India')
        .should('exist');
    });
  

  
    // it('handles country API error gracefully', () => {
    //   cy.intercept('GET', 'https://crio-location-selector.onrender.com/countries', {
    //     statusCode: 500
    //   }).as('getCountriesError');
    //   cy.wait('@getCountriesError');
    //   cy.get('select').eq(0).children().should('have.length', 1); 
    // });
    it('API Error Handling Tests - handles country API error gracefully', () => {
      // Intercept the API call for countries and simulate a server error
      cy.intercept('GET', 'https://location-selector.labs.crio.do/countries', {
        statusCode: 500
      }).as('getCountriesError');
  
      // Visit the page after setting up the intercept
      cy.visit('https://13.235.133.113:3000/'); // Adjust to the correct URL
  
      // Wait for the intercepted API call
      cy.wait('@getCountriesError').its('response.statusCode').should('eq', 500);
  
      // Check if the country dropdown does not populate with new options
      cy.get('select').first().children('option').should('have.length', 1); 
    });

    it('API Error Handling Tests - handles state API error gracefully when India is selected', () => {
      cy.intercept('GET', 'https://location-selector.labs.crio.do/country=India/states', {
        statusCode: 500
      }).as('getStatesError');
      cy.get('select').first().select('India');
      cy.wait('@getStatesError').its('response.statusCode').should('eq', 500);
      cy.get('select').eq(1).children('option').should('have.length', 1);
    });
});
