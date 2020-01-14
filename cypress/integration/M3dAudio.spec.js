import M3dAudio from "../../src/app";
context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:9000/')
    });
    it('constructor()', ()=>{
        cy.get('button:first').click();
    })
});
